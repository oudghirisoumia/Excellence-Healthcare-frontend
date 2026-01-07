"use client"
import "../styles/CartPage.css"
import { Link, useNavigate } from "react-router-dom"

const CartPage = ({ cart, onRemoveFromCart, onUpdateQuantity }) => {
  const navigate = useNavigate()

  const normalizedCart = cart.map(item => ({
    cartItemId: item.id,
    productId: item.product_id,
    name: item.product?.name ?? "Produit",
    brand: item.product?.brand ?? "",
    image: item.product?.image_principale ?? "/placeholder.svg",
    price: Number(
      item.unit_price ??
      item.product?.final_price ??
      item.product?.price ??
      0
    ),
    quantity: item.quantity
  }))


  const subtotal = normalizedCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  if (normalizedCart.length === 0) {
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
      <h1>Mon Panier ({normalizedCart.length})</h1>

      <div className="cart-container">
        <div className="cart-items">
          {normalizedCart.map(item => (
            <div key={item.cartItemId} className="cart-item">
              <img src={item.image} alt={item.name} />

              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="brand">{item.brand}</p>
                <p className="price">{item.price.toFixed(2)} DH</p>
              </div>

              <div className="quantity-control">
                <button
                  className="qty-btn"
                  onClick={() =>
                    item.quantity > 1 &&
                    onUpdateQuantity(item.cartItemId, item.quantity - 1)
                  }
                >
                  −
                </button>

                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  className="qty-input"
                  onChange={e => {
                    const qty = Math.max(1, Number(e.target.value))
                    onUpdateQuantity(item.cartItemId, qty)
                  }}
                />

                <button
                  className="qty-btn"
                  onClick={() =>
                    onUpdateQuantity(item.cartItemId, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              <div className="item-total">
                {(item.price * item.quantity).toFixed(2)} DH
              </div>

              <button
                className="remove-btn"
                onClick={() => onRemoveFromCart(item.cartItemId)}
                title="Supprimer"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Résumé de commande</h3>

          <div className="summary-line">
            <span>Sous-total (HT)</span>
            <span>{subtotal.toFixed(2)} DH</span>
          </div>

          {/* TVA & Livraison handled by backend */}
          <div className="summary-line info">
            TVA et frais de livraison calculés à l’étape suivante
          </div>

          <div className="summary-total">
            <span>Total estimé</span>
            <span>{subtotal.toFixed(2)} DH</span>
          </div>

          <Link to="/checkout" className="checkout-btn">
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