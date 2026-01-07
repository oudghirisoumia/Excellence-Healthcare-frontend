"use client"
import React, { useEffect, useState } from "react"
import api from "../api"
import "../styles/B2BDashboard.css"

function formatCurrency(number) {
  if (number == null) return "0 DH"
  return Number(number).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + " DH"
}

const B2BDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  // Get user info
  let user = null
  try {
    user = JSON.parse(localStorage.getItem("user") || "null")
  } catch { }
  const companyName = user?.companyName || user?.pharmacyName || user?.name || "Votre entreprise"

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const res = await api.get("/b2b/dashboard")
      setStats(res.data.statistics)
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
    </div>
  )
}

export default B2BDashboard
