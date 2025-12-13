"use client"

import { useState } from "react"
import AccountTypeSelector from "./AccountTypeSelector"
import B2CForm from "./B2CForm"
import B2BForm from "./B2BForm"
import "../styles/forms.css"

export default function SignupForm() {
  const [accountType, setAccountType] = useState(null)

  return (
    <div className="signup-wrapper">
      {!accountType ? (
        <AccountTypeSelector onSelect={setAccountType} />
      ) : (
        <div>
          <button className="back-button" onClick={() => setAccountType(null)}>
            <i className="fas fa-arrow-left"></i> Retour au choix
          </button>
          {accountType === "b2c" ? <B2CForm /> : <B2BForm />}
        </div>
      )}
    </div>
  )
}
