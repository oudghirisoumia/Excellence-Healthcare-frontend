"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import "../styles/AdminDashboard.css"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0
  })
  const [alerts, setAlerts] = useState([])
  const [ruptures, setRuptures] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await api.get("/user")
        if (res.data.type !== "admin") {
          alert("Accès refusé – Réservé aux administrateurs")
          navigate("/")
          return
        }
        loadDashboard()
      } catch (err) {
        navigate("/auth")
      }
    }
    checkAdmin()
  }, [navigate])

 const loadDashboard = async () => {
  try {
    const [statsRes, alertsRes, rupturesRes] = await Promise.all([
      api.get("/dashboard"),
      api.get("/alerts"),
      api.get("/out-of-stock")
    ])

    // TON CONTROLLER RENVOIE ÇA :
    // { total, inStock, lowStock, outOfStock, totalValue }
    setStats({
      total: statsRes.data.total || 0,
      lowStock: statsRes.data.lowStock || 0,
      outOfStock: statsRes.data.outOfStock || 0,
      totalValue: statsRes.data.totalValue || 0
    })

    setAlerts(alertsRes.data || [])
    setRuptures(rupturesRes.data || [])

  } catch (err) {
    console.error("Erreur chargement dashboard :", err.response?.data)
    alert("Impossible de charger les statistiques")
  } finally {
    setLoading(false)
  }
}

  const updateStock = async (productId, newStock) => {
    if (!newStock || newStock < 0) return
    setUpdating(productId)

    try {
      await api.patch(`/products/${productId}/stock`, { stock: parseInt(newStock) })
      loadDashboard()
    } catch (err) {
      alert("Erreur mise à jour")
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Chargement du Back-Office...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <h1>Back-Office Excellence Healthcare</h1>
          <p className="header-subtitle">Gestion complète • Stock • Commandes • Statistiques</p>
        </div>
      </header>

      {/* STATISTIQUES */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">Package</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Produits total</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">AlertTriangle</div>
          <div className="stat-value">{stats.lowStock}</div>
          <div className="stat-label">Stock bas</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon">XCircle</div>
          <div className="stat-value">{stats.outOfStock}</div>
          <div className="stat-label">Rupture</div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">TrendingUp</div>
          <div className="stat-value">
            {Number(stats.totalValue).toLocaleString("fr-MA")} DH
          </div>
          <div className="stat-label">Valeur du stock</div>
        </div>
      </div>

      <div className="admin-content">

        {/* ALERTES STOCK BAS */}
        <section className="admin-section">
          <h2>Alertes Stock Bas – À réapprovisionner rapidement</h2>
          {alerts.length === 0 ? (
            <div className="empty-state success">
              <span className="big-icon">CheckCircle</span>
              <p>Tout est bien approvisionné ! Excellent travail</p>
            </div>
          ) : (
            <div className="products-grid">
              {alerts.map(p => (
                <div key={p.id} className="product-card alert">
                  <img src={p.image_principale || "/placeholder.jpg"} alt={p.name} className="product-img" />
                  <div className="product-info">
                    <h3>{p.name}</h3>
                    <p className="ref">Réf: {p.reference || "N/A"}</p>
                    <p className="brand">{p.brand}</p>
                    <div className="stock-badge warning">
                      Stock: {p.stock} / Seuil: {p.seuil_alerte}
                    </div>
                  </div>
                  <div className="stock-update">
                    <input
                      type="number"
                      min="0"
                      defaultValue={p.stock}
                      disabled={updating === p.id}
                      onKeyUp={(e) => e.key === "Enter" && updateStock(p.id, e.target.value)}
                      className="stock-input"
                      placeholder="Nouveau stock"
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling
                        updateStock(p.id, input.value)
                      }}
                      disabled={updating === p.id}
                      className="btn-update"
                    >
                      {updating === p.id ? "..." : "Mettre à jour"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RUPTURES DE STOCK */}
        <section className="admin-section">
          <h2>Rupture de Stock – Urgence</h2>
          {ruptures.length === 0 ? (
            <div className="empty-state success">
              <span className="big-icon">CheckCircle</span>
              <p>Aucune rupture – Parfait !</p>
            </div>
          ) : (
            <div className="products-grid">
              {ruptures.map(p => (
                <div key={p.id} className="product-card rupture">
                  <img src={p.image_principale || "/placeholder.jpg"} alt={p.name} className="product-img" />
                  <div className="product-info">
                    <h3>{p.name}</h3>
                    <p className="ref">Réf: {p.reference || "N/A"}</p>
                    <p className="brand">{p.brand}</p>
                    <div className="rupture-badge">RUPTURE DE STOCK</div>
                  </div>
                  <div className="stock-update urgent">
                    <input
                      type="number"
                      min="1"
                      placeholder="Restocker..."
                      disabled={updating === p.id}
                      onKeyUp={(e) => e.key === "Enter" && updateStock(p.id, e.target.value)}
                      className="stock-input urgent"
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling
                        if (input.value) updateStock(p.id, input.value)
                      }}
                      disabled={updating === p.id}
                      className="btn-restock"
                    >
                      {updating === p.id ? "..." : "Restocker"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="admin-actions">
          <button onClick={() => navigate("/admin/products")} className="btn-large">
            Gérer tous les produits →
          </button>
          <button onClick={() => navigate("/admin/orders")} className="btn-large secondary">
            Voir toutes les commandes
          </button>
        </div>
      </div>
    </div>
  )
}