import { useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { useClickOutside } from '../../hooks/useClickOutside'
import { notifications as mockNotifications } from '../../services/mockData'

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))

  const unreadCount = mockNotifications.filter((n) => n.unread).length

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-md text-ink-500 hover:bg-surface-subtle hover:text-ink-900"
        aria-label="Notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger-500 ring-2 ring-white" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 card p-0 z-30 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
            <p className="text-sm font-semibold text-ink-900">Notifications</p>
            <span className="text-xs text-ink-500">{unreadCount} unread</span>
          </div>
          <ul className="max-h-80 overflow-y-auto divide-y divide-surface-border">
            {mockNotifications.map((n) => (
              <li key={n.id} className="px-4 py-3 hover:bg-surface-muted cursor-default">
                <div className="flex items-start gap-2">
                  {n.unread && <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-brand-500 shrink-0" />}
                  <div className={n.unread ? '' : 'pl-3.5'}>
                    <p className="text-sm font-medium text-ink-900">{n.title}</p>
                    <p className="text-xs text-ink-500 mt-0.5">{n.detail}</p>
                    <p className="text-[11px] text-ink-400 mt-1">{n.time}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-4 py-2.5 border-t border-surface-border text-center">
            <button className="text-xs font-medium text-brand-600 hover:text-brand-700">View all notifications</button>
          </div>
        </div>
      )}
    </div>
  )
}
