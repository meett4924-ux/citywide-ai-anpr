import { Link } from 'react-router-dom'
import Card, { CardHeader } from '../ui/Card'
import { CameraStatusBadge } from '../ui/Badge'
import { cameras } from '../../services/mockData'

export default function CameraStatusCard() {
  const online = cameras.filter((c) => c.status === 'online').length
  const degraded = cameras.filter((c) => c.status === 'degraded').length
  const offline = cameras.filter((c) => c.status === 'offline').length

  return (
    <Card padded={false}>
      <div className="p-5 pb-0">
        <CardHeader
          title="Camera Network Status"
          subtitle={`${online} online · ${degraded} degraded · ${offline} offline`}
          action={
            <Link to="/cameras" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              Manage cameras
            </Link>
          }
        />
      </div>
      <ul className="divide-y divide-surface-border">
        {cameras.slice(0, 5).map((cam) => (
          <li key={cam.id} className="flex items-center justify-between gap-3 px-5 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink-900 truncate">{cam.name}</p>
              <p className="text-xs text-ink-500 data-mono">{cam.id} &nbsp;&middot;&nbsp; {cam.zone}</p>
            </div>
            <CameraStatusBadge status={cam.status} />
          </li>
        ))}
      </ul>
    </Card>
  )
}
