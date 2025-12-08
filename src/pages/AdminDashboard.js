import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import "../styles/AdminDashboard.css"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stats, setStats] = useState({ total: 0, lowStock: 0, outOfStock: 0 })
  const [alerts, setAlerts] = useState([])
  const [outOfStock, setOutOfStock] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    reference: "",
    description: "",
    prix_detail: "",
    prix_gros: "",
    stock: "",
    seuil_alerte: "",
    category_id: "",
    promotion: false,
    pourcentage_promo: "",
    image_principale: ""
  })

  useEffect(() => {
    checkAdminAccess()
    loadData()
  }, [])

  const checkAdminAccess = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (user.type !== "admin" && user.role !== "admin") {
      alert("Accès refusé - Administrateurs uniquement")
      navigate("/")
    }
  }

  const loadData = async () => {
    try {
      const [dashRes, alertRes, outRes, prodRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/alerts"),
        api.get("/out-of-stock"),
        api.get("/products")
      ])

      setStats(dashRes.data)
      setAlerts(alertRes.data)
      setOutOfStock(outRes.data)
      setProducts(prodRes.data.data || prodRes.data)
    } catch (err) {
      console.error("Erreur chargement:", err)
      if (err.response?.status === 401) {
        alert("Session expirée")
        navigate("/auth")
      }
    } finally {
      setLoading(false)
    }
  }

  const updateStock = async (id, newStock) => {
    if (newStock < 0) return
    try {
      await api.patch(`/products/${id}/stock`, { stock: newStock })
      loadData()
      alert("✅ Stock mis à jour !")
    } catch (err) {
      alert("❌ Erreur lors de la mise à jour")
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      brand: "",
      reference: "",
      description: "",
      prix_detail: "",
      prix_gros: "",
      stock: "",
      seuil_alerte: "",
      category_id: "",
      promotion: false,
      pourcentage_promo: "",
      image_principale: ""
    })
    setShowModal(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || "",
      brand: product.brand || "",
      reference: product.reference || "",
      description: product.description || "",
      prix_detail: product.prix_detail || "",
      prix_gros: product.prix_gros || "",
      stock: product.stock || "",
      seuil_alerte: product.seuil_alerte || "",
      category_id: product.category_id || "",
      promotion: product.promotion || false,
      pourcentage_promo: product.pourcentage_promo || "",
      image_principale: product.image_principale || ""
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData)
        alert("✅ Produit modifié avec succès !")
      } else {
        await api.post("/products", formData)
        alert("✅ Produit créé avec succès !")
      }
      setShowModal(false)
      loadData()
    } catch (err) {
      console.error("Erreur:", err.response?.data)
      alert("❌ Erreur: " + (err.response?.data?.message || "Échec de l'opération"))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return
    try {
      await api.delete(`/products/${id}`)
      alert("✅ Produit supprimé !")
      loadData()
    } catch (err) {
      alert("❌ Erreur lors de la suppression")
    }
  }

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="admin-loading">Chargement du Back-Office...</div>
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <h1>Back-Office Parapharmacie</h1>
        <p>Gestion complète des produits & stocks</p>
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

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 Tableau de bord
        </button>
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          📦 Gestion des produits
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
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
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="admin-section products-management">
          {/* Actions Bar */}
          <div className="products-header">
            <input
              type="text"
              placeholder="🔍 Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={openCreateModal} className="btn-primary">
              ➕ Ajouter un produit
            </button>
          </div>

          {/* Products Table */}
          <div className="products-table-container">
            <table className="products-table-full">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Produit</th>
                  <th>Référence</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>Promo</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      {product.image_principale ? (
                        <img src={product.image_principale} alt={product.name} className="product-thumb" />
                      ) : (
                        <div className="product-thumb-placeholder">No image</div>
                      )}
                    </td>
                    <td>
                      <div className="product-name">{product.name}</div>
                      <div className="product-brand">{product.brand}</div>
                    </td>
                    <td>{product.reference}</td>
                    <td>
                      <div className="product-price">{product.prix_detail} DH</div>
                      {product.prix_gros && (
                        <div className="product-price-wholesale">Gros: {product.prix_gros} DH</div>
                      )}
                    </td>
                    <td>
                      <span className={`stock-badge ${
                        product.stock === 0 ? "danger" :
                        product.stock <= product.seuil_alerte ? "warning" :
                        "success"
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      {product.promotion ? (
                        <span className="promo-badge">-{product.pourcentage_promo}%</span>
                      ) : (
                        <span className="no-promo">Non</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => openEditModal(product)} className="btn-edit">
                          ✏️ Modifier
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="btn-delete">
                          🗑️ Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="no-products">
                Aucun produit trouvé
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? "✏️ Modifier le produit" : "➕ Nouveau produit"}</h2>
              <button onClick={() => setShowModal(false)} className="modal-close">×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nom du produit *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Marque *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Référence *</label>
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Prix détail (DH) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="prix_detail"
                    value={formData.prix_detail}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Prix gros (DH)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="prix_gros"
                    value={formData.prix_gros}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Seuil d'alerte *</label>
                  <input
                    type="number"
                    name="seuil_alerte"
                    value={formData.seuil_alerte}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>URL de l'image</label>
                <input
                  type="url"
                  name="image_principale"
                  value={formData.image_principale}
                  onChange={handleInputChange}
                  placeholder="https://exemple.com/image.jpg"
                />
              </div>

              <div className="form-group promo-section">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="promotion"
                    checked={formData.promotion}
                    onChange={handleInputChange}
                  />
                  <span>Produit en promotion</span>
                </label>

                {formData.promotion && (
                  <input
                    type="number"
                    name="pourcentage_promo"
                    value={formData.pourcentage_promo}
                    onChange={handleInputChange}
                    placeholder="% de réduction"
                    min="0"
                    max="100"
                    className="promo-input"
                  />
                )}
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Annuler
                </button>
                <button type="submit" className="btn-submit">
                  {editingProduct ? "💾 Enregistrer" : "➕ Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}