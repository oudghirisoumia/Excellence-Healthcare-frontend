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
import OrderConfirmation from "./pages/OrderConfirmation"
import NotificationPanel from "./components/NotificationPanel"
import ProductPage from "./pages/ProductPage"
import B2BDashboard from "./pages/B2BDashboardPage";
import B2BClients from "./pages/B2BClients";
import B2BOrders from "./pages/B2BOrders";
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Invoice from "./pages/invoices"
import OrdersPage from "./pages/OrdersPage"

import AdminLayout from "./components/AdminLayout"
import AdminDashboard from "./pages/AdminDashboard"
import AdminDeliveries from "./pages/AdminDeliveries"
import AdminUsers from "./pages/AdminUsers"
import AdminProducts from "./pages/AdminProducts"
import WaitingApprovalPage from "./pages/WaitingApprovalPage"
import AdminOrders from "./pages/AdminOrders"

import StripeProvider from "./components/StripeProvider"

import About from "./components/About";
import api from "./api"


function AppContent() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [favorites, setFavorites] = useState([])
  const [cart, setCart] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

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

  const loadUserData = async () => {
    try {
      const [cartRes, favRes, notifRes] = await Promise.all([
        api.get('/cart'),
        api.get('/favorites'),
        api.get('/notifications')
      ])

      // Backend returns 'cartItems' key
      const cartData = cartRes.data?.cartItems || cartRes.data?.items || cartRes.data || []
      console.log("Raw cart data from API:", cartData)
      console.log("First item structure:", cartData[0])
      
      setCart(Array.isArray(cartData) ? cartData : [])
      setFavorites(Array.isArray(favRes.data) ? favRes.data.map(f => f.product_id || f.id) : [])
      setNotifications(Array.isArray(notifRes.data) ? notifRes.data : [])
    } catch (err) {
      console.error("Failed to load user data", err)
      if (err.response?.status === 401) {
        logout()
        navigate('/auth')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = async (productId) => {
    try {
      await api.post(`/favorites/toggle/${productId}`)
      setFavorites(prev => {
        const favArray = Array.isArray(prev) ? prev : []
        return favArray.includes(productId)
          ? favArray.filter(id => id !== productId)
          : [...favArray, productId]
      })
    } catch (err) {
      toast.error("Connectez-vous pour ajouter aux favoris")
    }
  }

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/auth')
      return
    }

    try {
      const response = await api.post('/cart', { product_id: product.id, quantity: 1 })
      const newCartItem = response.data?.cartItem
      
      setCart(prev => {
        const cartArray = Array.isArray(prev) ? prev : []
        const exists = cartArray.find(i => i.product_id === product.id)
        if (exists) {
          return cartArray.map(i => i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        }
        return [...cartArray, newCartItem || { id: Date.now(), product_id: product.id, product, quantity: 1 }]
      })
      toast.success("Produit ajouté au panier")
    } catch (err) {
      console.error("Add to cart error:", err)
      if (err.response?.status === 401) {
        navigate('/auth')
      } else {
        toast.error("Erreur lors de l'ajout au panier")
      }
    }
  }

  const handleRemoveFromCart = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`)
      setCart(prev => {
        const cartArray = Array.isArray(prev) ? prev : []
        return cartArray.filter(i => i.id !== itemId)
      })
      toast.info("Produit retiré du panier")
    } catch (err) {
      console.error("Remove from cart error:", err)
      toast.error("Erreur lors de la suppression")
    }
  }

  const handleUpdateCartQuantity = async (itemId, quantity) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      toast.error("Quantité invalide")
      return
    }

    if (quantity === 0) {
      handleRemoveFromCart(itemId)
      return
    }

    try {
      const response = await api.put(`/cart/${itemId}`, { quantity })
      const updatedItem = response.data?.cartItem
      
      setCart(prev => {
        const cartArray = Array.isArray(prev) ? prev : []
        return cartArray.map(i => 
          i.id === itemId ? { ...i, quantity: updatedItem?.quantity || quantity } : i
        )
      })
    } catch (err) {
      console.error("Error updating quantity:", err)
      if (err.response?.status === 404) {
        toast.error("Produit non trouvé")
        setCart(prev => Array.isArray(prev) ? prev.filter(i => i.id !== itemId) : [])
      } else {
        toast.error("Erreur lors de la mise à jour")
      }
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

  const cartArray = Array.isArray(cart) ? cart : (cart?.items || []);

  return (
    <>
      <Header
        cartCount={cartArray.reduce((sum, i) => sum + i.quantity, 0)}
        favoritesCount={favorites.length}
        notificationsCount={notifications.filter(n => !n.read).length}
        onOpenNotifications={() => { }}
      >
        <Categories />
      </Header>



      <main className="container">
        <Routes>
          {/* Public site */}
          <Route path="/" element={<Home onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/products" element={<Products onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} />} />
          <Route path="/product/:id" element={<ProductPage onAddToCart={handleAddToCart} />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/invoice/:id" element={<Invoice />} />
          <Route path="/cart" element={<CartPage cart={cart} onRemoveFromCart={handleRemoveFromCart} onUpdateQuantity={handleUpdateCartQuantity} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} onClearCart={handleClearCart} />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
          {/* About */}
          <Route path="/about" element={<About />} />

          {/* B2B */}
          <Route path="/b2b/dashboard" element={<B2BDashboard />} />
          <Route path="/b2b/clients" element={<B2BClients />} />
          <Route path="/b2b/orders" element={<B2BOrders />} />
          <Route path="/waiting-approval" element={<WaitingApprovalPage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="deliveries" element={<AdminDeliveries />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>

      </main>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <StripeProvider>
          <AppContent />
        </StripeProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
