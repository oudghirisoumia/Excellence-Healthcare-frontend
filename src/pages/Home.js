"use client"
import { useState } from "react"
import ProductCard from "../components/ProductCard"
import "../styles/Home.css"

export default function Home({ products, favorites, onAddToCart, onToggleFavorite }) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleDiscoverClick = () => {
    window.scrollTo({ top: document.querySelector(".products-section").offsetTop, behavior: "smooth" })
  }

  return (
    <div className="home-page">

      {/* Products Section */}
      <section className="products-section">
        <h2>Tous nos produits</h2>
        <div className="product-grid">
          {products && products.length > 0 ? (
            products
              .slice(0, 4)
              .map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favorites.includes(product.id)}
                />
              ))
          ) : (
            <p>Aucun produit disponible</p>
          )}
        </div>
      </section>
    </div>
  )
}
