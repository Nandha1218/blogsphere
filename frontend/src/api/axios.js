import axios from 'axios'

/**
 * Preconfigured axios instance.
 *
 * - baseURL points to the Django dev server
 * - Request interceptor automatically attaches Bearer token from localStorage
 * - Response interceptor attempts one silent token refresh on 401 errors;
 *   if refresh also fails, clears storage and redirects to /login
 */
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request Interceptor ───────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Response Interceptor (Auto Token Refresh) ────────────────────────────
let isRefreshing = false

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status

    if (status === 401 && !original._retry && !isRefreshing) {
      original._retry = true
      isRefreshing = true
      const refresh = localStorage.getItem('refresh_token')

      if (refresh) {
        try {
          const res = await axios.post('http://localhost:8000/api/refresh/', { refresh })
          const newAccess = res.data.access
          localStorage.setItem('access_token', newAccess)
          original.headers.Authorization = `Bearer ${newAccess}`
          isRefreshing = false
          return api(original)  // retry original request
        } catch {
          // Refresh failed — force logout
        }
      }

      isRefreshing = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
