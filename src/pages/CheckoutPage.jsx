"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import StripeCheckoutForm from "../components/StripeCheckoutForm"
import "../styles/CheckoutPage.css"

export default function CheckoutPage({ cart = [] }) {
  const navigate = useNavigate()
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

  const deliveryModes = [
    { id: "standard", name: "Standard", icon: "Box", desc: "3-5 jours", price: 4.9 },
    { id: "express", name: "Express", icon: "Lightning", desc: "24h", price: 12.9 },
    { id: "cash", name: "À la livraison", icon: "Money", desc: "Paiement livraison", price: 6.9 },
    { id: "pickup", name: "Retrait", icon: "Store", desc: "Point de vente", price: 0 },
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
    const price = parseFloat(item.product?.prix_detail || item.prix_detail || item.price || 0)
    return sum + price * item.quantity
  }, 0)

  const shippingFee = deliveryInfo.delivery_mode
    ? deliveryModes.find(m => m.id === deliveryInfo.delivery_mode)?.price || 0
    : 0

  const total = subtotal + shippingFee

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
      // FORMATTAGE DES ITEMS DU PANIER - STRICT VALIDATION
      const cart_items = cart.map(item => {
        const productId = item.product_id || item.product?.id || item.id
        const quantity = parseInt(item.quantity) || 1
        const price = parseFloat(item.product?.prix_detail || item.prix_detail || item.price || 0)
        
        // Validation
        if (!productId) throw new Error('Product ID manquant dans le panier')
        if (quantity < 1) throw new Error('Quantité invalide')
        if (price < 0) throw new Error('Prix invalide')
        
        console.log(`✓ Item valide: productId=${productId}, qty=${quantity}, price=${price}`)
        
        return {
          product_id: productId,
          quantity,
          price
        }
      })

      // PAYLOAD MINIMAL - EXACTEMENT CE QUE LE BACKEND ATTEND
      const payload = {
        first_name: personalInfo.first_name.trim(),
        last_name: personalInfo.last_name.trim() || "",
        email: personalInfo.email.trim() || "",
        phone: personalInfo.phone.trim(),
        address: personalInfo.address.trim(),
        city: personalInfo.city.trim() || "Casablanca",
        notes: deliveryInfo.notes?.trim() || null,
        shipping_method: deliveryInfo.carrier || "amana",
        payment_method: "cash",
        subtotal: parseFloat((subtotal || 0).toFixed(2)),
        shipping_fee: parseFloat((shippingFee || 0).toFixed(2)),
        total: parseFloat((total || 0).toFixed(2)),
        cart_items // REQUIS PAR LE BACKEND
      }

      console.log("✓ Validation complète réussie")
      console.log("Envoi vers Laravel :", payload)

      const response = await api.post("/orders", payload)
      console.log("✓ Commande créée :", response.data)

      // Optionnel : vider le panier local
      localStorage.removeItem("cart")

      // Handle various response structures from backend
      const orderData = response.data?.order || response.data?.data || response.data
      
      navigate("/order-confirmation", {
        state: { 
          order: orderData,
          cart_items: cart
        }
      })

    } catch (err) {
      // Validation errors before sending to backend
      if (err.message && !err.response) {
        console.error("❌ Erreur validation:", err.message)
        setError(err.message)
        setLoading(false)
        return
      }

      // Backend errors
      console.error("❌ Erreur complète :", err.response?.data)
      console.error("❌ Erreur status :", err.response?.status)
      console.error("❌ Payload envoyé :", err.config?.data)
      
      // Build a detailed error message
      let errorMessage = "Erreur lors de la création de la commande"
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.response?.data?.errors) {
        // Handle validation errors (Laravel often returns errors object)
        const errors = err.response.data.errors
        const errorArray = Object.entries(errors).map(([key, msgs]) => {
          return `${key}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`
        })
        errorMessage = errorArray.join(' | ')
      }
      
      console.error("❌ Message d'erreur finalisé :", errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-wrapper">
          <div className="checkout-empty">
            <div className="empty-icon">Shopping Cart</div>
            <p className="empty-text">Votre panier est vide</p>
            <a href="/products" className="empty-link">
              Continuer les achats
            </a>
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
                <h2 className="section-title">Person Vos informations</h2>

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
                      <div className="delivery-option-icon">{mode.icon}</div>
                      <div className="delivery-option-name">{mode.name}</div>
                      <div className="delivery-option-desc">{mode.desc}</div>
                      <div className="delivery-option-price">
                        {mode.price === 0 ? "Gratuit" : `${(mode.price || 0).toFixed(2)} DH`}
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

                <StripeCheckoutForm
                  amount={Math.round((total || 0) * 100)}
                  onPaymentSuccess={() => {
                    navigate("/order-confirmation", {
                      state: { 
                        order: { id: "pending" },
                        cart_items: cart
                      }
                    })
                  }}
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
                    subtotal: parseFloat((subtotal || 0).toFixed(2)),
                    shipping_fee: parseFloat((shippingFee || 0).toFixed(2)),
                    total: parseFloat((total || 0).toFixed(2)),
                    cart_items: cart.map(item => {
                      const productId = item.product?.id || item.product_id || item.id
                      const quantity = item.quantity || 1
                      const price = parseFloat(item.product?.prix_detail || item.prix_detail || item.price || 0)
                      return {
                        product_id: productId,
                        quantity,
                        price
                      }
                    })
                  }}
                />

                <div className="form-actions">
                  <button className="btn-back" onClick={() => setStep(2)}>← Modifier</button>
                </div>
              </div>
            )}
          </div>

          {/* RÉCAPITULATIF FIXE */}
          <div className="checkout-summary">
            <h3 className="summary-title">Récapitulatif</h3>
            <div className="summary-items">
              {cart.map((item, i) => (
                <div key={i} className="summary-item">
                  <span>{item.product?.name || item.name} × {item.quantity}</span>
                  <span>{((item.price || 0) * item.quantity).toFixed(2)} DH</span>
                </div>
              ))}
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