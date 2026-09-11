import { Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import PublicOnlyRoute from './components/layout/PublicOnlyRoute'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AnprProcessing from './pages/AnprProcessing'
import Cameras from './pages/Cameras'
import Vehicles from './pages/Vehicles'
import Trajectories from './pages/Trajectories'
import TrafficAnalytics from './pages/TrafficAnalytics'
import Alerts from './pages/Alerts'
import MapView from './pages/MapView'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      {/* Public auth routes — redirect away if already signed in */}
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Route>

      {/* Protected application shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/anpr" element={<AnprProcessing />} />
          <Route path="/cameras" element={<Cameras />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/trajectories" element={<Trajectories />} />
          <Route path="/traffic-analytics" element={<TrafficAnalytics />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
