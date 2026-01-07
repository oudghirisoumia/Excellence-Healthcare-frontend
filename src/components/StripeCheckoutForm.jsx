import { useState } from "react"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import api from "../api"
import "../styles/StripePaymentForm.css"
import { useAuth } from "../context/AuthContext"

const StripeCheckoutForm = ({ order, onPaymentSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!order) return null

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
      const { data } = await api.post("/stripe/create-payment-intent", {
        order_id: order.id,
        order_type: user?.type === "b2b" ? "b2b" : "b2c",
      })

      const clientSecret = data.clientSecret

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      )

      if (error) {
        setError(error.message)
        return
      }

      if (paymentIntent.status === "succeeded") {
        onPaymentSuccess()
      } else {
        setError("Paiement non confirmé")
      }

    } catch (err) {
      console.error(err)
      setError("Erreur paiement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="stripe-payment-form">
      <form onSubmit={handlePayment}>
        <p className="total-mad">
          Total à payer : {order.total} DH
        </p>

        <div className="stripe-card-wrapper">
          <label>Informations de la carte</label>
          <CardElement />
        </div>

        {error && <div className="stripe-error">⚠️ {error}</div>}

        <button
          type="submit"
          disabled={loading || !stripe || !elements}
          className="btn-pay-stripe"
        >
          {loading ? "Traitement..." : "Payer par carte"}
        </button>
      </form>
    </div>
  )
}

export default StripeCheckoutForm