"use client"
import "../styles/CartPage.css"
import { Link, useNavigate } from "react-router-dom"

const CartPage = ({ cart, onRemoveFromCart, onUpdateQuantity }) => {
  const navigate = useNavigate()
  
  // Handle different cart item structures and normalize numeric fields
  const normalizedCart = cart.map(item => {
    const priceNum = parseFloat(item.discountPrice || item.price || item.product?.discountPrice || item.product?.prix_detail || 0)
    const qtyNum = parseInt(item.quantity || item.qty || 1, 10) || 1
    return {
      ...item,
      priceNum: Number.isFinite(priceNum) ? priceNum : 0,
      qtyNum,
      price: item.discountPrice || item.product?.discountPrice || item.product?.prix_detail || 0,
      name: item.name || item.product?.name || 'Unknown',
      brand: item.brand || item.product?.brand || '',
      image: item.image || item.product?.image_principale || '/placeholder.svg',
      itemId: item.id || item.product_id
    }
  })

  const subtotal = normalizedCart.reduce((total, item) => total + (item.priceNum || 0) * (item.qtyNum || 1), 0)
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
          {normalizedCart.map((item) => (
            <div key={item.itemId} className="cart-item">
              <img src={item.image} alt={item.name} />

              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="brand">{item.brand}</p>
                <p className="price">{parseFloat(item.price).toFixed(2)} DH</p>
              </div>

              <div className="quantity-control">
                <button className="qty-btn" onClick={() => onUpdateQuantity(item.itemId, item.quantity - 1)}>
                  −
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.itemId, Number.parseInt(e.target.value) || 1)}
                  className="qty-input"
                />
                <button className="qty-btn" onClick={() => onUpdateQuantity(item.itemId, item.quantity + 1)}>
                  +
                </button>
              </div>

              <div className="item-total">{(parseFloat(item.price) * item.quantity).toFixed(2)} DH</div>

              <button className="remove-btn" onClick={() => onRemoveFromCart(item.itemId)} title="Supprimer">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Résumé de commande</h3>

          <div className="summary-line">
            <span>Sous-total</span>
            <span>{subtotal.toFixed(2)} DH</span>
          </div>

          <div className="summary-line">
            <span>Livraison</span>
            <span className={shipping === 0 ? "free" : ""}>
              {shipping === 0 ? "Gratuite" : shipping.toFixed(2) + " DH"}
            </span>
          </div>

          {shipping === 0 && (
            <p className="free-shipping-msg">
              <i className="fas fa-check"></i> Livraison gratuite !
            </p>
          )}

          <div className="summary-total">
            <span>Total</span>
            <span>{total.toFixed(2)} DH</span>
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
