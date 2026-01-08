"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import api from "../api"
import "../styles/AdminDashboard.css"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])

  const [freeDelivery, setFreeDelivery] = useState(false)
  const [loadingPromo, setLoadingPromo] = useState(false)
  const [showPromoConfirm, setShowPromoConfirm] = useState(false)
  const [nextPromoValue, setNextPromoValue] = useState(false)

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
      toast.error("Erreur lors du chargement du dashboard")
    }
  }

  const toggleFreeDelivery = async (value) => {
    try {
      setLoadingPromo(true)

      await api.put("/admin/free-delivery", {
        value: value,
      })

      setFreeDelivery(value)

      toast.success(
        value
          ? "Livraison gratuite activée"
          : "Livraison gratuite désactivée"
      )
    } catch (err) {
      console.error("Promo toggle error:", err)
      toast.error("Erreur lors de la mise à jour de la promotion")
    } finally {
      setLoadingPromo(false)
    }
  }

  if (!stats) return <div>Chargement...</div>

  return (
    <>
      <div className="stats-wrapper">
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-title">Chiffre d'affaires</span>
            <div className="stat-val">{stats.revenue} MAD</div>
          </div>

          <div className="stat-card">
            <span className="stat-title">Commandes</span>
            <div className="stat-val">{stats.orders}</div>
          </div>

          <div className="stat-card">
            <span className="stat-title">Utilisateurs</span>
            <div className="stat-val">{stats.users}</div>
          </div>

          <div className="stat-card">
            <span className="stat-title">Produits</span>
            <div className="stat-val">{stats.products}</div>
          </div>
        </div>
      </div>
      <div className="panel promo-panel">
        <h2>Promotion livraison</h2>

        <div className="promo-row">
          <span>Livraison gratuite pour la première commande</span>

          <label className="switch">
            <input
              type="checkbox"
              checked={freeDelivery}
              disabled={loadingPromo}
              onChange={(e) => {
                setNextPromoValue(e.target.checked)
                setShowPromoConfirm(true)
              }}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="panel">
        <h2>
          Commandes récentes
          <span className="panel-subtitle"> 10 dernières commandes</span>
        </h2>
        <div className="table-wrapper">
          <table className="recent-orders">
            <thead>
              <tr>
                <th>N°</th>
                <th>Client</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.order_number}</td>
                  <td>{order.customer_name}</td>
                  <td className="amount">{order.total} MAD</td>
                  <td>
                    {new Date(order.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td>
                    <span className={`status status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showPromoConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Promotion livraison</h3>

            <p>
              <strong>Règle par défaut :</strong>
            </p>

            <ul>
              <li>Fes → 20 MAD</li>
              <li>Hors Fes → 40 MAD</li>
            </ul>

            <p>
              <strong>Si vous activez cette option :</strong>
            </p>

            <ul>
              <li>La livraison devient <strong>gratuite</strong></li>
              <li>Seulement pour la <strong>première commande B2C</strong></li>
              <li>Les commandes suivantes restent payantes</li>
            </ul>

            <p>
              Voulez-vous {nextPromoValue ? "activer" : "désactiver"} cette option ?
            </p>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowPromoConfirm(false)}
              >
                Annuler
              </button>

              <button
                className="btn-confirm"
                onClick={() => {
                  toggleFreeDelivery(nextPromoValue)
                  setShowPromoConfirm(false)
                }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}