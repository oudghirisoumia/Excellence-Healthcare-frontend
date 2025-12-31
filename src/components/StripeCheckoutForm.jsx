import { useState } from "react"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import api from "../api"
import "../styles/StripePaymentForm.css"

const StripeCheckoutForm = ({ onPaymentSuccess, disabled, checkoutData }) => {
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
      // Create order (amount in MAD)
      const orderResponse = await api.post("/orders", checkoutData)
      const orderId = orderResponse.data?.order?.id || orderResponse.data?.id

      if (!orderId) {
        throw new Error("Impossible de créer la commande")
      }

      // Create PaymentIntent (conversion happens in backend)
      const paymentIntentResponse = await api.post(
        "/stripe/create-payment-intent",
        { order_id: orderId }
      )

      const clientSecret = paymentIntentResponse.data.clientSecret

      // 3Confirm payment with Stripe
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
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
        })

      if (confirmError) {
        setError(confirmError.message)
        setLoading(false)
        return
      }

      if (paymentIntent?.status === "succeeded") {
        localStorage.removeItem("cart")
        onPaymentSuccess(orderResponse.data)
      } else {
        setError("Paiement non confirmé")
      }
    } catch (err) {
      let errorMsg = "Erreur paiement"
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message
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
        fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
        "::placeholder": { color: "#aab7c4" },
      },
      invalid: {
        color: "#fa755a",
      },
    },
  }

  return (
    <div className="stripe-payment-form">
      <form onSubmit={handlePayment}>
        <p className="total-mad">
          Total à payer : {checkoutData.total} DH
        </p>
        <div className="stripe-card-wrapper">
          <label>Informations de la carte</label>
          <CardElement options={cardElementOptions} />
        </div>

        {error && <div className="stripe-error">⚠️ {error}</div>}

        <button
          type="submit"
          disabled={disabled || loading || !stripe || !elements}
          className="btn-pay-stripe"
        >
          {loading ? "Traitement..." : "Payer par carte"}
        </button>
      </form>
    </div>
  )
}

export default StripeCheckoutForm