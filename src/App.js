"use client"

import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import { LanguageProvider } from "./context/LanguageContext"
import Header from "./components/Header"
import Categories from "./components/Categories"
import Home from "./pages/Home"
import Products from "./pages/Products"
import Contact from "./pages/Contact"
import CartPage from "./pages/CartPage"
import FavoritesPage from "./pages/FavoritesPage"
import Footer from "./components/Footer"
import AuthPage from "./pages/AuthPage"
import CheckoutPage from "./pages/CheckoutPage"
import OrderTrackingPage from "./pages/OrderTrackingPage"
import AdminDashboard from "./pages/AdminDashboard"
import OrderConfirmation from "./pages/OrderConfirmation"
import { PRODUCTS, NOTIFICATIONS } from "./data/products"
import NotificationPanel from "./components/NotificationPanel"

function AppContent() {
  const [favorites, setFavorites] = useState([])
  const [cart, setCart] = useState([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)

  const handleToggleFavorite = (productId) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  const handleUpdateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId)
    } else {
      setCart((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    }
  }

  const handleRemoveFavorite = (productId) => {
    setFavorites((prev) => prev.filter((id) => id !== productId))
  }

  const handleClearCart = () => {
    setCart([])
  }

  const unreadNotifications = notifications.filter((n) => !n.read).length

  return (
    <>
      <Header
        cartCount={cart.length}
        favoritesCount={favorites.length}
        notificationsCount={unreadNotifications}
        onOpenFavorites={() => setShowFavorites(true)}
        onOpenNotifications={() => setShowNotifications(true)}
      />
      <Categories />

      <main className="container">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                products={PRODUCTS}
                favorites={favorites}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
              />
            }
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/products"
            element={
              <Products
                products={PRODUCTS}
                favorites={favorites}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
              />
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                onRemoveFromCart={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateCartQuantity}
              />
            }
          />
          <Route path="/checkout" element={<CheckoutPage cart={cart} onClearCart={handleClearCart} />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {showFavorites && (
        <FavoritesPage
          favorites={favorites}
          products={PRODUCTS}
          onRemoveFavorite={handleRemoveFavorite}
          onAddToCart={handleAddToCart}
          onClose={() => setShowFavorites(false)}
        />
      )}

      {showNotifications && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAsRead={() => {}}
        />
      )}

      <Footer />
    </>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
