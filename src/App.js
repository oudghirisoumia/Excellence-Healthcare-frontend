"use client"

import { useState, useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { LanguageProvider } from "./context/LanguageContext"
import { AuthProvider, useAuth } from "./context/AuthContext"  // We'll create this
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
import NotificationPanel from "./components/NotificationPanel"
import ProductPage from "./pages/ProductPage"
import api from "./api"  // Your axios instance


function AppContent() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [favorites, setFavorites] = useState([])
  const [cart, setCart] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [favoriteProducts, setFavoriteProducts] = useState([])

  // Load cart & favorites & notifications on login
  useEffect(() => {
    if (user) {
      loadUserData()
    } else {
      setCart([])
      setFavorites([])
      setNotifications([])
      setLoading(false)
    }
  }, [user])

  // Load favorite products when favorites modal opens
  useEffect(() => {
    if (!showFavorites || favorites.length === 0) {
      setFavoriteProducts([])
      return
    }

    const loadFavorites = async () => {
      try {
        // Try a single request with ids param if API supports it
        const res = await api.get('/products', { params: { ids: favorites.join(',') } })
        setFavoriteProducts(res.data.data || res.data)
      } catch (err) {
        // Fallback: fetch individually
        try {
          const proms = favorites.map(id => api.get(`/products/${id}`))
          const results = await Promise.all(proms)
          setFavoriteProducts(results.map(r => r.data.product || r.data))
        } catch (err2) {
          console.error('Failed to load favorite products', err2)
          setFavoriteProducts([])
        }
      }
    }

    loadFavorites()
  }, [showFavorites, favorites])

  const handleToggleFavorite = async (productId) => {
    try {
      await api.post(`/favorites/toggle/${productId}`)
      setFavorites(prev => 
        prev.includes(productId) 
          ? prev.filter(id => id !== productId)
          : [...prev, productId]
      )
    } catch (err) {
      alert("Connectez-vous pour ajouter aux favoris")
    }
  }

  const handleAddToCart = async (product) => {
    // Check if user has a token (logged in)
    const token = localStorage.getItem('token')
    
    if (!token) {
      navigate('/auth')
      return
    }

    try {
      await api.post('/cart', { product_id: product.id, quantity: 1 })
      setCart(prev => {
        const exists = prev.find(i => i.product_id === product.id)
        if (exists) {
          return prev.map(i => i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        }
        return [...prev, { product_id: product.id, product, quantity: 1 }]
      })
    } catch (err) {
      alert("Erreur lors de l'ajout au panier")
    }
  }

  const handleRemoveFromCart = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`)
      setCart(prev => prev.filter(i => i.product_id !== productId))
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateCartQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId)
      return
    }
    try {
      await api.put(`/cart/${productId}`, { quantity })
      setCart(prev => prev.map(i => i.product_id === productId ? { ...i, quantity } : i))
    } catch (err) {
      console.error(err)
    }
  }

  const handleClearCart = async () => {
    try {
      await api.delete('/cart')
      setCart([])
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>
  }

  return (
    <>
      <Header
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        favoritesCount={favorites.length}
        notificationsCount={notifications.filter(n => !n.read).length}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenFavorites={() => setShowFavorites(true)}
      />
      {showNotifications && (
        <NotificationPanel notifications={notifications} onClose={() => setShowNotifications(false)} />
      )}
      {showFavorites && (
        <FavoritesPage
          favorites={favorites}
          products={favoriteProducts}
          onRemoveFavorite={(id) => setFavorites(prev => prev.filter(i => i !== id))}
          onAddToCart={(p) => handleAddToCart(p)}
          onClose={() => setShowFavorites(false)}
        />
      )}
      
      <Categories />

      <main className="container">
        <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/products" element={<Products onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} />} />
          <Route path="/product/:id" element={<ProductPage onAddToCart={handleAddToCart} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          <Route path="/cart" element={
            <CartPage
              cart={cart}
              onRemoveFromCart={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateCartQuantity}
            />
          } />
          
          <Route path="/checkout" element={
            <CheckoutPage cart={cart} onClearCart={handleClearCart} />
          } />
          
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App