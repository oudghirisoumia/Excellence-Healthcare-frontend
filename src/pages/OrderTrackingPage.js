"use client"

import { useState, useEffect } from "react"
import "../styles/OrderTrackingPage.css"
import { ORDER_STATUSES } from "../data/deliveryData"
import api from "../api"

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
                <p className="order-date">{order.createdAt ? new Date(order.createdAt).toLocaleDateString("fr-FR") : "-"}</p>
                <p className="order-total">{(parseFloat(order.total) || 0).toFixed(2)} DH</p>
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
                    <strong>Sous-total:</strong> {(selectedOrder.subtotal || 0).toFixed(2)} DH
                  </p>
                  <p>
                    <strong>Livraison:</strong> {(parseFloat(selectedOrder.deliveryFee) || 0).toFixed(2)} DH
                  </p>
                  <p className="total">
                    <strong>Total:</strong> {(parseFloat(selectedOrder.total) || parseFloat(selectedOrder.calculated_total) || 0).toFixed(2)} DH
                  </p>
                </div>

                <div className="info-section">
                  <h3>Articles</h3>
                  <div className="order-items">
                    {(selectedOrder.items || []).map((item) => {
                      const price = parseFloat(item.discountPrice || item.price || item.prix_detail || 0)
                      const qty = parseInt(item.quantity || 1)
                      const img = (() => {
                        const path = item.image || item.image_principale || item.product_image
                        if (!path) return "/placeholder.svg"
                        try {
                          const base = api.defaults.baseURL || ''
                          const host = base.replace(/\/api\/?$/, '')
                          if (path.startsWith('http')) return path
                          if (path.startsWith('/')) return host + path
                          return host + '/' + path
                        } catch (err) {
                          return path
                        }
                      })()

                      return (
                        <div key={item.id || item.product_id || Math.random()} className="order-item">
                          <img src={img} alt={item.name} />
                          <div>
                            <p>{item.name}</p>
                            <p className="qty">Quantité: {qty}</p>
                          </div>
                          <span>{(price * qty).toFixed(2)} DH</span>
                        </div>
                      )
                    })}
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