"use client"
import { useEffect, useState } from "react"
import AdminLayout from "../components/AdminLayout"
import api from "../api"
import "../styles/AdminDashboard.css"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard")
      setStats(res.data.statistics)
      setRecentOrders(res.data.recentOrders)
    } catch (err) {
      console.error("Error loading admin dashboard:", err)
    }
  }

  if (!stats) return <AdminLayout><div>Chargement...</div></AdminLayout>

  return (
    <AdminLayout>
        <div className="stats-grid">
          {/* Revenue */}
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Chiffre d'affaires</span>
            </div>
            <div className="stat-val">{stats.revenue} MAD</div>
          </div>

          {/* Orders */}
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Commandes</span>
            </div>
            <div className="stat-val">{stats.orders}</div>
          </div>

          {/* Users */}
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Utilisateurs</span>
            </div>
            <div className="stat-val">{stats.users}</div>
          </div>

          {/* Products */}
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Produits</span>
            </div>
            <div className="stat-val">{stats.products}</div>
          </div>
        </div>

        <div className="panel">
          <h2>Dernières commandes</h2>
          <table className="recent-orders">
            <thead>
              <tr>
                <th>N°</th>
                <th>Client</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_number}</td>
                  <td>{order.customer_name}</td>
                  <td className="amount">{order.total} MAD</td>
                  <td>
                    <span className={`status ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminLayout>
      )
}