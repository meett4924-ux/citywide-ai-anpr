import { ArrowRight, Route as RouteIcon } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import MockDataNotice from '../components/ui/MockDataNotice'
import { trajectories } from '../services/mockData'

export default function Trajectories() {
  return (
    <div>
      <PageHeader
        title="Vehicle Trajectories"
        description="Reconstructed routes stitched from multiple camera detections of the same plate over time."
      />

      <MockDataNotice text="Trajectories below are simulated for layout purposes. Real routes will be computed once cameras and the plate-matching engine are connected." />

      <div className="space-y-4">
        {trajectories.map((t) => (
          <Card key={t.id}>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <RouteIcon size={15} className="text-brand-600" />
                  <span className="data-mono">{t.id}</span>
                </span>
              }
              subtitle={`Plate ${t.plate} · ${t.startTime} – ${t.endTime} · ${t.distanceKm} km`}
              action={<Badge variant={t.status === 'flagged' ? 'danger' : 'success'}>{t.status}</Badge>}
            />
            <div className="flex items-center flex-wrap gap-2">
              {t.path.map((camId, idx) => (
                <span key={`${t.id}-${camId}`} className="flex items-center gap-2">
                  <span className="badge badge-neutral data-mono">{camId}</span>
                  {idx < t.path.length - 1 && <ArrowRight size={14} className="text-ink-400" />}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
