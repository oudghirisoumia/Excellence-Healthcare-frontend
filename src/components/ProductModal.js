import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ProductModal.css";

export default function ProductModal({ product, onAddToCart }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div className="product-modal__empty">Produit introuvable</div>;
  }

  const price = Number(product.price) || 0;
  const finalPrice = Number(product.final_price) || price;
  const hasPromotion = finalPrice < price;

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    onAddToCart({
      product_id: product.id,
      quantity,
    });

    toast.success(`${product.name} ajouté au panier (x${quantity})`, {
      position: "top-right",
      autoClose: 3000,
      theme: "light",
    });
  };

  return (
    <div className="product-modal">
      <button onClick={() => navigate(-1)} className="product-modal__back">
        <ArrowLeft size={18} />
        Retour
      </button>

      <div className="product-modal__content">
        <div className="product-modal__image-card">
          <img
            src={product.image_principale}
            alt={product.name}
            className="product-modal__image"
          />

          {hasPromotion && (
            <span className="product-modal__discount">
              -{product.pourcentage_promo}%
            </span>
          )}
        </div>

        <div className="product-modal__details">
          <span className="product-modal__brand">{product.brand}</span>

          <h1 className="product-modal__title">{product.name}</h1>

          <div className="product-modal__price">
            <span className="product-modal__price-final">
              {finalPrice.toFixed(2)} DH
            </span>

            {hasPromotion && (
              <span className="product-modal__price-old">
                {price.toFixed(2)} DH
              </span>
            )}
          </div>

          <div className="product-modal__stock">
            <Check size={18} />
            <span>En stock - Livraison rapide</span>
          </div>

          <p className="product-modal__description">
            {product.description || "Pas de description disponible."}
          </p>

          <div className="product-modal__quantity">
            <span>Quantité:</span>
            <div className="product-modal__quantity-box">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>

              <span>{quantity}</span>

              <button onClick={() => handleQuantityChange(1)}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          <button onClick={handleAddToCart} className="product-modal__add-to-cart">
            <ShoppingCart size={20} />
            Ajouter au panier – {(finalPrice * quantity).toFixed(2)} DH
          </button>
        </div>
      </div>
    </div>
  );
}
