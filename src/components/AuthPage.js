"use client"

import { useState } from "react"
import LoginForm from "../components/LoginForm"
import SignupForm from "../components/SignupForm"
import "../styles/auth.css"

export default function AuthPage() {
  const [mode, setMode] = useState("login")

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Connexion / Inscription</h2>
          <p>Connectez-vous à votre compte ou inscrivez-vous pour accéder à nos services.</p>
        </div>

        <div className="auth-tabs">
          <button className={`tab-button ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>
            Connexion
          </button>
          <button className={`tab-button ${mode === "signup" ? "active" : ""}`} onClick={() => setMode("signup")}>
            Inscription
          </button>
        </div>

        <div className="auth-content">{mode === "login" ? <LoginForm /> : <SignupForm />}</div>
      </div>
    </div>
  )
}
