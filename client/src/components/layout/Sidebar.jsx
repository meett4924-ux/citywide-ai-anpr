import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Camera, Car, Route, BarChart3, ShieldAlert,
  Map as MapIcon, FileText, Settings, ScanLine, ChevronsLeft, X,
} from 'lucide-react'
import { classNames } from '../../utils/formatters'
import { useUI } from '../../context/UIContext'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cameras', label: 'Cameras', icon: Camera },
  { to: '/vehicles', label: 'Vehicles', icon: Car },
  { to: '/trajectories', label: 'Trajectories', icon: Route },
  { to: '/traffic-analytics', label: 'Traffic Analytics', icon: BarChart3 },
  { to: '/alerts', label: 'Alerts', icon: ShieldAlert },
  { to: '/map', label: 'Live Map', icon: MapIcon },
  { to: '/reports', label: 'Reports', icon: FileText },
]

const SECONDARY_ITEMS = [{ to: '/settings', label: 'Settings', icon: Settings }]

function Brand({ collapsed }) {
  return (
    <div className="flex items-center gap-2.5 px-4 h-16 shrink-0 border-b border-surface-border">
      <div className="w-9 h-9 rounded-md bg-brand-600 flex items-center justify-center shrink-0">
        <ScanLine size={18} className="text-white" />
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink-900 leading-tight truncate">CityWide ANPR</p>
          <p className="text-[11px] text-ink-500 leading-tight truncate">Traffic Intelligence Platform</p>
        </div>
      )}
    </div>
  )
}

function NavItems({ collapsed, onNavigate }) {
  return (
    <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            classNames(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-50 text-brand-700'
                : 'text-ink-500 hover:bg-surface-subtle hover:text-ink-900',
            )
          }
          title={collapsed ? label : undefined}
        >
          <Icon size={18} className="shrink-0" />
          {!collapsed && <span className="truncate">{label}</span>}
        </NavLink>
      ))}

      <div className="pt-3 mt-3 border-t border-surface-border space-y-0.5">
        {SECONDARY_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              classNames(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-500 hover:bg-surface-subtle hover:text-ink-900',
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, mobileNavOpen, setMobileNavOpen } = useUI()

  return (
    <>
      {/* Desktop / tablet sidebar */}
      <aside
        className={classNames(
          'hidden md:flex flex-col bg-white border-r border-surface-border shrink-0 transition-all duration-200',
          sidebarOpen ? 'w-64' : 'w-[72px]',
        )}
      >
        <Brand collapsed={!sidebarOpen} />
        <NavItems collapsed={!sidebarOpen} />
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2 px-4 h-12 border-t border-surface-border text-ink-500 hover:text-ink-900 text-xs font-medium"
        >
          <ChevronsLeft size={16} className={classNames('transition-transform', !sidebarOpen && 'rotate-180')} />
          {sidebarOpen && 'Collapse'}
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setMobileNavOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-xl">
            <div className="relative">
              <Brand collapsed={false} />
              <button
                onClick={() => setMobileNavOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-ink-500 hover:text-ink-900"
                aria-label="Close navigation"
              >
                <X size={20} />
              </button>
            </div>
            <NavItems collapsed={false} onNavigate={() => setMobileNavOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}
