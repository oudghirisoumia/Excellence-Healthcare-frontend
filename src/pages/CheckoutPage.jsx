"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import StripeCheckoutForm from "../components/StripeCheckoutForm"
import "../styles/CheckoutPage.css"
import { Box, Zap, Store } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import CheckoutSummary from "../components/CheckoutSummary"

export default function CheckoutPage({ cart, onClearCart }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.type === "b2b" && !user?.approved) {
      navigate("/waiting-approval")
    }
  }, [user, navigate])

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [order, setOrder] = useState(null)

  const [personalInfo, setPersonalInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  })

  const [deliverySpeed, setDeliverySpeed] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("stripe")

  const [preview, setPreview] = useState(null)

  const deliveryModes = [
    { id: "standard", name: "Standard", icon: Box, desc: "1–2 jours" },
    { id: "express", name: "Express", icon: Zap, desc: "24h" },
    { id: "pickup", name: "Retrait sur place", icon: Store, desc: "Gratuit" },
  ]

  const cartItems = cart.map(item => ({
    product_id: item.product_id || item.product?.id,
    quantity: Number(item.quantity) || 1,
  }))

  const fetchPreview = async () => {
    if (!deliverySpeed || !paymentMethod || !personalInfo.city) return

    try {
      const res = await api.post("/orders/preview", {
        cart_items: cartItems,
        city: personalInfo.city,
        payment_method: paymentMethod,
        delivery_speed: deliverySpeed,
      })
      setPreview(res.data)
    } catch (err) {
      console.error(err)
      setError("Erreur lors du calcul du total")
    }
  }

  useEffect(() => {
    fetchPreview()
  }, [deliverySpeed, paymentMethod, personalInfo.city])

  const handlePersonalChange = e => {
    const { name, value } = e.target
    setPersonalInfo(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!personalInfo.first_name || !personalInfo.phone || !personalInfo.address || !personalInfo.city) {
      setError("Veuillez remplir toutes les informations requises")
      return false
    }
    if (!deliverySpeed) {
      setError("Veuillez choisir un mode de livraison")
      return false
    }
    if (!paymentMethod) {
      setError("Veuillez choisir un mode de paiement")
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
      const res = await api.post("/orders", {
        first_name: personalInfo.first_name,
        last_name: personalInfo.last_name,
        email: personalInfo.email,
        phone: personalInfo.phone,
        address: personalInfo.address,
        city: personalInfo.city,
        notes: personalInfo.notes || null,
        payment_method: paymentMethod,
        delivery_speed: deliverySpeed,
        cart_items: cartItems,
      })

      const createdOrder = res.data.order

      if (paymentMethod === "cash") {
        onClearCart()
        navigate("/order-confirmation", { state: { order: createdOrder } })
        return
      }

      setOrder(createdOrder)

    } catch (err) {
      console.error(err)
      setError("Erreur lors de la création de la commande")
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <p>Votre panier est vide</p>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-wrapper">
        <h1 className="checkout-title">Finaliser ma commande</h1>
        <div className="checkout-steps">
          <div className={`checkout-step ${step === 1 ? "active" : ""}`}>
            <div className="step-number">1</div>
            <div className="step-label">Infos</div>
          </div>
          <div className={`checkout-step ${step === 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <div className="step-label">Livraison</div>
          </div>
          <div className={`checkout-step ${step === 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <div className="step-label">Confirmation</div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        <div className={`checkout-container ${step === 1 ? "single-column" : ""}`}>
          <div className="checkout-content">

            {step === 1 && (
              <>
                <h2>Informations personnelles</h2>
                <input name="first_name" placeholder="Prénom*" onChange={handlePersonalChange} />
                <input name="last_name" placeholder="Nom" onChange={handlePersonalChange} />
                <input name="email" placeholder="Email" onChange={handlePersonalChange} />
                <input name="phone" placeholder="Téléphone*" onChange={handlePersonalChange} />
                <input name="address" placeholder="Adresse*" onChange={handlePersonalChange} />
                <input name="city" placeholder="Ville*" onChange={handlePersonalChange} />
                <textarea name="notes" placeholder="Notes" onChange={handlePersonalChange} />

                <button onClick={() => setStep(2)}>Continuer</button>
              </>
            )}

            {step === 2 && (
              <>
                <h2>Livraison</h2>
                <div className="delivery-options">
                  {deliveryModes.map(m => (
                    <div
                      key={m.id}
                      className={deliverySpeed === m.id ? "selected" : ""}
                      onClick={() => setDeliverySpeed(m.id)}
                    >
                      <m.icon />
                      <strong>{m.name}</strong>
                      <p>{m.desc}</p>
                    </div>
                  ))}
                </div>

                <h3>Paiement</h3>
                <label>
                  <input
                    type="radio"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                  />
                  Carte bancaire
                </label>

                <label>
                  <input
                    type="radio"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                  />
                  Paiement à la livraison
                </label>

                <button onClick={() => setStep(1)}>Retour</button>
                <button onClick={() => setStep(3)}>Continuer</button>
              </>
            )}

            {step === 3 && (
              <>
                <h2>Confirmation</h2>

                {paymentMethod === "cash" && (
                  <button onClick={handleConfirmOrder} disabled={loading}>
                    Confirmer la commande
                  </button>
                )}

                {paymentMethod === "stripe" && !order && (
                  <button onClick={handleConfirmOrder} disabled={loading}>
                    Procéder au paiement
                  </button>
                )}

                {paymentMethod === "stripe" && order && (
                  <StripeCheckoutForm
                    order={order}
                    onPaymentSuccess={() => {
                      onClearCart()
                      navigate("/order-confirmation", { state: { order } })
                    }}
                  />
                )}

                <button onClick={() => setStep(2)}>Modifier</button>
              </>
            )}
          </div>
          {step >= 2 && <CheckoutSummary cart={cart} preview={preview} />}
        </div>
      </div>
    </div>
  )
}
