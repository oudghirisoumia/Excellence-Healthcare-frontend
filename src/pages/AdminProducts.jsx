import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../api";
import "../styles/AdminProducts.css";

export default function AdminProducts() {
  const [activeTab, setActiveTab] = useState("alerts");

  // Stats + alerts
  const [stats, setStats] = useState({ total: 0, lowStock: 0, outOfStock: 0 });
  const [alerts, setAlerts] = useState([]);
  const [outOfStock, setOutOfStock] = useState([]);

  // Products + categories
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const navigate = useNavigate();

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
    image_principale: "",
    tags: "",
    images_secondaires: ""
  });

  useEffect(() => {
    checkAdminAccess();
    loadData();
  }, []);

  const checkAdminAccess = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.type !== "admin" && user.role !== "admin") {
      toast.error("Accès refusé - Administrateurs uniquement");
      navigate("/");
    }
  };

  const loadData = async () => {
    try {
      const [dashRes, alertRes, outRes, prodRes, catRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/alerts"),
        api.get("/out-of-stock"),
        api.get("/products"),
        api.get("/categories")
      ]);

      setStats({
        total: dashRes.data.statistics?.products || 0,
        lowStock: (alertRes.data || []).length,
        outOfStock: (outRes.data || []).length
      });

      setAlerts(alertRes.data || []);
      setOutOfStock(outRes.data || []);
      setProducts(prodRes.data.data || []); // paginator data
      setCategories(catRes.data.categories || []);
    } catch (err) {
      console.error("Erreur chargement:", err);
      if (err.response?.status === 401) {
        toast.error("Session expirée");
        navigate("/auth");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id, newStock) => {
    const parsed = parseInt(newStock, 10);
    if (Number.isNaN(parsed) || parsed < 0) return;
    try {
      await api.patch(`/products/${id}/stock`, { stock: parsed });
      loadData();
      toast.success("Stock mis à jour !");
    } catch {
      toast.error("Erreur mise à jour");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Cloudinary upload; store secure_url into image_principale (URL string)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "excellence_healthcare");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/ddufkwapt/image/upload", {
        method: "POST",
        body: fd
      });
      const data = await res.json();
      setFormData((prev) => ({ ...prev, image_principale: data.secure_url }));
      setImageFile(data.secure_url);
      toast.success("Image uploadée !");
    } catch {
      toast.error("Erreur upload");
    } finally {
      setUploadingImage(false);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setImageFile(null);
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
      image_principale: "",
      tags: "",
      images_secondaires: ""
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setImageFile(product.image_principale || null);

    setFormData({
      name: product.name || "",
      brand: product.brand || "",
      reference: product.reference || "",
      description: product.description || "",
      prix_detail: product.prix_detail ?? "",
      prix_gros: product.prix_gros ?? "",
      stock: product.stock ?? "",
      seuil_alerte: product.seuil_alerte ?? "",
      category_id: product.category?.id || product.category_id || "",
      promotion: !!product.promotion,
      pourcentage_promo: product.pourcentage_promo ?? "",
      image_principale: product.image_principale || "",

      tags: Array.isArray(product.tags) ? product.tags.join(", ") : (product.tags || ""),

      images_secondaires: Array.isArray(product.images_secondaires)
        ? product.images_secondaires.join(", ")
        : (product.images_secondaires || "")
    });

    setShowModal(true);
  };

  const buildPayload = () => {
    const payload = { ...formData };

    // Numbers
    payload.prix_detail = formData.prix_detail === "" ? null : Number(formData.prix_detail);
    payload.prix_gros = formData.prix_gros === "" ? null : Number(formData.prix_gros);
    payload.stock = formData.stock === "" ? null : parseInt(formData.stock, 10);
    payload.seuil_alerte = formData.seuil_alerte === "" ? null : parseInt(formData.seuil_alerte, 10);
    payload.category_id = formData.category_id ? parseInt(formData.category_id, 10) : null;
    payload.pourcentage_promo =
      formData.pourcentage_promo === "" ? null : Number(formData.pourcentage_promo);

    if (formData.tags && formData.tags.trim().length > 0) {
      const arr = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      payload.tags = JSON.stringify(arr);
    } else {
      payload.tags = null;
    }

    if (formData.images_secondaires && formData.images_secondaires.trim().length > 0) {
      const urls = formData.images_secondaires
        .split(",")
        .map((u) => u.trim())
        .filter((u) => u.length > 0);
      payload.images_secondaires = urls;
    } else {
      payload.images_secondaires = null;
    }

    return payload;
  };

  // Upload multiple secondary images to Cloudinary
  const handleSecondaryImagesUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadedUrls = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "excellence_healthcare");

      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/ddufkwapt/image/upload", {
          method: "POST",
          body: fd
        });
        const data = await res.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      } catch (err) {
        console.error("Erreur upload secondaire:", err);
        toast.error("Erreur upload image secondaire");
      }
    }

    // Save array of URLs into formData
    setFormData((prev) => ({
      ...prev,
      images_secondaires: uploadedUrls
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = buildPayload();

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        toast.success("Produit modifié !");
      } else {
        await api.post("/products", payload);
        toast.success("Produit créé !");
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Erreur: " + (err.response?.data?.error || "Échec"));
    }
  };

  const confirmDeleteToast = (onConfirm) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Supprimer ce produit ?</p>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button
              onClick={() => {
                onConfirm();
                closeToast();
              }}
              style={{ background: "#d9534f", color: "#fff", border: "none", padding: "5px 10px" }}
            >
              Supprimer
            </button>
            <button
              onClick={closeToast}
              style={{ background: "#ccc", border: "none", padding: "5px 10px" }}
            >
              Annuler
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  const handleDelete = (id) => {
    confirmDeleteToast(async () => {
      try {
        await api.delete(`/products/${id}`);
        toast.success("Produit supprimé");
        loadData();
      } catch {
        toast.error("Erreur suppression");
      }
    });
  };

  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.reference || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.brand || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div className="admin-products-container">

      {/* Stats cards */}
      <div className="products-stats-grid">
        <div className="products-stat-card total">
          <h3>{stats.total || 0}</h3>
          <p>Produits total</p>
        </div>
        <div className="products-stat-card warning">
          <h3>{stats.lowStock || 0}</h3>
          <p>Stock bas</p>
        </div>
        <div className="products-stat-card danger">
          <h3>{stats.outOfStock || 0}</h3>
          <p>Rupture</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="products-tabs">
        <button
          className={activeTab === "alerts" ? "active" : ""}
          onClick={() => setActiveTab("alerts")}
        >
          Alertes stock
        </button>
        <button
          className={activeTab === "gestion" ? "active" : ""}
          onClick={() => setActiveTab("gestion")}
        >
          Produits
        </button>
      </div>

      {/* Alerts tab */}
      {activeTab === "alerts" && (
        <div className="alerts-sections">
          <section className="alerts-section">
            <h2>Alertes stock bas</h2>
            {alerts.length === 0 ? (
              <p className="alerts-empty">Tout est OK !</p>
            ) : (
              <div className="alerts-products-table">
                {alerts.map((p) => (
                  <div key={p.id} className="alerts-product-row warning">
                    <div>
                      <strong>{p.name}</strong>
                      <br />
                      <small>Réf: {p.reference} • Stock: {p.stock}</small>
                    </div>
                    <input
                      type="number"
                      defaultValue={p.stock}
                      onBlur={(e) => updateStock(p.id, e.target.value)}
                      className="alerts-stock-input"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="alerts-section">
            <h2>Rupture de stock</h2>
            {outOfStock.length === 0 ? (
              <p className="alerts-empty">Aucune rupture</p>
            ) : (
              <div className="alerts-products-table">
                {outOfStock.map((p) => (
                  <div key={p.id} className="alerts-product-row danger">
                    <div>
                      <strong>{p.name}</strong>
                      <br />
                      <small>Réf: {p.reference}</small>
                    </div>
                    <input
                      type="number"
                      placeholder="Restock..."
                      onBlur={(e) => e.target.value && updateStock(p.id, e.target.value)}
                      className="alerts-stock-input"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Products management tab */}
      {activeTab === "gestion" && (
        <div className="gestion-section">
          <div className="gestion-header">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="gestion-search-input"
            />
            <button onClick={openCreateModal} className="gestion-btn-primary">
              Ajouter un produit
            </button>
          </div>

          <div className="gestion-table-container">
            <table className="gestion-table-full">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Produit</th>
                  <th>Marque</th>
                  <th>Catégorie</th>
                  <th>Description</th>
                  <th>Réf</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>Promo</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img
                        src={p.image_principale || "/placeholder.jpg"}
                        alt=""
                        className="gestion-product-thumb"
                      />
                    </td>
                    <td>
                      <div className="gestion-product-name">{p.name}</div>
                    </td>
                    <td>
                      <div className="gestion-product-brand">{p.brand}</div>
                    </td>
                    <td>{p.category?.name || "—"}</td>
                    <td className="gestion-description-cell">
                      {p.description || "—"}
                    </td>
                    <td>{p.reference}</td>
                    <td>{p.prix_detail} DH</td>
                    <td>
                      <span
                        className={`gestion-stock-badge ${p.stock === 0
                          ? "danger"
                          : p.stock <= (p.seuil_alerte ?? 0)
                            ? "warning"
                            : "success"
                          }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td>{p.promotion ? `-${p.pourcentage_promo}%` : "—"}</td>
                    <td>
                      <button onClick={() => openEditModal(p)} className="gestion-btn-edit">
                        Modifier
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="gestion-btn-delete">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? "Modifier le produit" : "Nouveau produit"}</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <input
                  name="name"
                  placeholder="Nom *"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  name="brand"
                  placeholder="Marque *"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <input
                name="reference"
                placeholder="Référence *"
                value={formData.reference}
                onChange={handleInputChange}
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
              />

              <div className="form-row">
                <input
                  name="prix_detail"
                  type="number"
                  step="0.01"
                  placeholder="Prix détail (DH) *"
                  value={formData.prix_detail}
                  onChange={handleInputChange}
                  required
                />
                <input
                  name="prix_gros"
                  type="number"
                  step="0.01"
                  placeholder="Prix gros (DH)"
                  value={formData.prix_gros}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <input
                  name="stock"
                  type="number"
                  placeholder="Stock *"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
                <input
                  name="seuil_alerte"
                  type="number"
                  placeholder="Seuil alerte *"
                  value={formData.seuil_alerte}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Catégorie *</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                  className="form-select"
                >
                  <option value="">Choisir une catégorie</option>
                  {(categories || []).map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </option>
                  ))}
                </select>

              </div>

              <div className="form-group">
                <label>Image principale *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                {uploadingImage && <p>Upload en cours...</p>}
                {imageFile && (
                  <div className="image-preview">
                    <img src={imageFile} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Images secondaires (upload ou URLs)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleSecondaryImagesUpload}
                />
                <input
                  name="images_secondaires"
                  placeholder="https://..., https://..."
                  value={formData.images_secondaires}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Tags (séparés par des virgules)</label>
                <input
                  name="tags"
                  placeholder="ex: santé, hygiène, pharmacie"
                  value={formData.tags}
                  onChange={handleInputChange}
                />
              </div>

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
                  name="pourcentage_promo"
                  type="number"
                  min="1"
                  max="90"
                  placeholder="% réduction"
                  value={formData.pourcentage_promo}
                  onChange={handleInputChange}
                />
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-cancel"
                >
                  Annuler
                </button>
                <button type="submit" className="btn-submit">
                  {editingProduct ? "Enregistrer" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}