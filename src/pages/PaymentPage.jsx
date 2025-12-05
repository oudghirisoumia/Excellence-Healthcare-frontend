import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import api from "../api"
import "../styles/PaymentPage.css"

export default function PaymentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const orderData = location.state?.orderData

  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState("")
  const [loading, setLoading] = useState(false)
  const [showCardForm, setShowCardForm] = useState(false)

  const [cardData, setCardData] = useState({
    card_number: "",
    card_holder: "",
    card_expiry: "",
    card_cvc: "",
  })

  useEffect(() => {
    if (!orderData) {
      navigate("/cart")
      return
    }
    loadPaymentMethods()
  }, [])

  const loadPaymentMethods = async () => {
    try {
      const res = await api.get("/payment-methods")
      setPaymentMethods(res.data)
    } catch (err) {
      console.error("Erreur chargement méthodes", err)
    }
  }

  const handleCardInputChange = (e) => {
    let { name, value } = e.target

    // Format card number
    if (name === "card_number") {
      value = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim()
    }

    // Format expiry
    if (name === "card_expiry") {
      value = value.replace(/\D/g, "").replace(/(\d{2})(\d{0,2})/, "$1/$2")
    }

    setCardData(prev => ({ ...prev, [name]: value }))
  }

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert("Veuillez sélectionner une méthode de paiement")
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...orderData,
        payment_method: selectedMethod,
        ...(selectedMethod === "card" && cardData),
      }

      const res = await api.post("/orders", payload)

      if (res.data.payment_data?.redirect_url) {
        // Redirect to external payment gateway
        window.location.href = res.data.payment_data.redirect_url
      } else if (res.data.payment_data?.status === "completed") {
        // Payment completed
        navigate("/order-confirmation", {
          state: { order: res.data.order }
        })
      } else {
        // Payment pending (COD, Bank Transfer)
        navigate("/order-confirmation", {
          state: { order: res.data.order }
        })
      }
    } catch (err) {
      console.error("Erreur paiement:", err)
      alert("Erreur: " + (err.response?.data?.message || "Échec du paiement"))
    } finally {
      setLoading(false)
    }
  }

  if (!orderData) return null

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>💳 Paiement</h1>

        <div className="payment-content">
          {/* Payment Methods */}
          <div className="payment-methods-section">
            <h2>Choisissez votre méthode de paiement</h2>

            <div className="payment-methods">
              {/* Cash on Delivery */}
              <div
                className={`payment-method ${selectedMethod === "cash" ? "selected" : ""}`}
                onClick={() => {
                  setSelectedMethod("cash")
                  setShowCardForm(false)
                }}
              >
                <div className="method-icon">💵</div>
                <div className="method-info">
                  <h3>Paiement à la livraison</h3>
                  <p>Payez en espèces lors de la réception</p>
                  <span className="method-fee">+6.90 DH</span>
                </div>
              </div>

              {/* Card Payment */}
              <div
                className={`payment-method ${selectedMethod === "card" ? "selected" : ""}`}
                onClick={() => {
                  setSelectedMethod("card")
                  setShowCardForm(true)
                }}
              >
                <div className="method-icon">💳</div>
                <div className="method-info">
                  <h3>Carte bancaire</h3>
                  <p>Visa, Mastercard, Amex</p>
                  <div className="card-logos">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                  </div>
                </div>
              </div>

              {/* CMI Payment */}
              <div
                className={`payment-method ${selectedMethod === "cmi" ? "selected" : ""}`}
                onClick={() => {
                  setSelectedMethod("cmi")
                  setShowCardForm(false)
                }}
              >
                <div className="method-icon">🏦</div>
                <div className="method-info">
                  <h3>CMI Payment</h3>
                  <p>Paiement sécurisé par CMI</p>
                </div>
              </div>

              {/* Bank Transfer */}
              <div
                className={`payment-method ${selectedMethod === "bank_transfer" ? "selected" : ""}`}
                onClick={() => {
                  setSelectedMethod("bank_transfer")
                  setShowCardForm(false)
                }}
              >
                <div className="method-icon">🏛️</div>
                <div className="method-info">
                  <h3>Virement bancaire</h3>
                  <p>Virement sur notre compte</p>
                </div>
              </div>
            </div>

            {/* Card Form */}
            {showCardForm && selectedMethod === "card" && (
              <div className="card-form">
                <h3>Informations de carte</h3>

                <div className="form-group">
                  <label>Numéro de carte</label>
                  <input
                    type="text"
                    name="card_number"
                    value={cardData.card_number}
                    onChange={handleCardInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                </div>

                <div className="form-group">
                  <label>Titulaire de la carte</label>
                  <input
                    type="text"
                    name="card_holder"
                    value={cardData.card_holder}
                    onChange={handleCardInputChange}
                    placeholder="MOHAMMED ALAMI"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date d'expiration</label>
                    <input
                      type="text"
                      name="card_expiry"
                      value={cardData.card_expiry}
                      onChange={handleCardInputChange}
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                  </div>

                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="card_cvc"
                      value={cardData.card_cvc}
                      onChange={handleCardInputChange}
                      placeholder="123"
                      maxLength="4"
                    />
                  </div>
                </div>

                <div className="security-note">
                  <i className="fas fa-lock"></i>
                  <span>Paiement sécurisé SSL 256-bit</span>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Récapitulatif de la commande</h3>

            <div className="summary-item">
              <span>Sous-total</span>
              <span>{orderData.subtotal?.toFixed(2)} DH</span>
            </div>

            <div className="summary-item">
              <span>Livraison</span>
              <span>{orderData.shipping_fee?.toFixed(2)} DH</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>{orderData.total?.toFixed(2)} DH</span>
            </div>

            <button
              className="pay-button"
              onClick={handlePayment}
              disabled={!selectedMethod || loading}
            >
              {loading ? (
                "Traitement..."
              ) : (
                <>
                  <i className="fas fa-lock"></i>
                  Payer {orderData.total?.toFixed(2)} DH
                </>
              )}
            </button>

            <div className="secure-badge">
              <i className="fas fa-shield-alt"></i>
              <span>Paiement 100% sécurisé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}