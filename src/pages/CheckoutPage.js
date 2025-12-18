"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/CheckoutPage.css"
import { DELIVERY_MODES, CARRIERS, TIME_SLOTS } from "../data/deliveryData"

const CheckoutPage = ({ cart, onClearCart }) => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [deliveryMode, setDeliveryMode] = useState(null)
  const [carrier, setCarrier] = useState(null)
  const [timeSlot, setTimeSlot] = useState(null)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [phone, setPhone] = useState("")

  const getDeliveryFee = () => {
    if (!deliveryMode) return 0
    const mode = DELIVERY_MODES.find((m) => m.id === deliveryMode)
    const subtotal = cart.reduce((sum, item) => sum + item.discountPrice * item.quantity, 0)
    if (subtotal > 50) return 0
    return mode.basePrice
  }

  const subtotal = cart.reduce((sum, item) => sum + item.discountPrice * item.quantity, 0)
  const deliveryFee = getDeliveryFee()
  const total = subtotal + deliveryFee

  const handleSubmitOrder = () => {
    if (!deliveryMode || !carrier || !timeSlot || !deliveryAddress || !phone) {
      alert("Veuillez compléter tous les champs")
      return
    }

    const order = {
      id: "CMD-" + Date.now(),
      items: cart,
      deliveryMode,
      carrier,
      timeSlot,
      deliveryAddress,
      phone,
      subtotal,
      deliveryFee,
      total,
      status: "pending",
      createdAt: new Date(),
      trackingNumber: "TRK-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    }

    localStorage.setItem("lastOrder", JSON.stringify(order))
    onClearCart()
    navigate("/order-confirmation", { state: { order } })
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-empty">
        <p>Votre panier est vide</p>
        <a href="/products">Continuer les achats</a>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? "active" : ""}`} onClick={() => setStep(1)}>
            <span className="step-number">1</span>
            <span className="step-label">Livraison</span>
          </div>
          <div className={`step ${step >= 2 ? "active" : ""}`} onClick={() => step >= 2 && setStep(2)}>
            <span className="step-number">2</span>
            <span className="step-label">Adresse</span>
          </div>
          <div className={`step ${step >= 3 ? "active" : ""}`} onClick={() => step >= 3 && setStep(3)}>
            <span className="step-number">3</span>
            <span className="step-label">Confirmation</span>
          </div>
        </div>

        <div className="checkout-content">
          {step === 1 && (
            <div className="delivery-selection">
              <h2>Sélectionnez votre mode de livraison</h2>

              <div className="delivery-modes">
                {DELIVERY_MODES.map((mode) => (
                  <div
                    key={mode.id}
                    className={`delivery-option ${deliveryMode === mode.id ? "selected" : ""}`}
                    onClick={() => setDeliveryMode(mode.id)}
                  >
                    <input type="radio" name="delivery" checked={deliveryMode === mode.id} readOnly />
                    <div className="option-content">
                      <h3>{mode.name}</h3>
                      <p>{mode.description}</p>
                      <span className="price">
                        {mode.basePrice === 0 ? "Gratuit" : mode.basePrice.toFixed(2) + " DH"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {deliveryMode && deliveryMode !== "pickup" && (
                <>
                  <h2 style={{ marginTop: "2rem" }}>Sélectionnez votre transporteur</h2>
                  <div className="carriers-grid">
                    {CARRIERS.map((c) => (
                      <div
                        key={c.id}
                        className={`carrier-option ${carrier === c.id ? "selected" : ""}`}
                        onClick={() => setCarrier(c.id)}
                        style={{ borderColor: carrier === c.id ? c.color : "#ddd" }}
                      >
                        <input type="radio" name="carrier" checked={carrier === c.id} readOnly />
                        <span>{c.name}</span>
                      </div>
                    ))}
                  </div>

                  <h2 style={{ marginTop: "2rem" }}>Sélectionnez votre créneau</h2>
                  <div className="time-slots">
                    {TIME_SLOTS.map((slot) => (
                      <div
                        key={slot.id}
                        className={`time-slot ${timeSlot === slot.id ? "selected" : ""}`}
                        onClick={() => setTimeSlot(slot.id)}
                      >
                        <input type="radio" name="slot" checked={timeSlot === slot.id} readOnly />
                        <div>
                          <p className="slot-name">{slot.name}</p>
                          <p className="slot-time">{slot.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <button className="next-btn" onClick={() => setStep(2)}>
                Continuer
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="delivery-address">
              <h2>Adresse de livraison</h2>

              <div className="form-group">
                <label>Adresse complète *</label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Rue, numéro, code postal, ville"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Téléphone de contact *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+212 6XX XXX XXX"
                />
              </div>

              <div className="form-actions">
                <button className="back-btn" onClick={() => setStep(1)}>
                  Retour
                </button>
                <button className="next-btn" onClick={() => setStep(3)}>
                  Continuer
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="order-confirmation">
              <h2>Confirmez votre commande</h2>

              <div className="confirmation-summary">
                <h3>Mode de livraison</h3>
                <p>{DELIVERY_MODES.find((m) => m.id === deliveryMode)?.name}</p>

                {carrier && <p>Transporteur: {CARRIERS.find((c) => c.id === carrier)?.name}</p>}
                {timeSlot && <p>Créneau: {TIME_SLOTS.find((s) => s.id === timeSlot)?.name}</p>}

                <h3 style={{ marginTop: "1rem" }}>Adresse</h3>
                <p>{deliveryAddress}</p>
                <p>Téléphone: {phone}</p>
              </div>

              <div className="form-actions">
                <button className="back-btn" onClick={() => setStep(2)}>
                  Retour
                </button>
                <button className="submit-btn" onClick={handleSubmitOrder}>
                  <i className="fas fa-lock"></i> Confirmer et payer
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="checkout-summary">
          <h3>Récapitulatif</h3>
          <div className="summary-items">
            {cart.map((item) => (
              <div key={item.id} className="summary-item">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>{(item.discountPrice * item.quantity).toFixed(2)} DH</span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-line">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} DH</span>
            </div>
            <div className="summary-line">
              <span>Livraison</span>
              <span>{deliveryFee.toFixed(2)} DH</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{total.toFixed(2)} DH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
