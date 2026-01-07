import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import api from "../api"
import "../styles/B2COrdersPage.css"

const STATUS_CONFIG = {
  pending: { label: "En attente", color: "pending" },
  confirmed: { label: "Confirmée", color: "success" },
  processing: { label: "En préparation", color: "warning" },
  shipped: { label: "Expédiée", color: "info" },
  delivered: { label: "Livrée", color: "success" },
  cancelled: { label: "Annulée", color: "danger" },
}

const getStatus = (status = "") => {
  const key = status.toLowerCase().trim()
  return STATUS_CONFIG[key] || { label: status, color: "default" }
}

export default function B2COrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders")

      let ordersArray = []
      if (Array.isArray(res.data)) ordersArray = res.data
      else if (Array.isArray(res.data?.data)) ordersArray = res.data.data
      else if (Array.isArray(res.data?.orders)) ordersArray = res.data.orders

      setOrders(ordersArray)
    } catch (err) {
      console.error(err)
      if (err.response?.status === 401) {
        navigate("/auth")
      } else {
        toast.error("Impossible de charger vos commandes")
      }
    } finally {
      setLoading(false)
    }
  }

  const downloadInvoice = async (orderId) => {
    try {
      const res = await api.get(`/orders/${orderId}/invoice`, {
        responseType: "blob",
      })

      const blob = new Blob([res.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `Facture_${orderId}.pdf`
      document.body.appendChild(link)
      link.click()

      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success("Facture téléchargée avec succès")
    } catch (err) {
      console.error(err)
      toast.error("Impossible de télécharger la facture")
    }
  }

  if (loading) {
    return <div className="orders-loading">Chargement de vos commandes…</div>
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <h2>Aucune commande</h2>
        <p>Vous n’avez encore passé aucune commande.</p>
        <button className="btn-primary" onClick={() => navigate("/")}>
          Découvrir les produits
        </button>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>Mes achats</h1>
        <p className="orders-count">
          {orders.length} commande{orders.length > 1 ? "s" : ""}
        </p>

        <div className="orders-list">
          {orders.map(order => {
            const s = getStatus(order.status)

            return (
              <div
                key={order.id}
                className="order-card"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="order-header">
                  <div>
                    <strong>Commande #{order.order_number}</strong>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  <div className="order-total">
                    {Number(order.total || 0).toFixed(2)} DH
                  </div>
                </div>

                <div className="order-status">
                  <span className={`status-badge ${s.color}`}>
                    {s.label}
                  </span>

                  <span className="items-count">
                    {(order.items?.length || 0)} article
                    {order.items?.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selectedOrder && (() => {
        const s = getStatus(selectedOrder.status)

        return (
          <div
            className="order-modal-overlay"
            onClick={() => setSelectedOrder(null)}
          >
            <div className="order-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                ×
              </button>

              <h2>Commande #{selectedOrder.order_number}</h2>
              <p className="modal-date">
                Passée le{" "}
                {new Date(selectedOrder.created_at).toLocaleDateString("fr-FR")}
              </p>

              <div className="modal-status">
                <span className={`status-badge large ${s.color}`}>
                  {s.label}
                </span>
              </div>

              <div className="modal-section">
                <h3>Adresse de livraison</h3>
                <p>{selectedOrder.first_name} {selectedOrder.last_name}</p>
                <p>{selectedOrder.address}</p>
                <p>{selectedOrder.city}</p>
                <p>Tél : {selectedOrder.phone}</p>
              </div>

              <div className="modal-section">
                <h3>Produits commandés</h3>

                <div className="order-items">
                  {(selectedOrder.items || []).map(item => (
                    <div key={item.id} className="order-item">
                      <img
                        src={item.product?.image_principale || "/placeholder.jpg"}
                        alt={item.product?.name || "Produit"}
                      />

                      <div className="item-info">
                        <strong>{item.product?.name}</strong>
                        <p>Quantité : {item.quantity}</p>
                        <p>Prix unitaire : {item.price} DH</p>
                      </div>

                      <div className="item-total">
                        {Number(item.total || 0).toFixed(2)} DH
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => downloadInvoice(selectedOrder.id)}
                >
                  Télécharger la facture
                </button>
              </div>

              <div className="modal-total">
                <span>Total payé :</span>
                <strong>
                  {Number(selectedOrder.total || 0).toFixed(2)} DH
                </strong>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}