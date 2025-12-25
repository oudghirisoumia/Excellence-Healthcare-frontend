"use client"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import api from "../api"
import "../styles/AdminOrders.css"

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await api.get("/admin/orders")
      setOrders(res.data || [])
    } catch (err) {
      console.error("Erreur chargement commandes admin:", err)
      toast.error("Impossible de charger les commandes")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, type, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status, type })
      toast.success("Statut mis à jour")
      loadOrders()
    } catch (err) {
      console.error("Erreur mise à jour statut:", err)
      toast.error("Impossible de mettre à jour le statut")
    }
  }

  if (loading) return <div className="loading">Chargement...</div>

  const filteredOrders =
    filter === "all" ? orders : orders.filter(order => order.type === filter)

  return (
    <div className="admin-orders-page">
      <h1>Gestion des commandes</h1>

      <div className="filters">
        <label>Filtrer par type :</label>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">Tous</option>
          <option value="b2c">B2C (retail)</option>
          <option value="b2b">B2B (bulk)</option>
        </select>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>N°</th>
            <th>Type</th>
            <th>Client</th>
            <th>Montant</th>
            <th>Statut</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 && (
            <tr>
              <td colSpan="7" className="empty">Aucune commande trouvée</td>
            </tr>
          )}
          {filteredOrders.map(order => (
            <tr key={`${order.type}-${order.id}`}>
              <td>{order.order_number}</td>
              <td>{order.type.toUpperCase()}</td>
              <td>{order.customer_name}</td>
              <td className="amount">{order.total} MAD</td>
              <td>
                <span className={`status-badge status-${order.status}`}>
                  {order.status}
                </span>
              </td>
              <td>{new Date(order.created_at).toLocaleDateString("fr-FR")}</td>
              <td>
                <select
                  value={order.status}
                  onChange={e => updateStatus(order.id, order.type, e.target.value)}
                >
                  <option value="pending">En attente</option>
                  <option value="processing">En traitement</option>
                  <option value="shipped">Expédié</option>
                  <option value="delivered">Livré</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
