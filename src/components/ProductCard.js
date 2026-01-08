import { Link } from "react-router-dom";
import "../styles/ProductCard.css";

const ProductCard = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}) => {
  if (!product) return null;

  const isLowStock =
    product.stock > 0 && product.stock <= product.seuil_alerte;
  const isOutOfStock = product.stock <= 0;

  const price = Number(product.price) || 0;
  const finalPrice = Number(product.final_price) || price;

  const hasPromotion =
    product.promotion && finalPrice < price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(Number(product.id));
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

        <button
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
          onClick={handleFavorite}
        >
          <i className="fas fa-heart"></i>
        </button>

        {hasPromotion && (
          <div className="discount-badge">
            -{product.pourcentage_promo}%
          </div>
        )}

        {isLowStock && (
          <div className="stock-alert">
            Only {product.stock} left!
          </div>
        )}
        {isOutOfStock && (
          <div className="out-of-stock-badge">Out of stock</div>
        )}
      </div>

      <div className="product-info">
        <p className="product-brand">
          {product.brand} • {product.reference}
        </p>

        <h3 className="product-name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        <p className="product-description">{product.description}</p>

        <div className="product-pricing">
          {hasPromotion ? (
            <>
              <span className="discount-price">
                {finalPrice.toFixed(2)} DH
              </span>
              <span className="original-price">
                {price.toFixed(2)} DH
              </span>
            </>
          ) : (
            <span className="current-price">
              {price.toFixed(2)} DH
            </span>
          )}
        </div>

        <button
          className={`add-to-cart-btn ${isOutOfStock ? "disabled" : ""}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          <i className="fas fa-shopping-cart"></i>
          {isOutOfStock ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
