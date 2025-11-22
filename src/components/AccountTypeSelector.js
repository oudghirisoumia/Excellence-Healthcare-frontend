"use client"
import "../styles/account-type.css"

export default function AccountTypeSelector({ onSelect }) {
  return (
    <div className="account-type-selector">
      <h3>Type de compte</h3>

      <div className="account-options">
        <button className="account-option" onClick={() => onSelect("b2c")}>
          <div className="option-header">
            <i className="fas fa-user"></i>
            <span>Particulier (B2C)</span>
          </div>
          <p>Pour vos achats personnels de produits de parapharmacies</p>
        </button>

        <button className="account-option selected" onClick={() => onSelect("b2b")}>
          <div className="option-header">
            <i className="fas fa-store"></i>
            <span>Professionnel - Pharmacie (B2B)</span>
          </div>
          <p>Pour les pharmacies et professionnels de santé. Tarifs préférentiels et commandes en gros.</p>
        </button>
      </div>
    </div>
  )
}
