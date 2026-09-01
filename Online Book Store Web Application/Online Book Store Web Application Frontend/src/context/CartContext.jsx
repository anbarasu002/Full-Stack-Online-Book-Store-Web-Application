import { createContext, useContext, useState, useCallback } from 'react'
import { cartApi } from '../api/cartApi'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([])
      return
    }
    setLoading(true)
    try {
      const res = await cartApi.getCart()
      setItems(res.data)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const addToCart = useCallback(async (bookId, quantity = 1) => {
    const res = await cartApi.addItem(bookId, quantity)
    setItems(res.data)
  }, [])

  const updateQuantity = useCallback(async (bookId, quantity) => {
    const res = await cartApi.updateItem(bookId, quantity)
    setItems(res.data)
  }, [])

  const removeFromCart = useCallback(async (bookId) => {
    const res = await cartApi.removeItem(bookId)
    setItems(res.data)
  }, [])

  const clearCart = useCallback(async () => {
    await cartApi.clearCart()
    setItems([])
  }, [])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalAmount = items.reduce((sum, i) => sum + i.subtotal, 0)

  const value = { items, loading, itemCount, totalAmount, refreshCart, addToCart, updateQuantity, removeFromCart, clearCart }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
