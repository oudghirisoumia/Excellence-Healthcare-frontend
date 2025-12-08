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
import api from "./api"  
import PaymentPage from "./pages/PaymentPage"


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

  // CHARGEMENT AU DÉMARRAGE (connecté ou pas)
  useEffect(() => {
    const loadInitialData = async () => {
      // 1. Charger depuis localStorage (toujours)
      const savedCart = localStorage.getItem('cart')
      const savedFavorites = localStorage.getItem('favorites')

      if (savedCart) setCart(JSON.parse(savedCart))
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites))

      // 2. Si connecté → synchroniser avec le backend
      if (user) {
        try {
          const [cartRes, favRes, notifRes] = await Promise.all([
            api.get('/cart').catch(() => ({ data: [] })),
            api.get('/favorites').catch(() => ({ data: [] })),
            api.get('/notifications').catch(() => ({ data: [] }))
          ])

          // Backend panier → remplace le local
          const backendCart = Array.isArray(cartRes.data) ? cartRes.data : (cartRes.data?.items || [])
          const normalizedCart = backendCart.map(item => ({
            ...item,
            product_id: item.product_id || item.product?.id,
            quantity: item.quantity || 1,
            price: parseFloat(item.prix_detail || item.product?.prix_detail || 0),
            product: item.product
          }))
          if (normalizedCart.length > 0) {
            setCart(normalizedCart)
            localStorage.setItem('cart', JSON.stringify(normalizedCart))
          }

          // Favoris backend
          const backendFavs = Array.isArray(favRes.data) ? favRes.data : (favRes.data?.data || [])
          const favIds = backendFavs.map(f => f.product_id || f.id)
          if (favIds.length > 0) {
            setFavorites(favIds)
            localStorage.setItem('favorites', JSON.stringify(favIds))
          }

          setNotifications(notifRes.data?.data || notifRes.data || [])
        } catch (err) {
          console.error("Erreur synchro backend", err)
          if (err.response?.status === 401) {
            logout()
            navigate('/auth')
          }
        }
      }

      setLoading(false)
    }

    loadInitialData()
  }, [user, logout, navigate])

  // SAUVEGARDE AUTOMATIQUE DANS localStorage
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart))
    } else {
      localStorage.removeItem('cart')
    }
  }, [cart])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  // ... tes handlers (inchangés, mais optimisés)
  const handleToggleFavorite = async (productId) => {
    const wasIn = favorites.includes(productId)
    setFavorites(prev => 
      wasIn ? prev.filter(id => id !== productId) : [...prev, productId]
    )

    if (user) {
      await api.post(`/favorites/toggle/${productId}`).catch(() => {
        // revert si erreur backend
        setFavorites(prev => wasIn ? [...prev, productId] : prev.filter(id => id !== productId))
      })
    }
  }

  const handleAddToCart = async (product) => {
    const price = parseFloat(product.prix_detail || product.price || 0)
    const existing = cart.find(i => i.product_id === product.id)

    if (existing) {
      setCart(prev => prev.map(i => 
        i.product_id === product.id 
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ))
    } else {
      setCart(prev => [...prev, {
        product_id: product.id,
        product,
        quantity: 1,
        price
      }])
    }

    if (user) {
      await api.post('/cart', { product_id: product.id, quantity: 1 }).catch(() => {})
    }
  }

  const handleRemoveFromCart = (productId) => {
    setCart(prev => prev.filter(i => i.product_id !== productId))
    if (user) api.delete(`/cart/${productId}`).catch(() => {})
  }

  const handleUpdateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) return handleRemoveFromCart(productId)
    setCart(prev => prev.map(i => 
      i.product_id === productId ? { ...i, quantity } : i
    ))
    if (user) api.put(`/cart/${productId}`, { quantity }).catch(() => {})
  }

  const handleClearCart = () => {
    setCart([])
    if (user) api.delete('/cart').catch(() => {})
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-2xl">Chargement...</div>
  }

  return (
    <>
    <Header
      cartCount={cart.reduce((sum, i) => sum + (i.quantity || 0), 0)}
      favoritesCount={Array.isArray(favorites) ? favorites.length : 0}  // ← CORRIGÉ
      notificationsCount={notifications.filter(n => !n.is_read).length}
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
          onRemoveFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
          onClose={() => setShowFavorites(false)}
        />
      )}

      <Categories />

      <main className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/products" element={<Products onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} />} />
          <Route path="/product/:id" element={<ProductPage onAddToCart={handleAddToCart} />} />
          <Route path="/category/:categoryId" element={<Products onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/cart" element={<CartPage cart={cart} onRemoveFromCart={handleRemoveFromCart} onUpdateQuantity={handleUpdateCartQuantity} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} onClearCart={handleClearCart} />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
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