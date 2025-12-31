import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import "../styles/OrdersPage.css"

export default function OrdersPage() {
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

      // PROTECTION CONTRE TOUS LES FORMATS
      let ordersArray = []

      if (Array.isArray(res.data)) {
        ordersArray = res.data
      } else if (res.data && Array.isArray(res.data.data)) {
        ordersArray = res.data.data
      } else if (res.data && Array.isArray(res.data.orders)) {
        ordersArray = res.data.orders
      } else {
        console.warn("Format inattendu pour les commandes :", res.data)
        ordersArray = []
      }

      setOrders(ordersArray)
    } catch (err) {
      console.error("Erreur chargement commandes :", err)
      if (err.response?.status === 401) {
        alert("Veuillez vous connecter")
        navigate("/auth")
      } else {
        alert("Impossible de charger vos commandes")
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "success",
      processing: "warning",
      shipped: "info",
      delivered: "success",
      cancelled: "danger",
      pending: "default"
    }
    return colors[status] || "default"
  }

  const getStatusText = (status) => {
    const texts = {
      pending: "En attente",
      confirmed: "Confirmée",
      processing: "En préparation",
      shipped: "Expédiée",
      delivered: "Livrée",
      cancelled: "Annulée"
    }
    return texts[status] || status
  }

  if (loading) {
    return <div className="orders-loading">Chargement de vos commandes...</div>
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <div className="empty-icon">Package</div>
        <h2>Aucune commande pour le moment</h2>
        <p>Parcourez notre catalogue et passez votre première commande !</p>
        <button onClick={() => navigate("/")} className="btn-primary">
          Découvrir les produits
        </button>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>Mes commandes</h1>
        <p className="orders-count">{orders.length} commande{orders.length > 1 ? "s" : ""}</p>

        <div className="orders-list">
          {orders.map(order => (
            <div
              key={order.id || order.order_number}
              className="order-card"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="order-header">
                <div>
                  <strong>Commande #{order.order_number}</strong>
                  <p className="order-date">
                    {new Date(order.created_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                </div>
                <div className="order-total">
                  {Number(order.total || 0).toFixed(2)} DH
                </div>
              </div>

              <div className="order-status">
                <span className={`status-badge ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
                <span className="items-count">
                  {(order.items?.length || 0)} article{order.items?.length > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedOrder(null)}>×</button>

            <h2>Commande #{selectedOrder.order_number}</h2>
            <p className="modal-date">
              Passée le {new Date(selectedOrder.created_at).toLocaleDateString("fr-FR")}
            </p>

            <div className="modal-status">
              <span className={`status-badge large ${getStatusColor(selectedOrder.status)}`}>
                {getStatusText(selectedOrder.status)}
              </span>
            </div>

            <div className="modal-section">
              <h3>Adresse de livraison</h3>
              <p>{selectedOrder.first_name} {selectedOrder.last_name}</p>
              <p>{selectedOrder.address}</p>
              <p>{selectedOrder.city}</p>
              <p>Tél: {selectedOrder.phone}</p>
            </div>

            <div className="modal-section">
              <h3>Produits commandés</h3>
              <div className="order-items">
                {(selectedOrder.items || []).map(item => (
                  <div key={item.id} className="order-item">
                    <img src={item.product?.image_principale || "/placeholder.jpg"} alt={item.product?.name || "Produit"} />
                    <div className="item-info">
                      <strong>{item.product?.name || "Produit"}</strong>
                      <p>Quantité: {item.quantity}</p>
                      <p>Prix unitaire: {item.price} DH</p>
                    </div>
                    <div className="item-total">
                      {((item.quantity || 0) * (item.price || 0)).toFixed(2)} DH
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-total">
              <div>Total payé :</div>
              <div className="total-amount">{Number(selectedOrder.total || 0).toFixed(2)} DH</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}