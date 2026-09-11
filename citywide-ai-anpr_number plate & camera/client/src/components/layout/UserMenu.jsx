import { useRef, useState } from 'react'
import { ChevronDown, LogOut, Settings, UserCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useClickOutside } from '../../hooks/useClickOutside'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { currentUser as mockUser } from '../../services/mockData'
import { initialsFromName } from '../../utils/formatters'

export default function UserMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  // Falls back to mock profile data until the session payload carries a full profile.
  const profile = user || mockUser
  const displayName = profile.name || 'User'
  const role = profile.role || 'Platform User'

  function handleLogout() {
    setOpen(false)
    logout()
    toast.info('You have been signed out.')
    navigate('/login')
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 pl-2 pr-1.5 py-1.5 rounded-md hover:bg-surface-subtle"
      >
        <div className="w-8 h-8 rounded-full bg-brand-600 text-white text-xs font-semibold flex items-center justify-center shrink-0">
          {initialsFromName(displayName)}
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-medium text-ink-900 leading-tight">{displayName}</p>
          <p className="text-[11px] text-ink-500 leading-tight">{role}</p>
        </div>
        <ChevronDown size={15} className="text-ink-400 hidden sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 card p-1.5 z-30">
          <div className="px-2.5 py-2 border-b border-surface-border mb-1">
            <p className="text-sm font-medium text-ink-900">{displayName}</p>
            <p className="text-xs text-ink-500">{profile.organization || 'City Traffic Command Center'}</p>
          </div>
          <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-ink-700 hover:bg-surface-subtle">
            <UserCircle size={16} /> My profile
          </button>
          <button
            onClick={() => {
              setOpen(false)
              navigate('/settings')
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-ink-700 hover:bg-surface-subtle"
          >
            <Settings size={16} /> Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-danger-600 hover:bg-danger-50"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}
