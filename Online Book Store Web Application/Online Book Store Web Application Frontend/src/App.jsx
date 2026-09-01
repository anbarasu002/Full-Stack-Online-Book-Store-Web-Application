import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSpinner from './components/LoadingSpinner'
import { useAuth } from './context/AuthContext'

import Home from './pages/Home'
import Auth from './pages/Auth'
import BookListing from './pages/BookListing'
import BookDetails from './pages/BookDetails'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import OrderHistory from './pages/OrderHistory'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

function Landing() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Home />
}

function App() {
  const location = useLocation()

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/books" element={<BookListing />} />
        <Route path="/books/:id" element={<BookDetails />} />

        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </>
  )
}

export default App
