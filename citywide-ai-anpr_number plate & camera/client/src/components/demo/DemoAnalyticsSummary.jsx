import Card, { CardHeader } from '../ui/Card'
import Badge from '../ui/Badge'
import { useDemoScenario, cameraIdFromSourceName, formatDuration } from '../../context/DemoScenarioContext'

// Shown only once "Start Demo Scenario" (Trajectories page) has produced
// results — reuses the same Card/CardHeader/Badge primitives as the rest of
// this page, no separate analytics architecture.
export default function DemoAnalyticsSummary() {
  const { detections, summary, isRunning, isCompleted } = useDemoScenario()

  if (!isRunning && !isCompleted) return null

  const camerasInvolved = new Set(detections.map((d) => cameraIdFromSourceName(d.sourceName))).size

  const STATS = [
    { label: 'Total Detections', value: detections.length },
    { label: 'Unique Vehicles', value: detections.length ? 1 : 0 },
    { label: 'Cameras Involved', value: camerasInvolved },
    { label: 'Vehicle Type', value: detections.length ? 'Car' : '—' },
    {
      label: 'Average Confidence',
      value: summary?.avgConfidence != null ? `${Math.round(summary.avgConfidence * 100)}%` : '—',
    },
    { label: 'Journey Duration', value: summary ? formatDuration(summary.journeyDurationMs) : '—' },
    { label: 'Most Active Camera', value: summary?.mostActiveCamera || '—' },
  ]

  return (
    <Card className="mb-5">
      <CardHeader
        title="Demo Scenario Analytics"
        subtitle="Derived from the simulated GJ05AB1234 multi-camera run"
        action={<Badge variant={isCompleted ? 'success' : 'warning'}>{isCompleted ? 'Complete' : 'Running'}</Badge>}
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label}>
            <p className="text-[11px] text-ink-400 uppercase tracking-wide">{s.label}</p>
            <p className="text-sm font-semibold text-ink-900 mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
