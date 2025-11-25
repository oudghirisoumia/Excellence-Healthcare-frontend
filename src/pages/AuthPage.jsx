"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"  // ←  axios instance[](http://localhost:8000/api)
import "../styles/auth.css"

export default function AuthPage() {
  const [mode, setMode] = useState("login")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Shared handler for both login & register
  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    try {
      let response

      if (mode === "login") {
        response = await api.post("/login", {
          email: data.email,
          password: data.password,
        })
      } else {
        // Register
        response = await api.post("/register", {
          email: data.email,
          password: data.password,
          password_confirmation: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone || null,
          address: data.address || null,
          city: data.city || null,
          type: data.type || "b2c",
          // B2B fields (only sent if type === b2b)
          ...(data.type === "b2b" && {
            companyName: data.companyName,
            taxId: data.taxId,
            licenseNumber: data.licenseNumber,
          }),
        })
      }

      // Success → save token + redirect
      const token = response.data.token
      const user = response.data.user

      localStorage.setItem("token", token)
      // Optional: save user info
      localStorage.setItem("user", JSON.stringify(user))

      // Success message
      alert(mode === "login" ? "Connexion réussie !" : "Inscription réussie !")

      // Redirect to home
      navigate("/")
      
    } catch (err) {
      const msg = err.response?.data?.error || 
                  err.response?.data?.errors?.email?.[0] || 
                  err.response?.data?.message || 
                  "Une erreur est survenue"
      setError(msg)
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
          <button className={`tab-button ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>
            Connexion
          </button>
          <button className={`tab-button ${mode === "signup" ? "active" : ""}`} onClick={() => setMode("signup")}>
            Inscription
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

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

              <div className="form-row">
                <label>
                  <input type="radio" name="type" value="b2c" defaultChecked /> Particulier (B2C)
                </label>
                <label>
                  <input type="radio" name="type" value="b2b" /> Professionnel (B2B)
                </label>
              </div>
            </>
          )}

          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Mot de passe" required minLength="8" />

          {mode === "signup" && (
            <p className="text-xs text-gray-500">Minimum 8 caractères</p>
          )}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Patientez..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>

        <div className="auth-footer">
          {mode === "login" ? (
            <p>Mot de passe oublié ? <a href="#">Réinitialiser</a></p>
          ) : (
            <p>Déjà un compte ? <span onClick={() => setMode("login")} className="link">Se connecter</span></p>
          )}
        </div>
      </div>
    </div>
  )
}