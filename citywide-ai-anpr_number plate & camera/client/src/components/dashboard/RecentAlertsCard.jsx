import { Link } from 'react-router-dom'
import { AlertTriangle, ShieldAlert, Info } from 'lucide-react'
import Card, { CardHeader } from '../ui/Card'
import { alerts } from '../../services/mockData'

const ICONS = { critical: ShieldAlert, warning: AlertTriangle, info: Info }
const ICON_STYLES = {
  critical: 'bg-danger-50 text-danger-600',
  warning: 'bg-warning-50 text-warning-600',
  info: 'bg-brand-50 text-brand-600',
}

export default function RecentAlertsCard() {
  return (
    <Card padded={false}>
      <div className="p-5 pb-0">
        <CardHeader
          title="Recent Alerts"
          subtitle="Latest events across all zones"
          action={
            <Link to="/alerts" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              View all
            </Link>
          }
        />
      </div>
      <ul className="divide-y divide-surface-border">
        {alerts.slice(0, 5).map((alert) => {
          const Icon = ICONS[alert.severity] || Info
          return (
            <li key={alert.id} className="flex items-start gap-3 px-5 py-3.5">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${ICON_STYLES[alert.severity]}`}>
                <Icon size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink-900 truncate">{alert.title}</p>
                <p className="text-xs text-ink-500 mt-0.5 line-clamp-1">{alert.detail}</p>
              </div>
              <span className="text-[11px] text-ink-400 shrink-0 mt-0.5">{alert.time}</span>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
