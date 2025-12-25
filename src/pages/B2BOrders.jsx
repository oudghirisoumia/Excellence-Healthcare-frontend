"use client"
import React, { useEffect, useState } from "react"
import api from "../api"
import "../styles/B2BOrders.css"
import { toast } from "react-toastify"

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
  return <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
}

const B2BOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: "", search: "" })
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    notes: "",
    paymentMethod: "cash",
    deliveryMethod: "",
    discount: 0,
    items: [{ productId: "", quantity: 1 }],
  })

  useEffect(() => {
    loadOrders()
    loadProducts()
  }, [filters])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await api.get("/b2b/orders", {
        params: {
          status: filters.status || undefined,
          search: filters.search || undefined,
        },
      })
      setOrders(res.data.data || [])
    } catch (err) {
      console.error("Erreur chargement commandes B2B :", err)
      toast.error("Impossible de charger vos commandes B2B")
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      const res = await api.get("/products")
      setProducts(res.data.data || [])
    } catch (err) {
      console.error("Erreur chargement produits :", err)
      setProducts([])
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await api.post("/b2b/orders", form)
      toast.success("Commande en gros créée avec succès")
      resetForm()
      loadOrders()
    } catch (err) {
      console.error("Erreur création commande :", err)
      toast.error("Erreur lors de la création de la commande")
    }
  }

  const resetForm = () => {
    setForm({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
      notes: "",
      paymentMethod: "cash",
      deliveryMethod: "",
      discount: 0,
      items: [{ productId: "", quantity: 1 }],
    })
  }

  const handleItemChange = (index, field, value) => {
    const updated = [...form.items]
    updated[index][field] = value
    setForm({ ...form, items: updated })
  }

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { productId: "", quantity: 1 }] })
  }

  const removeItem = index => {
    const updated = [...form.items]
    updated.splice(index, 1)
    setForm({ ...form, items: updated })
  }

  return (
    <div className="b2b-orders-page">
      <h1>Commandes B2B</h1>

      {/* Form to create bulk order */}
      <form className="order-form" onSubmit={handleSubmit}>
        <input placeholder="Nom du client" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} required />
        <input placeholder="Email du client" type="email" value={form.customerEmail} onChange={e => setForm({ ...form, customerEmail: e.target.value })} required />
        <input placeholder="Téléphone du client" value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} required />
        <input placeholder="Adresse du client" value={form.customerAddress} onChange={e => setForm({ ...form, customerAddress: e.target.value })} required />
        <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />

        <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} required>
          <option value="cash">Cash</option>
          <option value="card">Carte</option>
          <option value="stripe">Stripe</option>
        </select>

        <select value={form.deliveryMethod} onChange={e => setForm({ ...form, deliveryMethod: e.target.value })} required>
          <option value="">-- Choisir une méthode de livraison --</option>
          <option value="standard">Standard</option>
          <option value="express">Express</option>
          <option value="pickup">Retrait</option>
        </select>

        <input
          type="number"
          placeholder="Remise"
          value={form.discount}
          onChange={e => {
            const val = e.target.value
            setForm({ ...form, discount: val === "" ? 0 : parseFloat(val) })
          }}
        />

        <h3>Articles</h3>
        {form.items.map((item, idx) => (
          <div key={idx} className="order-item">
            <select value={item.productId} onChange={e => handleItemChange(idx, "productId", e.target.value)} required>
              <option value="">-- Choisir un produit --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.price} DH)</option>
              ))}
            </select>
            <input type="number" placeholder="Quantité" value={item.quantity} onChange={e => handleItemChange(idx, "quantity", parseInt(e.target.value))} required />
            <button type="button" onClick={() => removeItem(idx)}>Supprimer</button>
          </div>
        ))}
        <button type="button" onClick={addItem}>+ Ajouter un article</button>

        <button type="submit">Créer commande</button>
      </form>

      <div className="filters">
        <select
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="processing">En traitement</option>
          <option value="shipped">Expédié</option>
          <option value="delivered">Livré</option>
          <option value="cancelled">Annulé</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Chargement...</div>
      ) : (
        <div className="table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Client</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty">Aucune commande trouvée</td>
                </tr>
              )}
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.customer_email}</td>
                  <td>{order.customer_phone}</td>
                  <td className="amount">{formatCurrency(order.total)}</td>
                  <td><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default B2BOrders