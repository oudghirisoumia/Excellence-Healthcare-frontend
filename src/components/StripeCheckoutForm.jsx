import { useState } from "react"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import api from "../api"
import "../styles/StripePaymentForm.css"

const StripeCheckoutForm = ({ amount, onPaymentSuccess, disabled, checkoutData }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handlePayment = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!stripe || !elements) {
      setError("Stripe n'est pas chargé")
      setLoading(false)
      return
    }

    try {
      // Étape 1 : Créer la commande
      console.log("📦 Création de la commande...")
      console.log("Données envoyées:", checkoutData)
      const orderResponse = await api.post("/orders", checkoutData)
      const orderId = orderResponse.data?.order?.id || orderResponse.data?.id
      
      if (!orderId) {
        throw new Error("Impossible de créer la commande")
      }
      console.log("✓ Commande créée:", orderId)

      // Étape 2 : Créer le PaymentIntent via backend
      console.log("💳 Création du PaymentIntent...")
      const paymentIntentResponse = await api.post("/stripe/create-payment-intent", {
        order_id: orderId,
      })

      const clientSecret = paymentIntentResponse.data.clientSecret
      console.log("✓ PaymentIntent créé:", clientSecret)

      // Étape 3 : Confirmer le paiement directement avec Stripe Elements
      console.log("🔐 Confirmation du paiement avec Stripe...")
      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: `${checkoutData.first_name} ${checkoutData.last_name}`,
              email: checkoutData.email,
              phone: checkoutData.phone,
              address: {
                line1: checkoutData.address,
                postal_code: checkoutData.postal_code || "",
                city: checkoutData.city || "",
                country: "MA",
              },
            },
          },
        }
      )

      if (confirmError) {
        setError(confirmError.message)
        setLoading(false)
        return
      }

      if (paymentIntent?.status === "succeeded") {
        console.log("✅ Paiement réussi!")
        localStorage.removeItem("cart")
        onPaymentSuccess(orderResponse.data)
      } else if (paymentIntent?.status === "requires_action") {
        console.log("⏳ Authentification requise (3D Secure)...")
        setError("Authentification requise. Veuillez compléter la vérification 3D Secure")
      } else {
        setError("Paiement non confirmé. Statut: " + paymentIntent?.status)
      }
    } catch (err) {
      console.error("❌ Erreur paiement:", err)
      console.error("Response data:", err.response?.data)
      console.error("Response status:", err.response?.status)
      
      let errorMsg = "Erreur paiement"
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      }
      if (err.response?.data?.errors) {
        errorMsg = JSON.stringify(err.response.data.errors)
      }
      
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  }

  return (
    <div className="stripe-payment-form">
      <form onSubmit={handlePayment}>
        <div className="stripe-card-wrapper">
          <label>Informations de la carte</label>
          <CardElement options={cardElementOptions} className="card-input" />
        </div>

        {error && (
          <div className="stripe-error">
            <span className="error-icon">⚠️</span> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={disabled || loading || !stripe || !elements}
          className="btn-pay-stripe"
        >
          {loading ? "Traitement..." : `Payer ${amount}€`}
        </button>
      </form>
    </div>
  )
}

export default StripeCheckoutForm