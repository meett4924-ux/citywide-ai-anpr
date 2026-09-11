import { Menu, Search } from 'lucide-react'
import { useUI } from '../../context/UIContext'
import NotificationsMenu from './NotificationsMenu'
import UserMenu from './UserMenu'

export default function Topbar() {
  const { setMobileNavOpen } = useUI()

  return (
    <header className="h-16 shrink-0 bg-white border-b border-surface-border flex items-center gap-3 px-4 sm:px-6">
      <button
        onClick={() => setMobileNavOpen(true)}
        className="md:hidden p-2 -ml-2 text-ink-500 hover:text-ink-900"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 max-w-md relative hidden sm:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          placeholder="Search plate number, camera ID, or location..."
          className="input pl-9 bg-surface-muted border-transparent focus:bg-white"
        />
      </div>

      <div className="flex-1 sm:hidden" />

      <div className="flex items-center gap-1.5 sm:gap-3 ml-auto">
        <span className="hidden md:inline-flex badge badge-success mr-1">
          <span className="w-1.5 h-1.5 rounded-full bg-current" /> System operational
        </span>
        <NotificationsMenu />
        <div className="w-px h-6 bg-surface-border hidden sm:block" />
        <UserMenu />
      </div>
    </header>
  )
}
