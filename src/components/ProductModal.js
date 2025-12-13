import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Check, Minus, Plus, ShoppingCart, Star } from "lucide-react";

export default function ProductModal({ product }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div className="p-6">Produit introuvable</div>;
  }

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    // Ici tu peux appeler ton handler global ou local pour ajouter au panier
    console.log(`Ajouter au panier: ${product.name}, quantité: ${quantity}`);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Bouton retour */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <X className="w-5 h-5" /> Retour
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="md:w-1/2 bg-[#F9F9F9] p-6 flex items-center justify-center rounded-lg relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto max-h-[400px] object-contain"
          />
          {product.discount > 0 && (
            <span className="absolute top-4 right-4 bg-[#FF3B30] text-white font-bold px-3 py-1.5 rounded-lg shadow-sm">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Détails */}
        <div className="md:w-1/2 flex flex-col">
          <span className="inline-block px-3 py-1 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full mb-4">
            {product.brand}
          </span>

          <h1 className="text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4].map((star) => (
                <Star key={star} className="w-5 h-5 fill-current" />
              ))}
              <div className="relative">
                <Star className="w-5 h-5 text-gray-200 fill-gray-200" />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star className="w-5 h-5 text-amber-400 fill-current" />
                </div>
              </div>
            </div>
            <span className="text-gray-600 font-medium">
              {product.rating} <span className="text-gray-400 font-normal">({product.reviews} avis)</span>
            </span>
          </div>

          {/* Prix */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-emerald-600">{product.discountPrice.toFixed(2)} €</span>
            {product.discount > 0 && (
              <span className="text-xl text-gray-400 line-through">{product.price.toFixed(2)} €</span>
            )}
          </div>

          {/* Stock */}
          {product.price > 0 && (
            <div className="flex items-center gap-2 text-emerald-600 mb-6 pb-6 border-b border-gray-100">
              <Check className="w-5 h-5" />
              <span className="font-medium">En stock - Livraison rapide</span>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description || "Pas de description disponible."}</p>
          </div>

          {/* Caractéristiques / tags */}
          {product.tags && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Caractéristiques</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium min-w-[80px]">Quantité:</span>
              <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-medium text-gray-900">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} className="p-2 hover:bg-gray-50 text-gray-600">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-[#0088CC] hover:bg-[#0077B3] text-white font-bold py-3.5 px-6 rounded-lg shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Ajouter au panier - {(product.discountPrice * quantity).toFixed(2)} €</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
