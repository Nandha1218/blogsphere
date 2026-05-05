import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

/**
 * AuthContext — provides global authentication state
 *
 * Exposed values:
 *   user         — decoded user object {id, username, email, role} or null
 *   token        — JWT access token string
 *   login(data)  — call with {username, password}, stores tokens, sets user
 *   logout()     — clears tokens and user
 *   isLoading    — true while restoring session from localStorage
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('access_token'))
  const [isLoading, setIsLoading] = useState(true)

  // On mount, restore session if tokens exist in localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token')
    if (storedToken) {
      fetchProfile(storedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchProfile = async (accessToken) => {
    try {
      const res = await api.get('/api/profile/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setUser(res.data)
      setToken(accessToken)
    } catch {
      // Token expired or invalid — clear everything
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async ({ username, password }) => {
    // POST /api/login/ → returns { access, refresh }
    const res = await api.post('/api/login/', { username, password })
    const { access, refresh } = res.data

    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    setToken(access)

    // Fetch user profile after login
    await fetchProfile(access)
  }

  const googleLogin = async (googleAccessToken) => {
    const res = await api.post('/api/auth/google/', { access_token: googleAccessToken })
    const { access, refresh } = res.data

    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    setToken(access)

    await fetchProfile(access)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, googleLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )

}

// Custom hook for consuming auth context
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
