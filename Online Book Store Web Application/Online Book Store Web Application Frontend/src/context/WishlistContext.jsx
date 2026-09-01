import { createContext, useContext, useState, useCallback } from 'react'
import { wishlistApi } from '../api/wishlistApi'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([])
      return
    }
    setLoading(true)
    try {
      const res = await wishlistApi.getWishlist()
      setItems(res.data)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const addToWishlist = useCallback(async (bookId) => {
    const res = await wishlistApi.addItem(bookId)
    setItems(res.data)
  }, [])

  const removeFromWishlist = useCallback(async (bookId) => {
    const res = await wishlistApi.removeItem(bookId)
    setItems(res.data)
  }, [])

  const isWishlisted = useCallback((bookId) => items.some((b) => b.id === bookId), [items])

  const value = { items, loading, refreshWishlist, addToWishlist, removeFromWishlist, isWishlisted }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider')
  return ctx
}
