"use client"
import React, { useEffect, useState } from "react"
import api from "../api"
import { toast } from "react-toastify"
import "../styles/B2BOrdersPage.css"

/* ---------- Utils ---------- */

function formatCurrency(number) {
  if (number == null) return "0,00 DH"
  return (
    Number(number).toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
    }) + " DH"
  )
}

function formatDate(iso) {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("fr-FR")
}

function formatPaymentMethod(method) {
  return method === "stripe"
    ? "Carte bancaire"
    : "Paiement à la livraison"
}

/* ---------- Components ---------- */

function StatusBadge({ status }) {
  if (!status) return <span className="od-status od-status--empty">—</span>
  return <span className={`od-status od-status--${status}`}>{status}</span>
}

function OrderDetailsModal({ order, onClose, onDownloadInvoice }) {
  if (!order) return null

  const subtotal = Number(order.subtotal || 0)
  const tva = subtotal * 0.2
  const totalTTC = subtotal + tva + Number(order.shipping_fee || 0)

  return (
    <div className="od-modal-overlay">
      <div className="od-modal-container">

        <div className="od-modal-header">
          <h2 className="od-modal-title">Commande #{order.id}</h2>
          <button className="od-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="od-modal-block">
          <h3 className="od-modal-subtitle">Client</h3>
          <p className="od-modal-text"><strong>Nom :</strong> {order.customer_name}</p>
          <p className="od-modal-text"><strong>Email :</strong> {order.customer_email}</p>
          <p className="od-modal-text"><strong>Téléphone :</strong> {order.customer_phone}</p>
        </div>

        <div className="od-modal-block">
          <h3 className="od-modal-subtitle">Produits</h3>

          {order.items?.map(item => (
            <div key={item.id} className="od-product-item">
              <strong className="od-product-name">{item.product?.name}</strong>
              <div className="od-product-line">Qté : {item.quantity}</div>
              <div className="od-product-line">Prix unitaire : {formatCurrency(item.price)}</div>
              <div className="od-product-line">Total HT : {formatCurrency(item.total)}</div>
            </div>
          ))}
        </div>

        <div className="od-modal-block od-recap-block">
          <h3 className="od-modal-subtitle">Récapitulatif</h3>
          <div className="od-recap-line">Sous-total HT : {formatCurrency(subtotal)}</div>
          <div className="od-recap-line">TVA (20%) : {formatCurrency(tva)}</div>
          <div className="od-recap-line">Frais de livraison : {formatCurrency(order.shipping_fee)}</div>
          <div className="od-recap-total">
            Total TTC : {formatCurrency(totalTTC)}
          </div>
        </div>

        <div className="od-modal-block">
          <h3 className="od-modal-subtitle">Logistique</h3>
          <div className="od-modal-text">
            Statut : <StatusBadge status={order.status} />
          </div>
          <div className="od-modal-text">Livraison : {order.delivery_speed}</div>
          <div className="od-modal-text">
            Paiement : {formatPaymentMethod(order.payment_method)}
          </div>
        </div>

        <div className="od-modal-footer">
          <button
            className="od-invoice-download"
            onClick={() => onDownloadInvoice(order.id)}
          >
            Télécharger la facture
          </button>
        </div>

      </div>
    </div>
  )
}

/* ---------- Page ---------- */

export default function B2BOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    loadOrders()
  }, [status])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await api.get("/orders", {
        params: { type: "b2b", status: status || undefined },
      })
      setOrders(res.data.data || [])
    } catch {
      toast.error("Impossible de charger les commandes")
    } finally {
      setLoading(false)
    }
  }

  const downloadInvoice = async orderId => {
    try {
      const res = await api.get(`/orders/${orderId}/invoice`, {
        responseType: "blob",
      })

      const blob = new Blob([res.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `Facture_BULK_${orderId}.pdf`
      document.body.appendChild(link)
      link.click()

      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      toast.error("Téléchargement impossible")
    }
  }

  return (
    <div className="b2b-orders-root">
      <h1 className="b2b-orders-title">Mes achats</h1>

      <select
        className="b2b-orders-filter"
        value={status}
        onChange={e => setStatus(e.target.value)}
      >
        <option value="">Tous les statuts</option>
        <option value="pending">En attente</option>
        <option value="processing">En préparation</option>
        <option value="shipped">Expédiée</option>
        <option value="delivered">Livrée</option>
        <option value="cancelled">Annulée</option>
      </select>

      {loading ? (
        <p className="b2b-orders-loading">Chargement...</p>
      ) : (
        <table className="b2b-orders-table">
          <thead className="b2b-orders-thead">
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Client</th>
              <th>Total TTC</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody className="b2b-orders-tbody">
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="b2b-orders-empty">
                  Aucune commande
                </td>
              </tr>
            )}

            {orders.map(order => {
              const subtotal = Number(order.subtotal || 0)
              const tva = subtotal * 0.2
              const totalTTC = subtotal + tva + Number(order.shipping_fee || 0)

              return (
                <tr key={order.id} className="b2b-orders-row">
                  <td>{order.id}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>{order.customer_name}</td>
                  <td>{formatCurrency(totalTTC)}</td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td>
                    <button
                      className="view-order-btn"
                      onClick={() => setSelectedOrder(order)}
                      title="Voir la commande"
                    >
                      <span className="material-icons">visibility</span>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onDownloadInvoice={downloadInvoice}
      />
    </div>
  )
}
