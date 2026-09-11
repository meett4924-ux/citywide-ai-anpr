import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import FullScreenLoader from './FullScreenLoader'

export default function ProtectedRoute() {
  const { isAuthenticated, initializing } = useAuth()
  const location = useLocation()

  // Avoid a flash-redirect to /login while we're still confirming an existing
  // session (e.g. on a hard page refresh) against the backend.
  if (initializing) {
    return <FullScreenLoader label="Checking your session..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <Outlet />
}
