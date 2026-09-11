import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, ScanLine } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { isValidEmail } from '../utils/validation'

export default function Login() {
  const { login, loading, error, setError } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(true)
  const [fieldErrors, setFieldErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (fieldErrors[name]) setFieldErrors((fe) => ({ ...fe, [name]: undefined }))
  }

  function validate() {
    const errors = {}
    if (!form.email.trim()) errors.email = 'Email is required.'
    else if (!isValidEmail(form.email)) errors.email = 'Enter a valid email address.'
    if (!form.password) errors.password = 'Password is required.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!validate()) return
    try {
      await login(form, rememberMe)
      toast.success('Signed in successfully.')
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Unable to sign in.')
    }
  }

  return (
    <div>
      {/* Mobile-only brand mark, since the side panel is hidden below lg breakpoint */}
      <div className="lg:hidden flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-md bg-brand-600 flex items-center justify-center">
          <ScanLine size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-900 leading-tight">City-Wide AI Engine</p>
          <p className="text-[11px] text-ink-500 leading-tight">Multi-Camera ANPR &amp; Urban Traffic Intelligence</p>
        </div>
      </div>

      <h1 className="text-xl font-semibold text-ink-900">Sign in to your console</h1>
      <p className="text-sm text-ink-500 mt-1.5">
        Enter your credentials to access the traffic command center.
      </p>

      {error && (
        <div role="alert" className="mt-5 rounded-md bg-danger-50 text-danger-600 text-sm px-3.5 py-2.5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="email">Official email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@cityanpr.gov"
            className={`input ${fieldErrors.email ? '!border-danger-500' : ''}`}
            value={form.email}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email && <p className="text-xs text-danger-600 mt-1.5">{fieldErrors.email}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label mb-0" htmlFor="password">Password</label>
            <button
              type="button"
              onClick={() => toast.info('Password reset requires administrator assistance at this stage.')}
              className="text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              className={`input pr-10 ${fieldErrors.password ? '!border-danger-500' : ''}`}
              value={form.password}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {fieldErrors.password && <p className="text-xs text-danger-600 mt-1.5">{fieldErrors.password}</p>}
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-surface-border text-brand-600 focus:ring-brand-500"
          />
          <span className="text-sm text-ink-700">Remember me on this device</span>
        </label>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          <LogIn size={16} />
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="text-sm text-ink-500 mt-6 text-center">
        Need an account?{' '}
        <Link to="/signup" className="text-brand-600 font-medium hover:text-brand-700">
          Request access
        </Link>
      </p>

      <p className="text-xs text-ink-400 mt-8 text-center">
        Note: authentication requires the backend API and a connected MongoDB instance.
        If either is unavailable, signing in will show a connection error.
      </p>
    </div>
  )
}
