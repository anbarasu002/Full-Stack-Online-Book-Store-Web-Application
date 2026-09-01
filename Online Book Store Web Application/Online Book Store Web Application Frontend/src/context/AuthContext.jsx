import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('bookstore_token')
    if (!token) {
      setLoading(false)
      return
    }

    authApi.me()
      .then((res) => {
        setUser(res.data)
        localStorage.setItem('bookstore_user', JSON.stringify(res.data))
      })
      .catch(() => {
        localStorage.removeItem('bookstore_token')
        localStorage.removeItem('bookstore_user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password })
    localStorage.setItem('bookstore_token', res.data.token)
    localStorage.setItem('bookstore_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }, [])

  const register = useCallback(async (name, email, password) => {
    const res = await authApi.register({ name, email, password })
    localStorage.setItem('bookstore_token', res.data.token)
    localStorage.setItem('bookstore_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {

    }
    localStorage.removeItem('bookstore_token')
    localStorage.removeItem('bookstore_user')
    setUser(null)
  }, [])

  const updateUserInPlace = useCallback((updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('bookstore_user', JSON.stringify(updatedUser))
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    loading,
    login,
    register,
    logout,
    updateUserInPlace,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
