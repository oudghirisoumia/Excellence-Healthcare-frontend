"use client"

import { useState } from "react"
import "../styles/forms.css"
<<<<<<< HEAD
=======
import { toast } from "react-toastify"
>>>>>>> main

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.email) newErrors.email = "Email requis"
    if (!formData.password) newErrors.password = "Mot de passe requis"

    if (Object.keys(newErrors).length === 0) {
      console.log("Login:", formData)
<<<<<<< HEAD
      alert("Connexion réussie!")
=======
      toast.success("Connexion réussie!")
>>>>>>> main
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <div className="input-wrapper">
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Mot de passe *</label>
        <div className="input-wrapper">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Au moins 8 caractères"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div className="form-group checkbox">
        <input
          type="checkbox"
          id="rememberMe"
          name="rememberMe"
          checked={formData.rememberMe}
          onChange={handleChange}
        />
        <label htmlFor="rememberMe">Se souvenir de moi</label>
      </div>

      <a href="#" className="forgot-password">
        Mot de passe oublié ?
      </a>

      <button type="submit" className="btn-primary">
        Se connecter
      </button>
    </form>
  )
}
