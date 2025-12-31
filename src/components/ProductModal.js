import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductModal({ product, onAddToCart }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div className="p-6">Produit introuvable</div>;
  }

  const price = Number(product.prix_detail) || 0;
  const discount = Number(product.discount) || 0;

  const finalPrice =
    discount > 0 ? price - (price * discount) / 100 : price;

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      id: product.id,
      quantity,
    });

    toast.success(
      `${product.name} ajouté au panier (x${quantity})`,
      {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      }
    );
  };

  return (
    <div className="container mx-auto p-6">
      {/* Retour */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        Retour
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="md:w-1/2 bg-[#F9F9F9] p-6 flex items-center justify-center rounded-lg relative">
          <img
            src={product.image_principale}
            alt={product.name}
            className="w-full h-auto max-h-[400px] object-contain"
          />

          {discount > 0 && (
            <span className="absolute top-4 right-4 bg-[#FF3B30] text-white font-bold px-3 py-1.5 rounded-lg">
              -{discount}%
            </span>
          )}
        </div>

        {/* Details */}
        <div className="md:w-1/2 flex flex-col">
          <span className="inline-block px-3 py-1 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-full mb-4">
            {product.brand}
          </span>

          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-emerald-600">
              {finalPrice.toFixed(2)} DH
            </span>

            {discount > 0 && (
              <span className="text-xl text-gray-400 line-through">
                {price.toFixed(2)} DH
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 text-emerald-600 mb-6 border-b pb-6">
            <Check className="w-5 h-5" />
            <span>En stock - Livraison rapide</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            {product.description || "Pas de description disponible."}
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-medium">Quantité:</span>
            <div className="flex items-center border rounded-lg">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-2"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4">{quantity}</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                className="p-2"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#0088CC] hover:bg-[#0077B3] text-white font-bold py-3 rounded-lg flex justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Ajouter au panier – {(finalPrice * quantity).toFixed(2)} DH
          </button>
        </div>
      </div>
    </div>
  );
}
