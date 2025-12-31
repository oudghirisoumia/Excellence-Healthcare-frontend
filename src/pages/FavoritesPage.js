import "../styles/FavoritesPage.css"

const FavoritesPage = ({ favorites, products, onRemoveFavorite, onAddToCart, onClose }) => {
  const favoriteProducts = products.filter((p) => favorites.includes(p.id))

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
            favoriteProducts.map((product) => {
              const price =
                product.discountPrice || product.prix_detail || product.price || 0

              return (
                <div key={product.id} className="favorite-item">
                  <img
                    src={product.image || product.image_principale || "/placeholder.svg"}
                    alt={product.name}
                  />
                  <div className="favorite-info">
                    <h3>{product.name}</h3>
                    <p className="brand">{product.brand}</p>
                    <p className="price">{parseFloat(price).toFixed(2)} DH</p>
                  </div>
                  <div className="favorite-actions">
                    <button
                      className="delete-btn"
                      onClick={() => onRemoveFavorite(product.id)}
                      title="Supprimer"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    <button
                      className="add-btn"
                      onClick={() => onAddToCart(product)}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              )
            })
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