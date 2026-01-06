import { createContext, useState, useEffect } from "react";
import api from "../api";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Load cart from backend
  const fetchCart = async () => {
    const res = await api.get("/cart");
    setCartItems(res.data.cartItems);
    setTotal(res.data.total);
    setTotalItems(res.data.totalItems);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Add to cart
  const addToCart = async ({ product_id, quantity = 1 }) => {
    await api.post("/cart", { product_id, quantity });
    await fetchCart();
  };

  // Update quantity
  const updateQuantity = async (cartItemId, quantity) => {
    await api.put(`/cart/${cartItemId}`, { quantity });
    await fetchCart();
  };

  // Remove item
  const removeFromCart = async (cartItemId) => {
    await api.delete(`/cart/${cartItemId}`);
    await fetchCart();
  };

  // Clear cart
  const clearCart = async () => {
    await api.delete("/cart/clear");
    await fetchCart();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        totalItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}