
import "../styles/FavoritesPage.css"
import api from "../api"

const FavoritesPage = ({ favorites, products, onRemoveFavorite, onAddToCart, onClose }) => {
  const favoriteProducts = products.filter((p) => favorites.includes(p.id))

  const buildImageUrl = (path) => {
    if (!path) return "/placeholder.svg"
    try {
      const base = api.defaults.baseURL || ''
      const host = base.replace(/\/api\/?$/, '')
      if (path.startsWith('http')) return path
      if (path.startsWith('/')) return host + path
      return host + '/' + path
    } catch (err) {
      return path
    }
  }

  const handleAddAllToCart = () => {
    favoriteProducts.forEach((product) => {
      onAddToCart(product)
    })
  }

  return (
    <div className="favorites-modal-overlay" onClick={onClose}>
      <div className="favorites-modal" onClick={(e) => e.stopPropagation()}>
        <div className="favorites-header">
          <h2>
            <i className="fas fa-heart"></i> Mes Favoris ({favoriteProducts.length})
          </h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="favorites-list">
          {favoriteProducts.length > 0 ? (
            favoriteProducts.map((product) => (
              <div key={product.id} className="favorite-item">
                <img src={buildImageUrl(product.image_principale || product.image || product.image_principale)} alt={product.name} />
                <div className="favorite-info">
                  <h3>{product.name}</h3>
                  <p className="brand">{product.brand}</p>
                  {
                    (() => {
                      const price = parseFloat(product.prix_detail || product.prix || product.price || product.prix_original || 0)
                      return <p className="price">{price.toFixed(2)} DH</p>
                    })()
                  }
                </div>
                <div className="favorite-actions">
                  <button className="delete-btn" onClick={() => onRemoveFavorite(product.id)} title="Supprimer">
                    <i className="fas fa-trash"></i>
                  </button>
                  <button
                    className="add-btn"
                    onClick={() => {
                      onAddToCart(product)
                    }}
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-message">Aucun produit en favoris</p>
          )}
        </div>

        <div className="favorites-footer">
          <p>
            Total des favoris:{" "}
            <strong>
              {favoriteProducts.length} produit{favoriteProducts.length > 1 ? "s" : ""}
            </strong>
          </p>
          {favoriteProducts.length > 0 && (
            <button className="add-all-btn" onClick={handleAddAllToCart}>
              <i className="fas fa-shopping-cart"></i>
              Tout ajouter au panier
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FavoritesPage
