import axios from 'axios'
import { getToken, clearSession } from '../utils/session'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Centralised handling for expired/invalid sessions.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession()
    }
    return Promise.reject(error)
  },
)

export default api
