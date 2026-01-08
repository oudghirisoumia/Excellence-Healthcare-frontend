import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import "../styles/B2BDashboard.css"

function formatCurrency(value) {
  if (!value) return "0,00 DH"
  return Number(value).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
  }) + " DH"
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("fr-FR")
}

const B2BDashboard = () => {
  const navigate = useNavigate()

  const [stats, setStats] = useState(null)
  const [salesByMonth, setSalesByMonth] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  let user = null
  try {
    user = JSON.parse(localStorage.getItem("user") || "null")
  } catch { }

  const companyName =
    user?.companyName ||
    user?.pharmacyName ||
    user?.name ||
    "Votre entreprise"

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const res = await api.get("/b2b/dashboard")
      setStats(res.data.statistics)
      setSalesByMonth(res.data.salesByMonth || [])
      setRecentOrders(res.data.recentOrders || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Chargement…</div>
  if (!stats) return <div className="error">Impossible de charger les données</div>

  return (
    <div className="b2b-dashboard-page">

      <div className="dashboard-header">
        <div>
          <h1>Vue d’ensemble</h1>
          <p className="subtitle">
            Bienvenue <strong>{companyName}</strong>, voici l’état de votre activité
          </p>
        </div>
      </div>

      {stats.pendingOrders > 0 && (
        <div className="alert warning">
          Vous avez <strong>{stats.pendingOrders}</strong> commande(s) en attente de traitement
        </div>
      )}

      <div className="cards">
        <div className="card">
          <div className="card-label">Chiffre d’affaires</div>
          <div className="card-value">{formatCurrency(stats.totalSales)}</div>
        </div>

        <div className="card">
          <div className="card-label">Commandes totales</div>
          <div className="card-value">{stats.totalOrders}</div>
        </div>

        {/* <div className="card">
          <div className="card-label">Clients</div>
          <div className="card-value">{stats.totalClients}</div>
        </div> */}

        <div className="card highlight">
          <div className="card-label">Commandes En attente</div>
          <div className="card-value">{stats.pendingOrders}</div>
        </div>
      </div>

      <div className="dashboard-grid">

        <div className="panel">
          <div className="panel-header">
            <h3>Dernières commandes</h3>
            <a href="/b2b/orders" className="link-btn">
              Voir tout →
            </a>

          </div>

          {recentOrders.length === 0 ? (
            <p className="empty">Aucune commande récente</p>
          ) : (
            recentOrders.map(order => (
              <div key={order.id} className="order-row">
                <div>
                  <strong>Commande #{order.id}</strong>
                  <div className="muted">{formatDate(order.created_at)}</div>
                </div>

                <div className="right">
                  <div>{formatCurrency(order.total)}</div>
                  <span className={`status ${order.status}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <h3>Évolution des ventes</h3>

          {salesByMonth.length === 0 ? (
            <p className="empty">Pas encore de données</p>
          ) : (
            salesByMonth.map(row => (
              <div key={row.month} className="month-row">
                <span>
                  {new Date(row.month).toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <strong>{formatCurrency(row.total)}</strong>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export default B2BDashboard
