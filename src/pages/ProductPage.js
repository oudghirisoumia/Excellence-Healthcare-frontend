import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import ProductModal from "../components/ProductModal";

export default function ProductPage({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Trouver le produit dans les données mock (ou plus tard via API)
  const product = PRODUCTS.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-600">
        Produit introuvable
      </div>
    );
  }

  return (
    <ProductModal
      product={product}
      isOpen={true}
      onClose={() => navigate(-1)}
      onAddToCart={onAddToCart}
    />
  );
}