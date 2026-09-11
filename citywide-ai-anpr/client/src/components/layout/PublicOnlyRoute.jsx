import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import FullScreenLoader from './FullScreenLoader'

export default function PublicOnlyRoute() {
  const { isAuthenticated, initializing } = useAuth()

  if (initializing) {
    return <FullScreenLoader label="Loading..." />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  return <Outlet />
}
