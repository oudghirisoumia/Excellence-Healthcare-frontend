"use client"
import React, { useEffect, useState } from "react"
import api from "../api"
import "../styles/B2BDashboard.css"

function formatCurrency(number) {
  if (number == null) return "0 DH"
  return Number(number).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + " DH"
}

function formatDate(iso) {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("fr-FR")
}

function StatusBadge({ status }) {
  if (!status) return <span className="status-badge status-default">—</span>
  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      {status}
    </span>
  )
}

const B2BDashboard = () => {
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Get user info
  let user = null
  try {
    user = JSON.parse(localStorage.getItem("user") || "null")
  } catch {}
  const companyName = user?.companyName || user?.pharmacyName || user?.name || "Votre entreprise"

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const res = await api.get("/b2b/dashboard")
      setStats(res.data.statistics)
      setOrders(res.data.recentOrders || [])
    } catch (err) {
      console.error("Error loading dashboard:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Chargement...</div>
  if (!stats) return <div className="error">Impossible de charger le dashboard</div>

  return (
    <div className="b2b-dashboard-page">

      <div className="b2b-header">
        <div>
          <h1>Bienvenue, {companyName}</h1>
          <p className="sub">Tableau de bord B2B</p>
        </div>
      </div>

      {/* Stats */}
      <div className="cards">
        <div className="card">
          <div className="card-title">Ventes totales</div>
          <div className="card-value">{formatCurrency(stats.totalSales)}</div>
        </div>
        <div className="card">
          <div className="card-title">Commandes</div>
          <div className="card-value">{stats.totalOrders}</div>
        </div>
        <div className="card">
          <div className="card-title">En attente</div>
          <div className="card-value">{stats.pendingOrders}</div>
        </div>
        <div className="card">
          <div className="card-title">Clients</div>
          <div className="card-value">{stats.totalClients}</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card-panel">
        <div className="panel-header">
          <h3>Commandes récentes</h3>
          <span className="muted">Les 10 dernières commandes</span>
        </div>

        <div className="table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>N° Commande</th>
                <th>Date</th>
                <th>Client</th>
                <th>Produits</th>
                <th>Total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty">Aucune commande trouvée</td>
                </tr>
              )}
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_number ?? `CMD-${order.id}`}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.items?.length || 0}</td>
                  <td className="amount">{formatCurrency(order.total)}</td>
                  <td><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default B2BDashboard
