import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus, ScanLine } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { isValidEmail } from '../utils/validation'
import PasswordStrengthMeter from '../components/auth/PasswordStrengthMeter'

const ROLE_OPTIONS = ['Administrator', 'Traffic Officer', 'Police Officer', 'Traffic Analyst', 'Viewer']

export default function Signup() {
  const { signup, loading, error, setError } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    password: '',
    confirmPassword: '',
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (fieldErrors[name]) setFieldErrors((fe) => ({ ...fe, [name]: undefined }))
  }

  function validate() {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Full name is required.'
    if (!form.email.trim()) errors.email = 'Email is required.'
    else if (!isValidEmail(form.email)) errors.email = 'Enter a valid email address.'
    if (!form.organization.trim()) errors.organization = 'Organization is required.'
    if (!form.role) errors.role = 'Select a role.'
    if (!form.password) errors.password = 'Password is required.'
    else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.'
    if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match.'
    if (!agreedToTerms) errors.terms = 'You must accept the terms to continue.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!validate()) return
    try {
      await signup(form)
      toast.success('Account created successfully.')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Unable to create account.')
    }
  }

  return (
    <div>
      <div className="lg:hidden flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-md bg-brand-600 flex items-center justify-center">
          <ScanLine size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-900 leading-tight">City-Wide AI Engine</p>
          <p className="text-[11px] text-ink-500 leading-tight">Multi-Camera ANPR &amp; Urban Traffic Intelligence</p>
        </div>
      </div>

      <h1 className="text-xl font-semibold text-ink-900">Request platform access</h1>
      <p className="text-sm text-ink-500 mt-1.5">
        Accounts are provisioned for verified traffic department personnel.
      </p>

      {error && (
        <div role="alert" className="mt-5 rounded-md bg-danger-50 text-danger-600 text-sm px-3.5 py-2.5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input
            id="name" name="name" placeholder="Inspector A. Rao"
            className={`input ${fieldErrors.name ? '!border-danger-500' : ''}`}
            value={form.name} onChange={handleChange}
          />
          {fieldErrors.name && <p className="text-xs text-danger-600 mt-1.5">{fieldErrors.name}</p>}
        </div>

        <div>
          <label className="label" htmlFor="email">Official email</label>
          <input
            id="email" name="email" type="email" placeholder="you@cityanpr.gov"
            className={`input ${fieldErrors.email ? '!border-danger-500' : ''}`}
            value={form.email} onChange={handleChange}
          />
          {fieldErrors.email && <p className="text-xs text-danger-600 mt-1.5">{fieldErrors.email}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="organization">Organization</label>
            <input
              id="organization" name="organization" placeholder="Traffic Police - Zone 1"
              className={`input ${fieldErrors.organization ? '!border-danger-500' : ''}`}
              value={form.organization} onChange={handleChange}
            />
            {fieldErrors.organization && <p className="text-xs text-danger-600 mt-1.5">{fieldErrors.organization}</p>}
          </div>

          <div>
            <label className="label" htmlFor="role">Role</label>
            <select
              id="role" name="role"
              className={`input ${fieldErrors.role ? '!border-danger-500' : ''}`}
              value={form.role} onChange={handleChange}
            >
              <option value="" disabled>Select role</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {fieldErrors.role && <p className="text-xs text-danger-600 mt-1.5">{fieldErrors.role}</p>}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="password">Create password</label>
          <div className="relative">
            <input
              id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
              className={`input pr-10 ${fieldErrors.password ? '!border-danger-500' : ''}`}
              value={form.password} onChange={handleChange}
            />
            <button
              type="button" onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <PasswordStrengthMeter password={form.password} />
          {fieldErrors.password && <p className="text-xs text-danger-600 mt-1.5">{fieldErrors.password}</p>}
        </div>

        <div>
          <label className="label" htmlFor="confirmPassword">Confirm password</label>
          <div className="relative">
            <input
              id="confirmPassword" name="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="••••••••"
              className={`input pr-10 ${fieldErrors.confirmPassword ? '!border-danger-500' : ''}`}
              value={form.confirmPassword} onChange={handleChange}
            />
            <button
              type="button" onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {fieldErrors.confirmPassword && <p className="text-xs text-danger-600 mt-1.5">{fieldErrors.confirmPassword}</p>}
        </div>

        <div>
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked)
                if (fieldErrors.terms) setFieldErrors((fe) => ({ ...fe, terms: undefined }))
              }}
              className="w-4 h-4 mt-0.5 rounded border-surface-border text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-ink-700">
              I agree to the platform's acceptable use policy and data handling terms.
            </span>
          </label>
          {fieldErrors.terms && <p className="text-xs text-danger-600 mt-1.5">{fieldErrors.terms}</p>}
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          <UserPlus size={16} />
          {loading ? 'Submitting...' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-ink-500 mt-6 text-center">
        Already have access?{' '}
        <Link to="/login" className="text-brand-600 font-medium hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </div>
  )
}
