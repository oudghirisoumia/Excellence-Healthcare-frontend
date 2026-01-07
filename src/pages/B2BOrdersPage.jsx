"use client"
import React, { useEffect, useState } from "react"
import api from "../api"
import { toast } from "react-toastify"
import "../styles/B2BOrdersPage.css"

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

function StatusBadge({ status }) {
  if (!status) return <span className="status-badge empty">—</span>
  return <span className={`status-badge ${status}`}>{status}</span>
}

function formatPaymentMethod(method) {
  return method === "stripe"
    ? "Carte bancaire"
    : "Paiement à la livraison"
}

function OrderDetailsModal({ order, onClose, onDownloadInvoice }) {
  if (!order) return null

  const subtotal = Number(order.subtotal || 0)
  const tva = subtotal * 0.2
  const totalTTC = subtotal + tva + Number(order.shipping_fee || 0)

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h2 className="modal-title">Commande #{order.id}</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-section">
          <h3 className="modal-section-title">Client</h3>
          <p className="modal-line"><strong>Nom :</strong> {order.customer_name}</p>
          <p className="modal-line"><strong>Email :</strong> {order.customer_email}</p>
          <p className="modal-line"><strong>Téléphone :</strong> {order.customer_phone}</p>
        </div>

        <div className="modal-section">
          <h3 className="modal-section-title">Produits</h3>

          {order.items?.map(item => (
            <div key={item.id} className="modal-product">
              <strong className="modal-product-name">{item.product?.name}</strong>
              <div className="modal-product-line">Qté : {item.quantity}</div>
              <div className="modal-product-line">Prix unitaire : {formatCurrency(item.price)}</div>
              <div className="modal-product-line">Total HT : {formatCurrency(item.total)}</div>
            </div>
          ))}
        </div>

        <div className="modal-section recap-section">
          <h3 className="modal-section-title">Récapitulatif</h3>
          <div className="recap-line">Sous-total HT : {formatCurrency(subtotal)}</div>
          <div className="recap-line">TVA (20%) : {formatCurrency(tva)}</div>
          <div className="recap-line">Frais de livraison : {formatCurrency(order.shipping_fee)}</div>
          <div className="recap-total">
            <strong>Total TTC : {formatCurrency(totalTTC)}</strong>
          </div>
        </div>

        <div className="modal-section">
          <h3 className="modal-section-title">Logistique</h3>
          <div className="modal-line">
            Statut : <StatusBadge status={order.status} />
          </div>
          <div className="modal-line">Livraison : {order.delivery_speed}</div>
          <div className="modal-line">Paiement : {formatPaymentMethod(order.payment_method)}</div>
        </div>

        <div className="modal-footer">
          <button
            className="download-invoice-btn"
            onClick={() => onDownloadInvoice(order.id)}
          >
            Télécharger la facture
          </button>
        </div>

      </div>
    </div>
  )
}

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
    } catch (err) {
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
      link.setAttribute("download", `Facture_BULK_${orderId}.pdf`)
      document.body.appendChild(link)
      link.click()

      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      toast.error("Téléchargement impossible")
    }
  }

  return (
    <div className="b2b-orders-page">
      <h1 className="page-title">Mes achats</h1>

      <select
        className="status-filter"
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
        <p className="loading-text">Chargement...</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Client</th>
              <th>Total TTC</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-state">
                  Aucune commande
                </td>
              </tr>
            )}

            {orders.map(order => {
              const subtotal = Number(order.subtotal || 0)
              const tva = subtotal * 0.2
              const totalTTC = subtotal + tva + Number(order.shipping_fee || 0)

              return (
                <tr key={order.id} className="order-row">
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
