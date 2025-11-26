"use client"

import { useState, useEffect } from "react"
import "../styles/AdminDashboard.css"
import { CARRIERS, ORDER_STATUSES } from "../data/deliveryData"

const formatPrice = (price) => {
  if (!price && price !== 0) return "0.00";
  return Number(price).toFixed(2);
};

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filters, setFilters] = useState("all")

  useEffect(() => {
    const lastOrder = JSON.parse(localStorage.getItem("lastOrder") || "null")
    if (lastOrder) {
      setOrders([lastOrder])
    }
  }, [])

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const handleCarrierChange = (orderId, newCarrier) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, carrier: newCarrier } : order)))
  }

  const filteredOrders = orders.filter((order) => {
    if (filters === "all") return true
    return order.status === filters
  })

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  }

  return (
    <div className="admin-dashboard">
      <h1>Tableau de bord Admin - Gestion des livraisons</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Commandes totales</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card pending">
          <h3>En attente</h3>
          <p className="stat-value">{stats.pending}</p>
        </div>
        <div className="stat-card shipped">
          <h3>Expédiées</h3>
          <p className="stat-value">{stats.shipped}</p>
        </div>
        <div className="stat-card delivered">
          <h3>Livrées</h3>
          <p className="stat-value">{stats.delivered}</p>
        </div>
      </div>

      <div className="admin-filters">
        <button className={filters === "all" ? "active" : ""} onClick={() => setFilters("all")}>
          Toutes les commandes
        </button>
        {ORDER_STATUSES.map((status) => (
          <button
            key={status.id}
            className={filters === status.id ? "active" : ""}
            onClick={() => setFilters(status.id)}
          >
            {status.label}
          </button>
        ))}
      </div>

      <div className="admin-container">
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>ID Commande</th>
                <th>Client</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Transporteur</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={selectedOrder?.id === order.id ? "active" : ""}
                >
                  <td>{order.id}</td>
                  <td>{order.phone}</td>
                 <td> {order.total ? Number(order.total).toFixed(2) : "0.00"} DH</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleStatusChange(order.id, e.target.value)
                      }}
                      className="status-select"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={order.carrier}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleCarrierChange(order.id, e.target.value)
                      }}
                      className="carrier-select"
                    >
                      {CARRIERS.map((carrier) => (
                        <option key={carrier.id} value={carrier.id}>
                          {carrier.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="view-btn" title="Voir détails">
                      <i className="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedOrder && (
          <div className="order-panel">
            <div className="panel-header">
              <h2>Détails de la commande</h2>
              <button onClick={() => setSelectedOrder(null)} className="close-btn">
                &times;
              </button>
            </div>

            <div className="panel-content">
              <div className="section">
                <h3>Informations de livraison</h3>
                <p>
                  <strong>Adresse:</strong> {selectedOrder.deliveryAddress}
                </p>
                <p>
                  <strong>Téléphone:</strong> {selectedOrder.phone}
                </p>
                <p>
                  <strong>Numéro de suivi:</strong> {selectedOrder.trackingNumber}
                </p>
              </div>

              <div className="section">
                <h3>Articles de la commande</h3>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="item">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>{(item.discountPrice * item.quantity).toFixed(2)} €</span>
                  </div>
                ))}
              </div>

              <div className="section actions">
                <button className="send-notification-btn">
                  <i className="fas fa-envelope"></i> Envoyer notification
                </button>
                <button className="print-label-btn">
                  <i className="fas fa-print"></i> Imprimer étiquette
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
