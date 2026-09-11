import { useLocation } from 'react-router-dom'

const ROUTE_LABELS = {
  dashboard: 'Dashboard',
  cameras: 'Cameras',
  vehicles: 'Vehicles',
  trajectories: 'Trajectories',
  'traffic-analytics': 'Traffic Analytics',
  alerts: 'Alerts',
  map: 'Live Map',
  reports: 'Reports',
  settings: 'Settings',
}

// Turns "/cameras" into { title: "Cameras", crumbs: ["Home", "Cameras"] }
export function useBreadcrumb() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)
  const current = segments[segments.length - 1] || 'dashboard'
  const title = ROUTE_LABELS[current] || 'Overview'
  const crumbs = ['Home', ...segments.map((s) => ROUTE_LABELS[s] || s)]
  return { title, crumbs }
}
