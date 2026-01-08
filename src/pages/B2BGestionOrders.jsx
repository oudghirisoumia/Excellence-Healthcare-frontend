"use client"
import React, { useEffect, useState } from "react"
import api from "../api"
import "../styles/B2BGestionOrders.css"
import { toast } from "react-toastify"

function formatCurrency(number) {
  if (number == null) return "0 DH"
  return Number(number).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
  }) + " DH"
}

function formatDate(iso) {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("fr-FR")
}

function StatusBadge({ status }) {
  if (!status) return <span className="status-badge status-default">—</span>
  return <span className={`status-badge status-${status}`}>{status}</span>
}

const B2BGestionOrders = () => {
  const [orders, setOrders] = useState([])
  const [clients, setClients] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({ status: "" })

  const [form, setForm] = useState({
    client_id: "",
    payment_method: "",
    delivery_speed: "",
    notes: "",
    cart_items: [{ product_id: "", quantity: 1 }],
  })

  useEffect(() => {
    loadOrders()
    loadClients()
    loadProducts()
  }, [filters])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await api.get("/b2b/orders", {
        params: {
          status: filters.status || undefined,
        },
      })
      setOrders(res.data.data || [])
    } catch {
      toast.error("Erreur chargement commandes B2B")
    } finally {
      setLoading(false)
    }
  }

  const loadClients = async () => {
    try {
      const res = await api.get("/b2b/clients")
      setClients(res.data.data || [])
    } catch {
      toast.error("Erreur chargement clients")
    }
  }

  const loadProducts = async () => {
    try {
      const res = await api.get("/products")
      setProducts(res.data.data || [])
    } catch {
      toast.error("Erreur chargement produits")
    }
  }

  const handleItemChange = (index, field, value) => {
    const updated = [...form.cart_items]
    updated[index][field] = value
    setForm({ ...form, cart_items: updated })
  }

  const addItem = () => {
    setForm({
      ...form,
      cart_items: [...form.cart_items, { product_id: "", quantity: 1 }],
    })
  }

  const removeItem = index => {
    const updated = [...form.cart_items]
    updated.splice(index, 1)
    setForm({ ...form, cart_items: updated })
  }

  const resetForm = () => {
    setForm({
      client_id: "",
      payment_method: "",
      delivery_speed: "",
      notes: "",
      cart_items: [{ product_id: "", quantity: 1 }],
    })
  }

  function formatPaymentMethod(method) {
    if (method === "stripe") return "Paiement par carte"
    if (method === "cash") return "Paiement à la livraison"
    return method
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      await api.post("/b2b/orders", form)
      toast.success("Commande B2B créée avec succès")
      resetForm()
      loadOrders()
    } catch (error) {
      toast.error("Erreur lors de la création de la commande")
    }
  }

  return (
    <div className="b2b-orders-page">
      <h1>Commandes clients</h1>

      <form className="order-form" onSubmit={handleSubmit}>
        <h2>Nouvelle commande</h2>

        <select
          value={form.client_id}
          onChange={e => setForm({ ...form, client_id: e.target.value })}
          required
        >
          <option value="" disabled>
            — Choisir un client —
          </option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name} — {client.city}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
        />

        <select
          value={form.payment_method}
          onChange={e =>
            setForm({ ...form, payment_method: e.target.value })
          }
          required
        >
          <option value="" disabled>
            — Sélectionner le moyen de paiement —
          </option>
          <option value="cash">Cash</option>
          <option value="stripe">Stripe</option>
        </select>

        <select
          value={form.delivery_speed}
          onChange={e =>
            setForm({ ...form, delivery_speed: e.target.value })
          }
          required
        >
          <option value="" disabled>
            — Sélectionner le mode de livraison —
          </option>
          <option value="standard">Standard</option>
          <option value="express">Express</option>
          <option value="pickup">Retrait</option>
        </select>

        <h3>Articles</h3>

        {form.cart_items.map((item, idx) => (
          <div className="order-item" key={idx}>
            <select
              value={item.product_id}
              onChange={e =>
                handleItemChange(idx, "product_id", e.target.value)
              }
              required
            >
              <option value="" disabled>
                — Choisir un Produit —
              </option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={e =>
                handleItemChange(idx, "quantity", Number(e.target.value))
              }
              required
            />

            <button type="button" onClick={() => removeItem(idx)}>
              ✕
            </button>
          </div>
        ))}

        <button type="button" onClick={addItem}>
          + Ajouter un produit
        </button>

        <button type="submit" className="primary">
          Créer la commande
        </button>
      </form>

      <div className="filters">
        <select
          value={filters.status}
          onChange={e => setFilters({ status: e.target.value })}
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
                <th>Créé par</th>
                <th>Client</th>
                <th>Ville</th>
                <th>Paiement</th>
                <th>Livraison</th>
                <th>Sous-total</th>
                <th>TVA</th>
                <th>Frais Livraison</th>
                <th>Total</th>
                <th>Statut</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan="12" className="empty">
                    Aucune commande
                  </td>
                </tr>
              )}

              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{formatDate(order.created_at)}</td>

                  <td>{order.user?.name}</td>

                  <td>{order.client?.name}</td>
                  <td>{order.client?.city}</td>

                  <td>{formatPaymentMethod(order.payment_method)}</td>
                  <td>{order.delivery_speed}</td>

                  <td>{formatCurrency(order.subtotal)}</td>
                  <td>{formatCurrency(order.tva)}</td>
                  <td>{formatCurrency(order.shipping_fee)}</td>

                  <td className="amount">
                    {formatCurrency(order.total)}
                  </td>

                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  )
}

export default B2BGestionOrders