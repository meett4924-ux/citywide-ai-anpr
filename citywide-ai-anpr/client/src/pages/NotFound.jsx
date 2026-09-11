import { Link } from 'react-router-dom'
import { ScanLine } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-muted px-6 text-center">
      <div className="w-14 h-14 rounded-md bg-brand-600 flex items-center justify-center mb-5">
        <ScanLine size={26} className="text-white" />
      </div>
      <p className="text-sm font-semibold text-brand-600 mb-1">404</p>
      <h1 className="text-2xl font-semibold text-ink-900 mb-2">Page not found</h1>
      <p className="text-sm text-ink-500 max-w-sm mb-6">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/dashboard" className="btn-primary">Back to dashboard</Link>
    </div>
  )
}
