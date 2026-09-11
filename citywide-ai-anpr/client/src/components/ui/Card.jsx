import { classNames } from '../../utils/formatters'

export default function Card({ children, className, padded = true, ...rest }) {
  return (
    <div className={classNames('card', padded && 'p-5', className)} {...rest}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
        {subtitle && <p className="text-xs text-ink-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
