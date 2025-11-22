import { useLocation, Link } from "react-router-dom"
import "../styles/OrderConfirmation.css"

const OrderConfirmation = () => {
  const location = useLocation()
  const order = location.state?.order

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
            <p className="order-id">{order.id}</p>
          </div>

          <div className="detail-section">
            <h3>Numéro de suivi</h3>
            <p className="tracking-number">{order.trackingNumber}</p>
          </div>

          <div className="detail-section">
            <h3>Montant total</h3>
            <p className="total-amount">{order.total.toFixed(2)} €</p>
          </div>

          <div className="detail-section">
            <h3>Adresse de livraison</h3>
            <p>{order.deliveryAddress}</p>
          </div>

          <div className="detail-section">
            <h3>Articles commandés</h3>
            <div className="order-items-list">
              {order.items.map((item) => (
                <div key={item.id} className="item-line">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>{(item.discountPrice * item.quantity).toFixed(2)} €</span>
                </div>
              ))}
            </div>
          </div>

          <div className="confirmation-message">
            <i className="fas fa-envelope"></i>
            <p>Un email de confirmation a été envoyé à votre adresse</p>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/order-tracking" className="track-btn">
            <i className="fas fa-map-marker-alt"></i> Suivre ma commande
          </Link>
          <Link to="/products" className="continue-btn">
            Continuer vos achats
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
