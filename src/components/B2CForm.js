"use client"

import { useState } from "react"
import "../styles/forms.css"
import { toast } from "react-toastify"

export default function B2CForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.firstName) newErrors.firstName = "Prénom requis"
    if (!formData.lastName) newErrors.lastName = "Nom requis"
    if (!formData.email) newErrors.email = "Email requis"
    if (!formData.address) newErrors.address = "Adresse requise"
    if (!formData.city) newErrors.city = "Ville requise"
    if (!formData.password) newErrors.password = "Mot de passe requis"
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
    }

    if (Object.keys(newErrors).length === 0) {
      console.log("B2C Signup:", formData)
      toast.success("Inscription réussie !")
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form b2c-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">Prénom *</label>
          <div className="input-wrapper">
            <i className="fas fa-user"></i>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Prénom"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Nom *</label>
          <div className="input-wrapper">
            <i className="fas fa-user"></i>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Nom"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>
      </div>

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
        <label htmlFor="address">Adresse</label>
        <div className="input-wrapper">
          <i className="fas fa-map-marker-alt"></i>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Votre adresse"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        {errors.address && <span className="error">{errors.address}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="city">Ville</label>
        <div className="input-wrapper">
          <i className="fas fa-city"></i>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Casablanca, Rabat, Fès..."
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        {errors.city && <span className="error">{errors.city}</span>}
      </div>

      <div className="form-row">
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

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer mot de passe *</label>
          <div className="input-wrapper">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Retapez votre mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>
      </div>

      <button type="submit" className="btn-primary">
        Créer mon compte
      </button>
    </form>
  )
}
