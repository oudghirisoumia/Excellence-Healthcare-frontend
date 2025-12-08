import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import "../styles/admin.css"

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

  // Vérification admin + chargement
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

      setStats(statsRes.data)
      setAlerts(alertsRes.data)
      setRuptures(rupturesRes.data)
    } catch (err) {
      alert("Impossible de charger le tableau de bord")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStock = async (productId, newStock) => {
    if (newStock < 0 || newStock === "") return
    setUpdating(productId)

    try {
      await api.patch(`/products/${productId}/stock`, { stock: parseInt(newStock) })
      loadDashboard()
    } catch (err) {
      alert("Erreur lors de la mise à jour du stock")
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
      <div className="admin-header">
        <div className="header-content">
          <h1>Back-Office Excellence Healthcare</h1>
          <p>Gestion complète des produits et stocks</p>
        </div>
      </div>

      {/* CARTES DE STATISTIQUES */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">Box</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Produits total</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">Warning</div>
          <div className="stat-value">{stats.lowStock}</div>
          <div className="stat-label">Stock bas</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">Alert</div>
          <div className="stat-value">{stats.outOfStock}</div>
          <div className="stat-label">Rupture de stock</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">Money</div>
          <div className="stat-value">{stats.totalValue?.toLocaleString() || 0} DH</div>
          <div className="stat-label">Valeur du stock</div>
        </div>
      </div>

      <div className="admin-content">

        {/* ALERTES STOCK BAS */}
        <section className="admin-section">
          <h2>Alertes Stock Bas (à réapprovisionner rapidement)</h2>
          {alerts.length === 0 ? (
            <div className="empty-state">
              <span className="big-icon">Check</span>
              <p>Tous les produits sont bien approvisionnés !</p>
            </div>
          ) : (
            <div className="products-grid">
              {alerts.map(p => (
                <div key={p.id} className="product-card warning">
                  {p.image_principale && (
                    <img src={p.image_principale} alt={p.name} className="product-img" />
                  )}
                  <div className="product-info">
                    <h3>{p.name}</h3>
                    <p className="ref">Réf: {p.reference || "N/A"}</p>
                    <p className="brand">{p.brand}</p>
                    <div className="stock-info">
                      <span className="stock-current">Stock: {p.stock}</span>
                      <span className="stock-threshold">Seuil: {p.seuil_alerte}</span>
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
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling
                        updateStock(p.id, input.value)
                      }}
                      disabled={updating === p.id}
                      className="btn-update"
                    >
                      {updating === p.id ? "..." : "Update"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RUPTURES DE STOCK */}
        <section className="admin-section">
          <h2>Rupture de Stock (urgence)</h2>
          {ruptures.length === 0 ? (
            <div className="empty-state">
              <span className="big-icon">Check</span>
              <p>Aucune rupture pour le moment</p>
            </div>
          ) : (
            <div className="products-grid">
              {ruptures.map(p => (
                <div key={p.id} className="product-card danger">
                  {p.image_principale && (
                    <img src={p.image_principale} alt={p.name} className="product-img" />
                  )}
                  <div className="product-info">
                    <h3>{p.name}</h3>
                    <p className="ref">Réf: {p.reference || "N/A"}</p>
                    <p className="brand">{p.brand}</p>
                    <div className="rupture-badge">RUPTURE</div>
                  </div>
                  <div className="stock-update">
                    <input
                      type="number"
                      min="1"
                      placeholder="Nouveau stock"
                      disabled={updating === p.id}
                      onKeyUp={(e) => e.key === "Enter" && updateStock(p.id, e.target.value)}
                      className="stock-input"
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling
                        if (input.value) updateStock(p.id, input.value)
                      }}
                      disabled={updating === p.id}
                      className="btn-restock"
                    >
                      {updating === p.id ? "..." : "Restock"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="admin-footer">
          <button
            onClick={() => navigate("/admin/products")}
            className="btn-large"
          >
            Gérer tous les produits →
          </button>
        </div>
      </div>
    </div>
  )
}