import PropTypes from "prop-types"
import ProductGrid from "../components/ProductGrid"
import "../styles/ProductGrid.css"

function Products({ products, favorites, onAddToCart, onToggleFavorite }) {
  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Tous les Produits</h1>
        <p>Découvrez notre gamme complète de produits de parapharmcie</p>
      </div>
      <ProductGrid
        products={products}
        favorites={favorites}
        onAddToCart={onAddToCart}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  )
}

Products.propTypes = {
  products: PropTypes.array.isRequired,
  favorites: PropTypes.array.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
}

export default Products
