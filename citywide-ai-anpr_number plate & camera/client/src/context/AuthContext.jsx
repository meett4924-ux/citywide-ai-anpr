import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as authService from '../services/authService'
import { saveSession, getStoredUser, getToken, clearSession } from '../utils/session'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())
  const [loading, setLoading] = useState(false) // true during an in-flight login/signup submit
  const [initializing, setInitializing] = useState(true) // true while restoring/validating a session on first load
  const [error, setError] = useState(null)

  const isAuthenticated = Boolean(user)

  const login = useCallback(async (credentials, rememberMe = true) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.login(credentials)
      saveSession({ token: data.token, user: data.user, rememberMe })
      setUser(data.user)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to sign in. Please check your credentials.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const signup = useCallback(async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.signup(payload)
      saveSession({ token: data.token, user: data.user, rememberMe: true })
      setUser(data.user)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to create account.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const fetchCurrentUser = useCallback(async () => {
    try {
      const data = await authService.fetchCurrentUser()
      setUser(data)
      return data
    } catch (err) {
      clearSession()
      setUser(null)
      throw err
    }
  }, [])

  // On first load, if a token exists, silently confirm it's still valid against
  // the backend so a stale/expired token doesn't leave the UI in a broken state.
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setInitializing(false)
      return
    }
    fetchCurrentUser().finally(() => setInitializing(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, initializing, error, login, signup, logout, fetchCurrentUser, setError }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
