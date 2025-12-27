import { useLocation, Link } from "react-router-dom"
import "../styles/OrderConfirmation.css"
import { useState } from "react"
import api from "../api"

const OrderConfirmation = () => {
  const location = useLocation()
  const order = location.state?.order

  const [downloadingInvoice, setDownloadingInvoice] = useState(false)
  const [invoiceError, setInvoiceError] = useState("")

  const handleDownloadInvoice = async () => {
    if (!order?.id) {
      setInvoiceError("Numéro de commande manquant")
      return
    }

    setDownloadingInvoice(true)
    setInvoiceError("")

    try {
      // Call your backend endpoint to download the invoice
      const response = await api.get(`/orders/${order.id}/invoice`, {
        responseType: "blob",
        headers: {
          Accept: "application/pdf"
        }
      })

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Facture_${order.order_number || order.id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Erreur lors du téléchargement de la facture:", err)
      setInvoiceError("Impossible de télécharger la facture. Veuillez réessayer.")
    } finally {
      setDownloadingInvoice(false)
    }
  }

  if (!order) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-content">
          <p>Aucune commande trouvée</p>
          <Link to="/products">Retour aux produits</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="confirmation-header">
          <i className="fas fa-check-circle"></i>
          <h1>Commande confirmée !</h1>
          <p>Merci pour votre achat</p>
        </div>

        <div className="confirmation-details">
          <div className="detail-section">
            <h3>Numéro de commande</h3>
            <p className="order-id">{order.order_number || order.id}</p>
          </div>

          <div className="detail-section">
            <h3>Numéro de suivi</h3>
            <p className="tracking-number">
              {order.trackingNumber || order.tracking_number || "À venir"}
            </p>
          </div>

          <div className="detail-section">
            <h3>Montant total</h3>
            <p className="total-amount">
              {(parseFloat(order.total || order.calculated_total || 0)).toFixed(2)} DH
            </p>
          </div>

          <div className="detail-section">
            <h3>Adresse de livraison</h3>
            <p>
              {order.deliveryAddress || 
               `${order.address || ''} ${order.city || ''}`}
            </p>
          </div>

          <div className="detail-section">
            <h3>Récapitulatif du panier</h3>
            <div className="order-items-list">
              {(order.items || []).map((item, idx) => {
                const itemName = item.name || item.product?.name || item.product_name || "Produit";
                const itemPrice = parseFloat(
                  item.price || 
                  item.product?.prix_detail || 
                  item.prix_detail || 
                  0
                );
                const itemQty = item.quantity || 1;
                const itemTotal = (itemPrice * itemQty).toFixed(2);

                return (
                  <div key={item.id || item.product_id || idx} className="item-line">
                    <span className="item-info">
                      {itemName} × {itemQty}
                    </span>
                    <span className="item-price">{itemTotal} DH</span>
                  </div>
                );
              })}
            </div>
            
            {/* Show breakdown if available */}
            {(order.subtotal || order.shipping_fee) && (
              <div className="order-breakdown">
                <div className="breakdown-line">
                  <span>Sous-total</span>
                  <span>{parseFloat(order.subtotal || 0).toFixed(2)} DH</span>
                </div>
                <div className="breakdown-line">
                  <span>Frais de livraison</span>
                  <span>{parseFloat(order.shipping_fee || 0).toFixed(2)} DH</span>
                </div>
                <div className="breakdown-total">
                  <span>Total</span>
                  <span>{(parseFloat(order.total || 0)).toFixed(2)} DH</span>
                </div>
              </div>
            )}
          </div>

          <div className="confirmation-message">
            <i className="fas fa-envelope"></i>
            <p>Un email de confirmation a été envoyé à votre adresse</p>
          </div>
        </div>

        <div className="confirmation-actions">
          <button
            className="download-invoice-btn"
            onClick={handleDownloadInvoice}
            disabled={downloadingInvoice}
          >
            <i className="fas fa-file-pdf"></i>
            {downloadingInvoice ? "Téléchargement..." : "Télécharger la facture"}
          </button>
          <Link to="/order-tracking" className="track-btn">
            <i className="fas fa-map-marker-alt"></i> Suivre ma commande
          </Link>
          <Link to="/products" className="continue-btn">
            Continuer vos achats
          </Link>
        </div>
        {invoiceError && (
          <div className="invoice-error">
            <i className="fas fa-exclamation-circle"></i>
            <span>{invoiceError}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderConfirmation