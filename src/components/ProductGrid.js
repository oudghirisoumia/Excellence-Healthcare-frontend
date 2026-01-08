import ProductCard from "./ProductCard"
import "../styles/ProductGrid.css"

const ProductGrid = ({ products, favorites, onAddToCart, onToggleFavorite }) => {
  return (
    <div className="product-grid-container">
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favorites.includes(product.id)}
            onAddToCart={onAddToCart}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductGrid