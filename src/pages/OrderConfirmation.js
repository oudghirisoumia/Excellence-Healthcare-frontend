import { useLocation, Link } from "react-router-dom"

import "../styles/OrderConfirmation.css"
import { useState, useEffect } from "react"
import api from "../api"
import "../styles/OrderConfirmation.css"

const OrderConfirmation = () => {
  const location = useLocation()
  const order = location.state?.order
  const [downloadingInvoice, setDownloadingInvoice] = useState(false)
  const [invoiceError, setInvoiceError] = useState("")

  useEffect(() => {
    if (order?.id) {
      localStorage.setItem("lastOrderId", order.id)
    }
  }, [order])

  const handleDownloadInvoice = async () => {
    if (!order?.id) {
      setInvoiceError("Numéro de commande manquant")
      return
    }

    try {
      setDownloadingInvoice(true)

      const response = await api.get(`/orders/${order.id}/invoice`, {
        responseType: "blob",
        headers: { Accept: "application/pdf" }
      })

      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `Facture_${order.order_number}.pdf`
      link.click()

      window.URL.revokeObjectURL(url)
    } catch (err) {
      setInvoiceError("Impossible de télécharger la facture")
    } finally {
      setDownloadingInvoice(false)
    }
  }

  if (!order) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-card empty-state">
          <h1>Aucune commande trouvée</h1>

          <p className="empty-text">
            Nous n’avons pas trouvé de commande à afficher.
          </p>

          <div className="confirmation-actions">
            <Link to="/products">Retour aux produits</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">

        <h1>Commande confirmée </h1>

        <p><strong>Commande :</strong> {order.order_number}</p>
        <p><strong>Total :</strong> {parseFloat(order.total).toFixed(2)} DH</p>
        <p><strong>Adresse :</strong> {order.address}</p>

        <h3>Articles commandés</h3>

        <div className="order-items-list">
          {(order.items || []).map(item => (
            <div key={item.id} className="item-line">
              <span>
                {item.product?.name || "Produit"} × {item.quantity}
              </span>
              <span>
                {(parseFloat(item.price) * item.quantity).toFixed(2)} DH
              </span>
            </div>
          ))}
        </div>

        <div className="confirmation-actions">
          <button onClick={handleDownloadInvoice} disabled={downloadingInvoice}>
            {downloadingInvoice ? "Téléchargement..." : "Télécharger la facture"}
          </button>

          <Link to="/order-tracking">Suivre ma commande</Link>
          <Link to="/products">Continuer vos achats</Link>
        </div>

        {invoiceError && <p className="error">{invoiceError}</p>}
      </div>
    </div>
  )
}

export default OrderConfirmation
