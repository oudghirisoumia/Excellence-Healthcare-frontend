"use client"
import React, { useEffect, useState } from "react"
import api from "../api"
import "../styles/B2BOrders.css"

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

  useEffect(() => {
    loadOrders()
  }, [filters])

const loadOrders = async () => {
  try {
    const res = await api.get("/orders")
    
    // PROTECTION CONTRE TOUS LES FORMATS POSSIBLES
    let ordersArray = []
    if (Array.isArray(res.data)) {
      ordersArray = res.data
    } else if (res.data && Array.isArray(res.data.data)) {
      ordersArray = res.data.data
    } else if (res.data && Array.isArray(res.data.orders)) {
      ordersArray = res.data.orders
    } else {
      console.warn("Format commandes inconnu :", res.data)
      ordersArray = []
    }

    setOrders(ordersArray)
  } catch (err) {
    console.error(err)
    if (err.response?.status === 401) {
      alert("Veuillez vous connecter")
      navigate("/auth")
    } else {
      alert("Impossible de charger vos commandes")
    }
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="b2b-orders-page">
      <h1>Commandes B2B</h1>

      {/* Filters */}
      <div className="filters">
        <input
          placeholder="Rechercher par client ou numéro"
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
        />
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
        <button onClick={loadOrders}>Filtrer</button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading">Chargement...</div>
      ) : (
        <div className="table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>N° Commande</th>
                <th>Date</th>
                <th>Client</th>
                <th>Produits</th>
                <th>Total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty">Aucune commande trouvée</td>
                </tr>
              )}
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_number ?? `CMD-${order.id}`}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.items?.length || 0}</td>
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
