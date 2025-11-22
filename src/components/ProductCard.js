"use client"
import "../styles/ProductCard.css"

const ProductCard = ({ product, onAddToCart, onToggleFavorite, isFavorite }) => {
  const handleAddClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product && product.id) {
      onAddToCart(product)
    }
  }

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product && product.id) {
      onToggleFavorite(product.id)
    }
  }

  if (!product) return null

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-image" />

        {/* Favorite Button */}
        <button
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
          onClick={handleFavoriteClick}
          aria-label="Add to favorites"
          type="button"
        >
          <i className="fas fa-heart"></i>
        </button>

        {/* Discount Badge */}
        {product.discount > 0 && <div className="discount-badge">-{product.discount}%</div>}
      </div>

      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>

        {/* Rating */}
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <i key={i} className={`fas fa-star ${i < Math.floor(product.rating) ? "filled" : ""}`}></i>
            ))}
          </div>
          <span className="rating-text">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Pricing */}
        <div className="product-pricing">
          {product.price > 0 && <span className="original-price">{product.price.toFixed(2)} €</span>}
          <span className="discount-price">{product.discountPrice.toFixed(2)} €</span>
        </div>

        {/* Add to Cart Button */}
        <button className="add-to-cart-btn" onClick={handleAddClick} type="button">
          <i className="fas fa-shopping-cart"></i>
          Ajouter au panier
        </button>
      </div>
    </div>
  )
}

export default ProductCard
                                                                                                                                                                                                                                                                                                                                                                                             