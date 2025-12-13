"use client"

import { useState, useEffect } from "react"
import "../styles/OrderTrackingPage.css"
import { ORDER_STATUSES } from "../data/deliveryData"

const OrderTrackingPage = () => {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    const lastOrder = JSON.parse(localStorage.getItem("lastOrder") || "null")
    if (lastOrder) {
      setOrders([lastOrder])
      setSelectedOrder(lastOrder)
    }
  }, [])

  const getStatusColor = (statusId) => {
    return ORDER_STATUSES.find((s) => s.id === statusId)?.color || "#999"
  }

  const getStatusLabel = (statusId) => {
    return ORDER_STATUSES.find((s) => s.id === statusId)?.label || "Inconnu"
  }

  return (
    <div className="tracking-page">
      <h1>Suivi de vos commandes</h1>

      {orders.length === 0 ? (
        <p className="no-orders">Aucune commande trouvée</p>
      ) : (
        <div className="tracking-container">
          <div className="orders-list">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`order-card ${selectedOrder?.id === order.id ? "active" : ""}`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="order-header">
                  <span className="order-id">{order.id}</span>
                  <span className="order-status" style={{ backgroundColor: getStatusColor(order.status) }}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <p className="order-date">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</p>
                <p className="order-total">{order.total.toFixed(2)} €</p>
              </div>
            ))}
          </div>

          {selectedOrder && (
            <div className="order-details">
              <div className="tracking-header">
                <h2>Commande {selectedOrder.id}</h2>
                <span className="tracking-number">
                  <i className="fas fa-barcode"></i> {selectedOrder.trackingNumber}
                </span>
              </div>

              <div className="status-timeline">
                {ORDER_STATUSES.map((status, idx) => (
                  <div
                    key={status.id}
                    className={`timeline-item ${ORDER_STATUSES.findIndex((s) => s.id === selectedOrder.status) >= idx ? "completed" : ""}`}
                  >
                    <div className="timeline-dot" style={{ backgroundColor: status.color }}></div>
                    <div className="timeline-content">
                      <p className="timeline-status">{status.label}</p>
                    </div>
                    {idx < ORDER_STATUSES.length - 1 && <div className="timeline-line"></div>}
                  </div>
                ))}
              </div>

              <div className="order-info">
                <div className="info-section">
                  <h3>Détails de livraison</h3>
                  <p>
                    <strong>Mode:</strong> {selectedOrder.deliveryMode}
                  </p>
                  <p>
                    <strong>Transporteur:</strong> {selectedOrder.carrier}
                  </p>
                  <p>
                    <strong>Créneau:</strong> {selectedOrder.timeSlot}
                  </p>
                  <p>
                    <strong>Adresse:</strong> {selectedOrder.deliveryAddress}
                  </p>
                </div>

                <div className="info-section">
                  <h3>Résumé financier</h3>
                  <p>
                    <strong>Sous-total:</strong> {selectedOrder.subtotal.toFixed(2)} €
                  </p>
                  <p>
                    <strong>Livraison:</strong> {selectedOrder.deliveryFee.toFixed(2)} €
                  </p>
                  <p className="total">
                    <strong>Total:</strong> {selectedOrder.total.toFixed(2)} €
                  </p>
                </div>

                <div className="info-section">
                  <h3>Articles</h3>
                  <div className="order-items">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="order-item">
                        <img src={item.image || "/placeholder.svg"} alt={item.name} />
                        <div>
                          <p>{item.name}</p>
                          <p className="qty">Quantité: {item.quantity}</p>
                        </div>
                        <span>{(item.discountPrice * item.quantity).toFixed(2)} €</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="download-invoice">
                  <i className="fas fa-download"></i> Télécharger la facture
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OrderTrackingPage
