import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import api from "../api";
import "../styles/ProductGrid.css"

export default function Home({ onAddToCart, onToggleFavorite }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data.data);
      } catch (err) {
        console.error("Erreur chargement produits", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-3xl font-bold text-[#5C96B3]">Chargement des produits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 px-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-[#5C96B3] mb-4">
          Excellence Healthcare
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8">
          Votre parapharmacie en ligne de confiance au Maroc
        </p>
        <div className="w-32 h-1 bg-[#5C96B3] mx-auto rounded-full"></div>
      </div>

      {/* Produits en vedette */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Nos produits phares
        </h2>

        {products.length === 0 ? (
          <p className="text-center text-gray-500 text-xl py-20">
            Aucun produit disponible pour le moment
          </p>
        ) : (
          <div className="product-grid-container">
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={false} // Tu peux améliorer avec un check plus tard
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Final */}
      <div className="text-center mt-16">
        <p className="text-lg text-gray-600 mb-6">
          Plus de 500 produits disponibles • Livraison partout au Maroc
        </p>
        <button
          onClick={() => window.location.href = "/products"}
          className="bg-[#5C96B3] hover:bg-[#4a7a94] text-white text-xl px-12 py-5 rounded-full font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Voir tous les produits
        </button>
      </div>
    </div>
  );
}