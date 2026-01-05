"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import api from "../api"
import "../styles/auth.css"
import { useAuth } from "../context/AuthContext"

export default function AuthPage() {
  const [mode, setMode] = useState("login")
  const [loading, setLoading] = useState(false)
  const [accountType, setAccountType] = useState("b2c")

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    try {
      // LOGIN
      if (mode === "login") {
        await login(data.email, data.password)
        toast.success("Connexion réussie")
        navigate("/")
        return
      }

      // REGISTER
      await api.post("/register", {
        email: data.email,
        password: data.password,
        password_confirmation: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        address: data.address || null,
        city: data.city || null,
        type: accountType,

        ...(accountType === "b2b" && {
          companyName: data.companyName,
          taxId: data.taxId,
          licenseNumber: data.licenseNumber,
        }),
      })

      await login(data.email, data.password)
      toast.success("Inscription réussie")
      navigate("/")

    } catch (err) {
      const msg =
        err.response?.status === 403
          ? "Votre compte B2B est en attente de validation par un administrateur."
          : err.response?.data?.error ||
            err.response?.data?.errors?.email?.[0] ||
            err.response?.data?.message ||
            "Une erreur est survenue"

      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Connexion / Inscription</h2>
          <p>Accédez à votre compte parapharmacie</p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`tab-button ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Connexion
          </button>
          <button
            type="button"
            className={`tab-button ${mode === "signup" ? "active" : ""}`}
            onClick={() => setMode("signup")}
          >
            Inscription
          </button>
        </div>

        <form onSubmit={handleAuth} className="auth-form">
          {mode === "signup" && (
            <>
              <div className="form-row">
                <input name="firstName" type="text" placeholder="Prénom" required />
                <input name="lastName" type="text" placeholder="Nom" required />
              </div>

              <input name="phone" type="text" placeholder="Téléphone (optionnel)" />

              <div className="form-row">
                <input name="address" type="text" placeholder="Adresse (optionnel)" />
                <input name="city" type="text" placeholder="Ville (optionnel)" />
              </div>

              <div className="form-row radio-row">
                <label>
                  <input
                    type="radio"
                    checked={accountType === "b2c"}
                    onChange={() => setAccountType("b2c")}
                  />
                  Particulier (B2C)
                </label>

                <label>
                  <input
                    type="radio"
                    checked={accountType === "b2b"}
                    onChange={() => setAccountType("b2b")}
                  />
                  Professionnel (B2B)
                </label>
              </div>

              {accountType === "b2b" && (
                <>
                  <input name="companyName" type="text" placeholder="Nom de la société" required />
                  <input name="taxId" type="text" placeholder="Identifiant fiscal" required />
                  <input name="licenseNumber" type="text" placeholder="Numéro de licence" required />
                </>
              )}
            </>
          )}

          <input name="email" type="email" placeholder="Email" required />
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            minLength="8"
            required
          />

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Patientez..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>
      </div>
    </div>
  )
}
