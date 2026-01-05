import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import StripeCheckoutForm from "../components/StripeCheckoutForm"
import "../styles/CheckoutPage.css"
import { Box, Zap, DollarSign, Store } from "lucide-react"

import { useAuth } from "../context/AuthContext"

export default function CheckoutPage({ cart }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.type === "b2b" && !user?.approved) {
      navigate("/waiting-approval")
    }
  }, [user])

  const cartItems = () =>
    cart.map(item => {
      const price = parseFloat(
        item.product?.prix_detail ||
        item.prix_detail ||
        0
      )

      return {
        product_id: item.product_id || item.product?.id || item.id,
        quantity: parseInt(item.quantity) || 1,
        price: price,
        total: price * (parseInt(item.quantity) || 1),
      }
    })

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [personalInfo, setPersonalInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  })

  const [deliveryInfo, setDeliveryInfo] = useState({
    delivery_mode: "",
    carrier: "",
    time_slot: "",
    notes: "",
  })

  const getPaymentMethodFromDelivery = (deliveryMode) => {
    return deliveryMode === "cash" ? "cash" : "stripe"
  }

  const deliveryModes = [
    { id: "standard", name: "Standard", icon: Box, desc: "3-5 jours", prix_detail: 4.9 },
    { id: "express", name: "Express", icon: Zap, desc: "24h", prix_detail: 12.9 },
    { id: "cash", name: "À la livraison", icon: DollarSign, desc: "Paiement livraison", prix_detail: 6.9 },
    { id: "pickup", name: "Retrait", icon: Store, desc: "Point de vente", prix_detail: 0 },
  ]

  const carriers = [
    { id: "dhl", name: "DHL" },
    { id: "chronopost", name: "Chronopost" },
    { id: "local", name: "Transporteur Local" },
  ]

  const timeSlots = [
    { id: "morning", name: "Matin", time: "9h - 12h" },
    { id: "afternoon", name: "Après-midi", time: "12h - 17h" },
    { id: "evening", name: "Soirée", time: "17h - 20h" },
  ]

  const subtotal = cart.reduce((sum, item) => {
    const prix_detail = parseFloat(
      item.product?.prix_detail ||
      item.prix_detail ||
      item.prix_detail ||
      0
    )
    return sum + prix_detail * item.quantity
  }, 0)

  const shippingFee = deliveryInfo.delivery_mode
    ? deliveryModes.find(m => m.id === deliveryInfo.delivery_mode)?.prix_detail || 0
    : 0

  const total = subtotal + shippingFee
  const paymentMethod = getPaymentMethodFromDelivery(deliveryInfo.delivery_mode)


  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target
    setPersonalInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleDeliveryInfoChange = (field, value) => {
    setDeliveryInfo(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!personalInfo.first_name || !personalInfo.last_name || !personalInfo.email || !personalInfo.phone) {
      setError("Veuillez remplir toutes les informations personnelles")
      return false
    }
    if (!personalInfo.address || !personalInfo.city) {
      setError("Veuillez remplir l'adresse de livraison")
      return false
    }
    if (!deliveryInfo.delivery_mode) {
      setError("Veuillez sélectionner un mode de livraison")
      return false
    }
    if (cart.length === 0) {
      setError("Votre panier est vide")
      return false
    }
    return true
  }

  const handleConfirmOrder = async () => {
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      const response = await api.post("/orders", {
        first_name: personalInfo.first_name.trim(),
        last_name: personalInfo.last_name.trim(),
        email: personalInfo.email.trim(),
        phone: personalInfo.phone.trim(),
        address: personalInfo.address.trim(),
        city: personalInfo.city.trim() || "Casablanca",
        notes: deliveryInfo.notes || null,
        shipping_method: deliveryInfo.carrier || "amana",
        payment_method: paymentMethod,
        subtotal,
        shipping_fee: shippingFee,
        total,
        cart_items: cartItems(),
      })

      const order = response.data.order

      navigate("/order-confirmation", {
        state: { order }
      })

    } catch (err) {
      console.error(err)
      setError("Erreur lors de la création de la commande")
    } finally {
      setLoading(false)
    }
  }

  const handleStripeSuccess = () => {
    navigate("/order-confirmation")
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-wrapper">
          <div className="checkout-empty">
            <div className="empty-icon">Shopping Cart</div>
            <p className="empty-text">Votre panier est vide</p>
            <a href="/products" className="empty-link">Continuer les achats</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-wrapper">
        <h1 className="checkout-title">Finaliser ma commande</h1>

        <div className="checkout-steps">
          {[1, 2, 3].map(i => (
            <div key={i} className={`checkout-step ${step >= i ? "active" : ""}`} onClick={() => step >= i && setStep(i)}>
              <span className="step-number">{i}</span>
              <span className="step-label">
                {i === 1 ? "Informations" : i === 2 ? "Livraison" : "Confirmation"}
              </span>
            </div>
          ))}
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">Warning</span>
            <span>{error}</span>
          </div>
        )}

        <div className="checkout-container">
          <div className="checkout-content">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="checkout-form">
                <h2 className="section-title">Vos informations</h2>

                <div className="form-section">
                  <h3 className="form-section-title">Informations personnelles</h3>
                  <div className="form-row">
                    <input name="first_name" placeholder="Prénom *" value={personalInfo.first_name} onChange={handlePersonalInfoChange} className="form-input" />
                    <input name="last_name" placeholder="Nom *" value={personalInfo.last_name} onChange={handlePersonalInfoChange} className="form-input" />
                  </div>
                  <div className="form-row">
                    <input name="email" type="email" placeholder="Email *" value={personalInfo.email} onChange={handlePersonalInfoChange} className="form-input" />
                    <input name="phone" placeholder="Téléphone *" value={personalInfo.phone} onChange={handlePersonalInfoChange} className="form-input" />
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Adresse</h3>
                  <input name="address" placeholder="Adresse complète *" value={personalInfo.address} onChange={handlePersonalInfoChange} className="form-input full-width" />
                  <input name="city" placeholder="Ville *" value={personalInfo.city} onChange={handlePersonalInfoChange} className="form-input" />
                </div>

                <div className="form-actions">
                  <button className="btn-next" onClick={() => setStep(2)}>
                    Continuer →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="checkout-form">
                <h2 className="section-title">Truck Mode de livraison</h2>

                <div className="delivery-options">
                  {deliveryModes.map(mode => (
                    <div
                      key={mode.id}
                      className={`delivery-option ${deliveryInfo.delivery_mode === mode.id ? "selected" : ""}`}
                      onClick={() => handleDeliveryInfoChange("delivery_mode", mode.id)}
                    >
                      <div className="delivery-option-icon">
                        <mode.icon size={22} />
                      </div>

                      <div className="delivery-option-name">{mode.name}</div>
                      <div className="delivery-option-desc">{mode.desc}</div>

                      <div className="delivery-option-prix_detail">
                        {mode.prix_detail === 0 ? "Gratuit" : `${mode.prix_detail.toFixed(2)} DH`}
                      </div>
                    </div>
                  ))}
                </div>

                {deliveryInfo.delivery_mode && deliveryInfo.delivery_mode !== "pickup" && (
                  <>
                    <div className="form-section">
                      <h3 className="form-section-title">Transporteur</h3>
                      <div className="carriers-grid">
                        {carriers.map(carrier => (
                          <div
                            key={carrier.id}
                            className={`carrier-option ${deliveryInfo.carrier === carrier.id ? "selected" : ""}`}
                            onClick={() => handleDeliveryInfoChange("carrier", carrier.id)}
                          >
                            {carrier.name}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="form-section">
                      <h3 className="form-section-title">Créneau horaire</h3>
                      <div className="time-slots">
                        {timeSlots.map(slot => (
                          <div
                            key={slot.id}
                            className={`time-slot ${deliveryInfo.time_slot === slot.id ? "selected" : ""}`}
                            onClick={() => handleDeliveryInfoChange("time_slot", slot.id)}
                          >
                            <div>
                              <div className="slot-name">{slot.name}</div>
                              <div className="slot-time">{slot.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <textarea
                      placeholder="Notes pour le livreur..."
                      value={deliveryInfo.notes}
                      onChange={(e) => handleDeliveryInfoChange("notes", e.target.value)}
                      className="form-textarea"
                    />
                  </>
                )}

                <div className="form-actions">
                  <button className="btn-back" onClick={() => setStep(1)}>← Retour</button>
                  <button className="btn-next" onClick={() => setStep(3)}>Continuer →</button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="checkout-form">
                <h2 className="section-title">Paiement</h2>

                <div className="summary-preview">
                  <p><strong>Client :</strong> {personalInfo.first_name} {personalInfo.last_name}</p>
                  <p><strong>Téléphone :</strong> {personalInfo.phone}</p>
                  <p><strong>Adresse :</strong> {personalInfo.address}, {personalInfo.city}</p>
                  <p><strong>Livraison :</strong> {deliveryModes.find(m => m.id === deliveryInfo.delivery_mode)?.name}</p>
                  <p><strong>Total :</strong> {(total || 0).toFixed(2)} DH</p>
                </div>

                {paymentMethod === "cash" && (
                  <button
                    type="button"
                    className="btn-next"
                    onClick={handleConfirmOrder}
                    disabled={loading}
                  >
                    Confirmer la commande
                  </button>

                )}

                {/* Show Stripe form only for card-required modes */}
                {paymentMethod === "stripe" && (
                  <StripeCheckoutForm
                    onPaymentSuccess={handleStripeSuccess}
                    disabled={loading}
                    checkoutData={{
                      first_name: personalInfo.first_name.trim(),
                      last_name: personalInfo.last_name.trim() || "",
                      email: personalInfo.email.trim() || "",
                      phone: personalInfo.phone.trim(),
                      address: personalInfo.address.trim(),
                      city: personalInfo.city.trim() || "Casablanca",
                      notes: deliveryInfo.notes?.trim() || null,
                      shipping_method: deliveryInfo.carrier || "amana",
                      payment_method: "stripe",
                      subtotal,
                      shipping_fee: shippingFee,
                      total,
                      cart_items: cartItems(),
                    }}
                  />
                )}

                <div className="form-actions">

                  <button className="btn-back" onClick={() => setStep(2)}>
                    ← Modifier
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* RÉCAPITULATIF */}
          <div className="checkout-summary">
            <h3 className="summary-title">Récapitulatif</h3>
            <div className="summary-items">
              {cart.map((item, i) => {
                const unitPrice = parseFloat(
                  item.product?.prix_detail ||
                  item.prix_detail ||
                  item.prix_detail ||
                  0
                )

                return (
                  <div key={i} className="summary-item">
                    <span>{item.product?.name || item.name} × {item.quantity}</span>
                    <span>{(unitPrice * item.quantity).toFixed(2)} DH</span>
                  </div>
                )
              })}

            </div>
            <div className="summary-line"><span>Sous-total</span><span>{(subtotal || 0).toFixed(2)} DH</span></div>
            <div className="summary-line"><span>Livraison</span><span>{(shippingFee || 0).toFixed(2)} DH</span></div>
            <div className="summary-total"><span>Total</span><span>{(total || 0).toFixed(2)} DH</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}