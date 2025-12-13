import { createContext, useState } from "react";

// 1️⃣ Crée le contexte
export const CartContext = createContext();

// 2️⃣ Crée le provider
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Ajouter un produit au panier
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  // Supprimer un produit du panier par ID
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Vider le panier
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
