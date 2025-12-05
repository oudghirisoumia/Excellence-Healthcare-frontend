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

  const loadUserData = async () => {
    try {
      const [cartRes, favRes, notifRes] = await Promise.all([
        api.get('/cart'),
        api.get('/favorites'),
        api.get('/notifications')
      ])

      // Normalize cart response
      const cartItems = Array.isArray(cartRes.data) ? cartRes.data : (cartRes.data?.items || cartRes.data?.data || [])
      const normalizedCart = cartItems.map(item => {
        const quantity = item.quantity || item.qty || 1
        const product = item.product || item.product_data || (item.product_id ? { id: item.product_id, name: item.name } : undefined)
        const price = parseFloat(item.discountPrice || item.prix_detail || item.price || product?.prix_detail || product?.price || 0) || 0
        return { ...item, quantity, product, prix_detail: price, discountPrice: price }
      })
      setCart(normalizedCart)

      // Normalize favorites
      const favArray = Array.isArray(favRes.data) ? favRes.data : (favRes.data?.data || favRes.data?.favorites || [])
      const favIds = favArray.map(f => typeof f === 'object' ? (f.product_id || f.id) : f)
      setFavorites(favIds)

      setNotifications(notifRes.data?.data || notifRes.data || [])
    } catch (err) {
      console.error('Failed to load user data', err, err.response?.data)
      if (err.response?.status === 401) {
        logout()
        navigate('/auth')
      }
    } finally {
      setLoading(false)
    }
  }

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
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/auth')
      return
    }

    // Optimistic update
    let reverted = false
    setFavorites(prev => {
      const next = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
      return next
    })

    try {
      await api.post(`/favorites/toggle/${productId}`)
    } catch (err) {
      // revert
      setFavorites(prev => {
        reverted = true
        return prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
      })
      if (!reverted) alert("Erreur lors de la mise à jour des favoris")
    }
  }

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/auth')
      return
    }

    // Optimistic update: update cart immediately
    const prevCart = [...cart]
    const price = parseFloat(product.prix_detail || product.prix || product.price || 0) || 0
    const existing = cart.find(i => i.product_id === product.id)
    if (existing) {
      setCart(prev => prev.map(i => i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
    } else {
      setCart(prev => [...prev, {
        product_id: product.id,
        id: product.id,
        product,
        quantity: 1,
        name: product.name,
        prix_detail: price,
        discountPrice: price
      }])
    }

    try {
      const res = await api.post('/cart', { product_id: product.id, quantity: 1 })
      // If server returns the created cart item (with its own id), replace the optimistic entry
      const created = res.data?.item || res.data
      if (created && created.id) {
        setCart(prev => prev.map(i => (i.product_id === product.id && !i.id) ? { ...i, ...created } : i))
      }
    } catch (err) {
      // revert on error
      setCart(prevCart)
      alert('Erreur lors de l\'ajout au panier')
    }
  }

  const handleRemoveFromCart = async (productIdOrCartId) => {
    const prevCart = [...cart]
    // Optimistically remove
    setCart(prev => prev.filter(i => (i.id || i.product_id) !== productIdOrCartId))

    // Resolve the actual cart entry id expected by the API
    const entry = prevCart.find(i => i.id === productIdOrCartId || i.product_id === productIdOrCartId)
    const apiId = entry?.id ?? productIdOrCartId

    try {
      await api.delete(`/cart/${apiId}`)
    } catch (err) {
      setCart(prevCart)
      console.error(err)
      alert('Erreur lors de la suppression du produit')
    }
  }

  const handleUpdateCartQuantity = async (productIdOrCartId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productIdOrCartId)
      return
    }
    const prevCart = [...cart]
    // Optimistic update
    setCart(prev => prev.map(i => ((i.id === productIdOrCartId) || (i.product_id === productIdOrCartId)) ? { ...i, quantity } : i))

    // Resolve API id
    const entry = prevCart.find(i => i.id === productIdOrCartId || i.product_id === productIdOrCartId)
    const apiId = entry?.id ?? productIdOrCartId

    try {
      await api.put(`/cart/${apiId}`, { quantity })
    } catch (err) {
      setCart(prevCart)
      console.error(err)
      alert('Erreur lors de la mise à jour de la quantité')
    }
  }

  const handleClearCart = async () => {
    const prevCart = [...cart]
    setCart([])
    try {
      await api.delete('/cart')
    } catch (err) {
      setCart(prevCart)
      console.error(err)
      alert('Erreur lors du vidage du panier')
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
  
  {/* Page d'accueil = tous les produits */}
  <Route path="/products" element={<Products onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} />} />
  
  {/* Page produit individuel */}
  <Route path="/product/:id" element={<ProductPage onAddToCart={handleAddToCart} />} />
  
  {/* Catégorie dynamique → affiche les produits filtrés */}
  <Route 
    path="/category/:categoryId" 
    element={<Products onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} />} 
  />

  <Route path="/contact" element={<Contact />} />
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/payment" element={<PaymentPage />} />

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