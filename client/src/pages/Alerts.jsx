import { useMemo, useState } from 'react'
import { AlertTriangle, ShieldAlert, Info } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import MockDataNotice from '../components/ui/MockDataNotice'
import { classNames } from '../utils/formatters'
import { alerts } from '../services/mockData'

const ICONS = { critical: ShieldAlert, warning: AlertTriangle, info: Info }
const ICON_STYLES = {
  critical: 'bg-danger-50 text-danger-600',
  warning: 'bg-warning-50 text-warning-600',
  info: 'bg-brand-50 text-brand-600',
}
const FILTERS = ['all', 'critical', 'warning', 'info']

export default function Alerts() {
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(
    () => (filter === 'all' ? alerts : alerts.filter((a) => a.severity === filter)),
    [filter],
  )

  return (
    <div>
      <PageHeader
        title="Alerts"
        description="Critical events, violations, and system health notices requiring attention."
      />

      <MockDataNotice text="Alerts are simulated for the platform preview. Live alerts will stream in once ANPR rules and camera health checks are connected." />

      <div className="flex items-center gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={classNames(
              'px-3 py-1.5 rounded-md text-xs font-medium capitalize border transition-colors',
              filter === f
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-ink-600 border-surface-border hover:bg-surface-subtle',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <Card padded={false}>
        <ul className="divide-y divide-surface-border">
          {filtered.map((alert) => {
            const Icon = ICONS[alert.severity] || Info
            return (
              <li key={alert.id} className="flex items-start gap-4 px-5 py-4">
                <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${ICON_STYLES[alert.severity]}`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-ink-900">{alert.title}</p>
                    <span className="text-xs text-ink-400 shrink-0">{alert.time}</span>
                  </div>
                  <p className="text-sm text-ink-500 mt-0.5">{alert.detail}</p>
                  <p className="text-xs text-ink-400 mt-1 data-mono">{alert.id}</p>
                </div>
              </li>
            )
          })}
          {filtered.length === 0 && (
            <li className="px-5 py-10 text-center text-sm text-ink-500">No alerts in this category.</li>
          )}
        </ul>
      </Card>
    </div>
  )
}
