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
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
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
    const [dashRes, alertRes, outRes, prodRes, catRes] = await Promise.all([
      api.get("/dashboard"),
      api.get("/alerts"),
      api.get("/out-of-stock"),
      api.get("/products"),
      api.get("/categories")
    ])

    setStats(dashRes.data)
    setAlerts(alertRes.data || [])
    setOutOfStock(outRes.data || [])
    setProducts(prodRes.data.data || prodRes.data || [])

    // PROTECTION CONTRE TOUS LES FORMATS POSSIBLES
    const cats = catRes.data
    if (Array.isArray(cats)) {
      setCategories(cats)
    } else if (cats && Array.isArray(cats.data)) {
      setCategories(cats.data)
    } else if (cats && Array.isArray(cats.categories)) {
      setCategories(cats.categories)
    } else {
      console.warn("Format catégories inconnu :", cats)
      setCategories([])
    }

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
    if (newStock < 0 || !newStock) return
    try {
      await api.patch(`/products/${id}/stock`, { stock: parseInt(newStock) })
      loadData()
      alert("Stock mis à jour !")
    } catch (err) {
      alert("Erreur mise à jour")
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "excellence")

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dj7k9t7mx/image/upload`,
        { method: "POST", body: formData }
      )
      const data = await res.json()
      setFormData(prev => ({ ...prev, image_principale: data.secure_url }))
      setImageFile(data.secure_url)
      alert("Image uploadée !")
    } catch (err) {
      alert("Erreur upload")
    } finally {
      setUploadingImage(false)
    }
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setImageFile(null)
    setFormData({
      name: "", brand: "", reference: "", description: "",
      prix_detail: "", prix_gros: "", stock: "", seuil_alerte: "",
      category_id: "", promotion: false, pourcentage_promo: "", image_principale: ""
    })
    setShowModal(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setImageFile(product.image_principale)
    setFormData({ ...product, promotion: !!product.promotion })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData)
        alert("Produit modifié !")
      } else {
        await api.post("/products", formData)
        alert("Produit créé !")
      }
      setShowModal(false)
      loadData()
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.message || "Échec"))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce produit ?")) return
    try {
      await api.delete(`/products/${id}`)
      alert("Produit supprimé")
      loadData()
    } catch (err) {
      alert("Erreur suppression")
    }
  }

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="admin-loading">Chargement...</div>

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Back-Office Excellence Healthcare</h1>
        <p>Gestion complète • Stock • Produits • Commandes</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card total"><h3>{stats.total || 0}</h3><p>Produits total</p></div>
        <div className="stat-card warning"><h3>{stats.lowStock || 0}</h3><p>Stock bas</p></div>
        <div className="stat-card danger"><h3>{stats.outOfStock || 0}</h3><p>Rupture</p></div>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>Tableau de bord</button>
        <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>Gestion produits</button>
      </div>

      {/* Onglet Dashboard */}
      {activeTab === "dashboard" && (
        <div className="admin-sections">
          <section className="admin-section">
            <h2>Alertes Stock Bas</h2>
            {alerts.length === 0 ? <p className="empty">Tout est OK !</p> : (
              <div className="products-table">
                {alerts.map(p => (
                  <div key={p.id} className="product-row warning">
                    <div><strong>{p.name}</strong><br /><small>Réf: {p.reference} • Stock: {p.stock}</small></div>
                    <input type="number" defaultValue={p.stock} onBlur={(e) => updateStock(p.id, e.target.value)} className="stock-input" />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="admin-section">
            <h2>Rupture de Stock</h2>
            {outOfStock.length === 0 ? <p className="empty">Aucune rupture</p> : (
              <div className="products-table">
                {outOfStock.map(p => (
                  <div key={p.id} className="product-row danger">
                    <div><strong>{p.name}</strong><br /><small>Réf: {p.reference}</small></div>
                    <input type="number" placeholder="Restock..." onBlur={(e) => e.target.value && updateStock(p.id, e.target.value)} className="stock-input" />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Onglet Gestion Produits */}
      {activeTab === "products" && (
        <div className="admin-section products-management">
          <div className="products-header">
            <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
            <button onClick={openCreateModal} className="btn-primary">Ajouter un produit</button>
          </div>

          <div className="products-table-container">
            <table className="products-table-full">
              <thead>
                <tr>
                  <th>Image</th><th>Produit</th><th>Réf</th><th>Prix</th><th>Stock</th><th>Promo</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td><img src={p.image_principale || "/placeholder.jpg"} alt="" className="product-thumb" /></td>
                    <td><div className="product-name">{p.name}</div><div className="product-brand">{p.brand}</div></td>
                    <td>{p.reference}</td>
                    <td>{p.prix_detail} DH</td>
                    <td><span className={`stock-badge ${p.stock === 0 ? "danger" : p.stock <= p.seuil_alerte ? "warning" : "success"}`}>{p.stock}</span></td>
                    <td>{p.promotion ? `-${p.pourcentage_promo}%` : "—"}</td>
                    <td>
                      <button onClick={() => openEditModal(p)} className="btn-edit">Modifier</button>
                      <button onClick={() => handleDelete(p.id)} className="btn-delete">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editingProduct ? "Modifier le produit" : "Nouveau produit"}</h2>
            <form onSubmit={handleSubmit} className="modal-form">

              <div className="form-row">
                <input name="name" placeholder="Nom *" value={formData.name} onChange={handleInputChange} required />
                <input name="brand" placeholder="Marque *" value={formData.brand} onChange={handleInputChange} required />
              </div>

              <input name="reference" placeholder="Référence *" value={formData.reference} onChange={handleInputChange} required />

              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} rows="3" />

              <div className="form-row">
                <input name="prix_detail" type="number" step="0.01" placeholder="Prix détail (DH) *" value={formData.prix_detail} onChange={handleInputChange} required />
                <input name="prix_gros" type="number" step="0.01" placeholder="Prix gros (DH)" value={formData.prix_gros} onChange={handleInputChange} />
              </div>

              <div className="form-row">
                <input name="stock" type="number" placeholder="Stock *" value={formData.stock} onChange={handleInputChange} required />
                <input name="seuil_alerte" type="number" placeholder="Seuil alerte *" value={formData.seuil_alerte} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label>Catégorie *</label>
              <select name="category_id" value={formData.category_id} onChange={handleInputChange} required className="form-select">
                <option value="">Choisir une catégorie</option>
                {(categories || []).map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
</select>
              </div>

              <div className="form-group">
                <label>Image du produit *</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                {uploadingImage && <p>Upload en cours...</p>}
                {imageFile && <div className="image-preview"><img src={imageFile} alt="Preview" /></div>}
              </div>

              <label className="checkbox-label">
                <input type="checkbox" name="promotion" checked={formData.promotion} onChange={handleInputChange} />
                <span>Produit en promotion</span>
              </label>
              {formData.promotion && (
                <input name="pourcentage_promo" type="number" min="1" max="90" placeholder="% réduction" value={formData.pourcentage_promo} onChange={handleInputChange} />
              )}

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">Annuler</button>
                <button type="submit" className="btn-submit">
                  {editingProduct ? "Enregistrer" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}