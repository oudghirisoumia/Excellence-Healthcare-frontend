import { useState, useEffect } from "react"
import api from "../api"
import "../styles/OrderTrackingPage.css"

const STATUS_MAP = {
  pending: 0,
  confirmed: 1,
  shipped: 2,
  delivered: 3,
}

const STATUSES = ["En attente", "Confirmée", "Expédiée", "Livrée"]

export default function OrderTrackingPage() {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const orderId = localStorage.getItem("lastOrderId")
    if (!orderId) {
      setError("Aucune commande trouvée")
      setLoading(false)
      return
    }

    api.get(`/orders/${orderId}`)
      .then(res => {
        const data = res.data?.order || res.data
        if (data) {
          setOrder(data)
        } else {
          setError("Commande introuvable")
        }
      })
      .catch(() => setError("Impossible de charger la commande"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="tracking-page"><p>Chargement...</p></div>
  if (error) return <div className="tracking-page"><p>{error}</p></div>
  if (!order) return <div className="tracking-page"><p>Aucune commande trouvée</p></div>

  const currentStep = STATUS_MAP[order.status] ?? 0

  return (
    <div className="tracking-page">
      <h1>Suivi de commande</h1>

      <p><strong>Commande :</strong> {order.order_number || "—"}</p>
      <p><strong>Total :</strong> {order.total ? Number(order.total).toFixed(2) + " DH" : "0.00 DH"}</p>
      <p><strong>Adresse :</strong> {order.address || order.delivery_address || order.customer_address || "—"}</p>

      <h3>Statut</h3>
      <ul className="timeline">
        {STATUSES.map((label, idx) => {
          let statusClass = ""
          if (idx === 0 && idx <= currentStep) statusClass = "pending active"
          if (idx === 1 && idx <= currentStep) statusClass = "confirmed active"
          if (idx === 2 && idx <= currentStep) statusClass = "shipped active"
          if (idx === 3 && idx <= currentStep) statusClass = "delivered active"

          return (
            <li key={idx} className={statusClass}>
              {label}
            </li>
          )
        })}
      </ul>

      <h3>Articles</h3>
      {(order.items || []).length === 0 && <p>Aucun article trouvé</p>}
      {(order.items || []).map(item => (
        <div key={item.id} className="order-item">
          <div>
            <strong>{item.product?.name || "Produit"}</strong>
            <p>Quantité : {item.quantity}</p>
          </div>
          <span>
            {item.price && item.quantity
              ? (Number(item.price) * item.quantity).toFixed(2) + " DH"
              : "0.00 DH"}
          </span>
        </div>
      ))}
    </div>
  )
}
