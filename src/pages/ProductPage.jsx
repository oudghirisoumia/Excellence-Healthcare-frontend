import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductModal from "../components/ProductModal";
import api from "../api";

export default function ProductPage({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product || res.data);
      } catch (err) {
        console.error("Produit non trouvé", err);
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-[#5C96B3]">Chargement du produit...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-red-600">
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