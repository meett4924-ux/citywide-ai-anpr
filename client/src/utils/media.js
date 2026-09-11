const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

export function resolveMediaUrl(relativePath) {
  if (!relativePath) return null
  if (/^https?:\/\//.test(relativePath)) return relativePath
  return `${API_ORIGIN}${relativePath}`
}
