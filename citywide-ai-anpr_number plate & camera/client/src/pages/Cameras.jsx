import { useMemo, useState } from 'react'
import { Camera as CameraIcon, Plus } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import ListToolbar from '../components/ui/ListToolbar'
import MockDataNotice from '../components/ui/MockDataNotice'
import { CameraStatusBadge } from '../components/ui/Badge'
import { cameras } from '../services/mockData'

export default function Cameras() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return cameras
    return cameras.filter((c) =>
      [c.id, c.name, c.zone].some((field) => field.toLowerCase().includes(q)),
    )
  }, [query])

  const counts = {
    online: cameras.filter((c) => c.status === 'online').length,
    degraded: cameras.filter((c) => c.status === 'degraded').length,
    offline: cameras.filter((c) => c.status === 'offline').length,
  }

  return (
    <div>
      <PageHeader
        title="Camera Network"
        description="Monitor connectivity and health for every ANPR camera registered on the platform."
        actions={
          <button className="btn-primary">
            <Plus size={16} /> Register camera
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-5 max-w-xl">
        <Card className="text-center">
          <p className="text-lg font-semibold text-success-600">{counts.online}</p>
          <p className="text-xs text-ink-500 mt-0.5">Online</p>
        </Card>
        <Card className="text-center">
          <p className="text-lg font-semibold text-warning-600">{counts.degraded}</p>
          <p className="text-xs text-ink-500 mt-0.5">Degraded</p>
        </Card>
        <Card className="text-center">
          <p className="text-lg font-semibold text-danger-600">{counts.offline}</p>
          <p className="text-xs text-ink-500 mt-0.5">Offline</p>
        </Card>
      </div>

      <Card padded={false}>
        <div className="p-5 pb-0">
          <MockDataNotice text="Camera feed and telemetry are simulated. Live RTSP/API integration is planned for a later phase." />
          <ListToolbar searchPlaceholder="Search by camera ID, name, or zone..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-500 border-y border-surface-border bg-surface-muted">
                <th className="px-5 py-2.5 font-medium">Camera</th>
                <th className="px-5 py-2.5 font-medium">Zone</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 font-medium">Uptime</th>
                <th className="px-5 py-2.5 font-medium">Last ping</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((cam) => (
                <tr key={cam.id} className="hover:bg-surface-muted/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                        <CameraIcon size={15} />
                      </div>
                      <div>
                        <p className="font-medium text-ink-900">{cam.name}</p>
                        <p className="text-xs text-ink-500 data-mono">{cam.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink-700">{cam.zone}</td>
                  <td className="px-5 py-3"><CameraStatusBadge status={cam.status} /></td>
                  <td className="px-5 py-3 text-ink-700 data-mono">{cam.uptime}</td>
                  <td className="px-5 py-3 text-ink-500">{cam.lastPing}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-ink-500">
                    No cameras match "{query}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
