import { classNames } from '../../utils/formatters'
import { cameraStatusStyles, severityStyles } from '../../utils/formatters'

export default function Badge({ children, variant = 'neutral', className }) {
  return <span className={classNames('badge', `badge-${variant}`, className)}>{children}</span>
}

export function CameraStatusBadge({ status }) {
  const meta = cameraStatusStyles[status] || cameraStatusStyles.offline
  return (
    <span className={classNames('badge', meta.badge)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  )
}

export function SeverityBadge({ severity }) {
  const meta = severityStyles[severity] || severityStyles.info
  return <span className={classNames('badge', meta.badge)}>{severity}</span>
}
