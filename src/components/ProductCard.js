import { Link } from "react-router-dom";
import "../styles/ProductCard.css"; // keep your CSS or use Tailwind

const ProductCard = ({ product, onAddToCart, onToggleFavorite, isFavorite = false }) => {
  if (!product) return null;

  // Calculate real discounted price
  const originalPrice = parseFloat(product.prix_detail);
  const discountPercent = product.promotion ? parseFloat(product.pourcentage_promo) : 0;
  const discountedPrice = discountPercent > 0 
    ? (originalPrice * (1 - discountPercent / 100)).toFixed(2)
    : null;

  const isLowStock = product.stock > 0 && product.stock <= product.seuil_alerte;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(product.id);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/product/${product.id}`}>
          {product.image_principale ? (
            <img 
              src={product.image_principale} 
              alt={product.name} 
              className="product-image" 
            />
          ) : (
            <div className="image-placeholder">
              <span>No image</span>
            </div>
          )}
        </Link>

        {/* Favorite Heart */}
        <button
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
          onClick={handleFavorite}
          aria-label="Favoris"
        >
          <i className={`fas fa-heart ${isFavorite ? "filled" : ""}`}></i>
        </button>

        {/* Promotion Badge */}
        {product.promotion && (
          <div className="discount-badge">
            -{discountPercent}%
          </div>
        )}

        {/* Stock Alert */}
        {isLowStock && (
          <div className="stock-alert">
            Plus que {product.stock} !
          </div>
        )}
        {isOutOfStock && (
          <div className="out-of-stock-badge">
            Rupture
          </div>
        )}
      </div>

      <div className="product-info">
        {/* Brand + Reference */}
        <p className="product-brand">
          {product.brand} • {product.reference}
        </p>

        {/* Name */}
        <h3 className="product-name">
          <Link to={`/product/${product.id}`}>
            {product.name}
          </Link>
        </h3>

        {/* Description */}
        <p className="product-description">{product.description}</p>

        {/* Price */}
        <div className="product-pricing">
          {discountedPrice ? (
            <>
              <span className="discount-price">{discountedPrice} DH</span>
              <span className="original-price">{originalPrice.toFixed(2)} DH</span>
            </>
          ) : (
            <span className="current-price">{originalPrice.toFixed(2)} DH</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          className={`add-to-cart-btn ${isOutOfStock ? "disabled" : ""}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          <i className="fas fa-shopping-cart"></i>
          {isOutOfStock ? "Rupture" : "Ajouter au panier"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;