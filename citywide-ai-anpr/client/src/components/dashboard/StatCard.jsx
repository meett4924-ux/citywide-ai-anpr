import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import Card from '../ui/Card'
import { classNames } from '../../utils/formatters'

const TREND_META = {
  up: { icon: ArrowUpRight, className: 'text-success-600' },
  down: { icon: ArrowDownRight, className: 'text-success-600' },
  'up-negative': { icon: ArrowUpRight, className: 'text-danger-600' },
  flat: { icon: Minus, className: 'text-ink-500' },
}

export default function StatCard({ label, value, delta, trend }) {
  const meta = TREND_META[trend] || TREND_META.flat
  const Icon = meta.icon
  return (
    <Card className="flex flex-col gap-3">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold text-ink-900">{value}</span>
        <span className={classNames('flex items-center gap-0.5 text-xs font-medium', meta.className)}>
          <Icon size={14} />
          {delta}
        </span>
      </div>
    </Card>
  )
}
