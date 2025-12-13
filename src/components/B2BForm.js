"use client"

import { useState } from "react"
import "../styles/forms.css"

export default function B2BForm() {
  const [formData, setFormData] = useState({
    pharmacyName: "",
    ice: "",
    licenseNumber: "",
    professionalEmail: "",
    professionalPhone: "",
    pharmacyAddress: "",
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

    if (!formData.pharmacyName) newErrors.pharmacyName = "Nom de pharmacie requis"
    if (!formData.ice) newErrors.ice = "ICE requis"
    if (!formData.licenseNumber) newErrors.licenseNumber = "Numéro de licence requis"
    if (!formData.professionalEmail) newErrors.professionalEmail = "Email professionnel requis"
    if (!formData.professionalPhone) newErrors.professionalPhone = "Téléphone requis"
    if (!formData.pharmacyAddress) newErrors.pharmacyAddress = "Adresse requise"
    if (!formData.password) newErrors.password = "Mot de passe requis"
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
    }

    if (Object.keys(newErrors).length === 0) {
      console.log("B2B Signup:", formData)
      alert("Inscription réussie! Votre compte sera validé sous 24-48h.")
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form b2b-form">
      <div className="form-group">
        <label htmlFor="pharmacyName">Nom de la pharmacie *</label>
        <div className="input-wrapper">
          <i className="fas fa-hospital"></i>
          <input
            type="text"
            id="pharmacyName"
            name="pharmacyName"
            placeholder="Pharmacie Al Farabi"
            value={formData.pharmacyName}
            onChange={handleChange}
          />
        </div>
        {errors.pharmacyName && <span className="error">{errors.pharmacyName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="ice">Identifiant fiscal (ICE) *</label>
        <div className="input-wrapper">
          <i className="fas fa-id-card"></i>
          <input
            type="text"
            id="ice"
            name="ice"
            placeholder="00000000000000"
            value={formData.ice}
            onChange={handleChange}
          />
        </div>
        {errors.ice && <span className="error">{errors.ice}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="licenseNumber">Numéro de licence pharmacie *</label>
        <div className="input-wrapper">
          <i className="fas fa-certificate"></i>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            placeholder="PH-XXXX-YYYY"
            value={formData.licenseNumber}
            onChange={handleChange}
          />
        </div>
        {errors.licenseNumber && <span className="error">{errors.licenseNumber}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="professionalEmail">Email professionnel *</label>
        <div className="input-wrapper">
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            id="professionalEmail"
            name="professionalEmail"
            placeholder="contact@pharmacie.ma"
            value={formData.professionalEmail}
            onChange={handleChange}
          />
        </div>
        {errors.professionalEmail && <span className="error">{errors.professionalEmail}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="professionalPhone">Téléphone professionnel *</label>
        <div className="input-wrapper">
          <i className="fas fa-phone"></i>
          <input
            type="tel"
            id="professionalPhone"
            name="professionalPhone"
            placeholder="+212 XXX XXX XXX"
            value={formData.professionalPhone}
            onChange={handleChange}
          />
        </div>
        {errors.professionalPhone && <span className="error">{errors.professionalPhone}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="pharmacyAddress">Adresse de la pharmacie *</label>
        <div className="input-wrapper">
          <i className="fas fa-map-marker-alt"></i>
          <input
            type="text"
            id="pharmacyAddress"
            name="pharmacyAddress"
            placeholder="Avenue Hassan II, Casablanca"
            value={formData.pharmacyAddress}
            onChange={handleChange}
          />
        </div>
        {errors.pharmacyAddress && <span className="error">{errors.pharmacyAddress}</span>}
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

      <div className="form-note">
        <i className="fas fa-info-circle"></i>
        <p>
          Note : Votre compte B2B sera validé sous 24-48h après vérification de vos documents. Vous recevrez un email de
          confirmation.
        </p>
      </div>

      <button type="submit" className="btn-primary">
        Créer mon compte
      </button>
    </form>
  )
}
