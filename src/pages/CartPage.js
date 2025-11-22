"use client"
import "../styles/CartPage.css"
import { Link, useNavigate } from "react-router-dom"

const CartPage = ({ cart, onRemoveFromCart, onUpdateQuantity }) => {
  const navigate = useNavigate()
  const subtotal = cart.reduce((total, item) => total + item.discountPrice * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 4.9
  const total = subtotal + shipping

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1>Mon Panier</h1>
        <div className="empty-cart">
          <i className="fas fa-shopping-cart"></i>
          <p>Votre panier est vide</p>
          <Link to="/products" className="continue-shopping-btn">
            Continuer les achats
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Mon Panier ({cart.length})</h1>

      <div className="cart-container">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image || "/placeholder.svg"} alt={item.name} />

              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="brand">{item.brand}</p>
                <p className="price">{item.discountPrice.toFixed(2)} €</p>
              </div>

              <div className="quantity-control">
                <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                  −
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                  className="qty-input"
                />
                <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                  +
                </button>
              </div>

              <div className="item-total">{(item.discountPrice * item.quantity).toFixed(2)} €</div>

              <button className="remove-btn" onClick={() => onRemoveFromCart(item.id)} title="Supprimer">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Résumé de commande</h3>

          <div className="summary-line">
            <span>Sous-total</span>
            <span>{subtotal.toFixed(2)} €</span>
          </div>

          <div className="summary-line">
            <span>Livraison</span>
            <span className={shipping === 0 ? "free" : ""}>
              {shipping === 0 ? "Gratuite" : shipping.toFixed(2) + " €"}
            </span>
          </div>

          {shipping === 0 && (
            <p className="free-shipping-msg">
              <i className="fas fa-check"></i> Livraison gratuite !
            </p>
          )}

          <div className="summary-total">
            <span>Total</span>
            <span>{total.toFixed(2)} €</span>
          </div>

          <Link
            to="/checkout"
            className="checkout-btn"
            style={{ textDecoration: "none", display: "block", textAlign: "center" }}
          >
            <i className="fas fa-lock"></i>
            Procéder au paiement
          </Link>

          <Link to="/products" className="continue-shopping-link">
            Continuer les achats
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CartPage
