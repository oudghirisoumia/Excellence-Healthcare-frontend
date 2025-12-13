import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import "../styles/admin.css"  // We'll create this

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, lowStock: 0, outOfStock: 0 })
  const [alerts, setAlerts] = useState([])
  const [outOfStock, setOutOfStock] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check if user is admin (you can improve this later)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (user.type !== "admin" && user.role !== "admin") {
      alert("Accès refusé")
      navigate("/")
      return
    }

    loadDashboard()
  }, [navigate])

  const loadDashboard = async () => {
    try {
      const [dashRes, alertRes, outRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/alerts"),
        api.get("/out-of-stock")
      ])

      setStats(dashRes.data)
      setAlerts(alertRes.data)
      setOutOfStock(outRes.data)
    } catch (err) {
      alert("Erreur de chargement du tableau de bord")
    } finally {
      setLoading(false)
    }
  }

  const updateStock = async (id, newStock) => {
    if (newStock < 0) return
    try {
      await api.patch(`/products/${id}/stock`, { stock: newStock })
      loadDashboard() // refresh
      alert("Stock mis à jour !")
    } catch (err) {
      alert("Erreur")
    }
  }

  if (loading) return <div className="admin-loading">Chargement du Back-Office...</div>

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Back-Office Parapharmacie</h1>
        <p>Gestion des produits & stocks</p>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <h3>{stats.total || 0}</h3>
          <p>Produits total</p>
        </div>
        <div className="stat-card warning">
          <h3>{stats.lowStock || 0}</h3>
          <p>Stock bas</p>
        </div>
        <div className="stat-card danger">
          <h3>{stats.outOfStock || 0}</h3>
          <p>Rupture</p>
        </div>
      </div>

      <div className="admin-sections">
        {/* Low Stock Alerts */}
        <section className="admin-section">
          <h2>Alertes Stock Bas</h2>
          {alerts.length === 0 ? (
            <p className="empty">Tout est OK !</p>
          ) : (
            <div className="products-table">
              {alerts.map(p => (
                <div key={p.id} className="product-row warning">
                  <div>
                    <strong>{p.name}</strong><br />
                    <small>Réf: {p.reference} • Stock: {p.stock} (seuil: {p.seuil_alerte})</small>
                  </div>
                  <input
                    type="number"
                    min="0"
                    defaultValue={p.stock}
                    onBlur={(e) => updateStock(p.id, parseInt(e.target.value))}
                    className="stock-input"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Out of Stock */}
        <section className="admin-section">
          <h2>Rupture de Stock</h2>
          {outOfStock.length === 0 ? (
            <p className="empty">Aucune rupture</p>
          ) : (
            <div className="products-table">
              {outOfStock.map(p => (
                <div key={p.id} className="product-row danger">
                  <div>
                    <strong>{p.name}</strong><br />
                    <small>Réf: {p.reference}</small>
                  </div>
                  <input
                    type="number"
                    min="0"
                    placeholder="Nouveau stock"
                    onBlur={(e) => e.target.value && updateStock(p.id, parseInt(e.target.value))}
                    className="stock-input"
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="admin-actions">
        <button onClick={() => navigate("/admin/products")} className="btn-primary">
          Gérer tous les produits
        </button>
      </div>
    </div>
  )
}