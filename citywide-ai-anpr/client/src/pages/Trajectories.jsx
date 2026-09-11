import { ArrowRight, Route as RouteIcon } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import MockDataNotice from '../components/ui/MockDataNotice'
import DemoScenarioPanel from '../components/demo/DemoScenarioPanel'
import PlateSearch from '../components/anpr/PlateSearch'
import { useDemoScenario, formatDuration, pathDistanceKm } from '../context/DemoScenarioContext'
import { trajectories } from '../services/mockData'

export default function Trajectories() {
  const { isCompleted, summary } = useDemoScenario()

  // The completed Demo Scenario contributes one extra, clearly-labeled
  // trajectory entry alongside the existing mock ones — the mock list itself
  // is untouched.
  const demoTrajectory = isCompleted && summary
    ? {
        id: 'DEMO-GJ05AB1234',
        plate: summary.plate,
        path: summary.cameraIds,
        startTime: 'Demo scenario',
        endTime: formatDuration(summary.journeyDurationMs),
        distanceKm: pathDistanceKm(summary.cameraIds),
        status: 'demo',
      }
    : null

  const allTrajectories = demoTrajectory ? [demoTrajectory, ...trajectories] : trajectories

  return (
    <div>
      <PageHeader
        title="Vehicle Trajectories"
        description="Reconstructed routes stitched from multiple camera detections of the same plate over time."
      />

      <PlateSearch />

      <DemoScenarioPanel />

      <MockDataNotice text="Trajectories below are simulated for layout purposes. Real routes will be computed once cameras and the plate-matching engine are connected." />

      <div className="space-y-4">
        {allTrajectories.map((t) => (
          <Card key={t.id}>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <RouteIcon size={15} className="text-brand-600" />
                  <span className="data-mono">{t.id}</span>
                </span>
              }
              subtitle={`Plate ${t.plate} · ${t.startTime} – ${t.endTime} · ${t.distanceKm} km`}
              action={
                <Badge variant={t.status === 'flagged' ? 'danger' : t.status === 'demo' ? 'brand' : 'success'}>
                  {t.status === 'demo' ? 'Demo Scenario' : t.status}
                </Badge>
              }
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
