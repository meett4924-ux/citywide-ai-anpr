import { ArrowRight, Camera as CameraIcon, PlayCircle, RotateCcw, ScanLine, StopCircle } from 'lucide-react'
import Card, { CardHeader } from '../ui/Card'
import Badge, { CameraStatusBadge } from '../ui/Badge'
import MockDataNotice from '../ui/MockDataNotice'
import ResultCard from '../anpr/ResultCard'
import ProcessingSteps from '../anpr/ProcessingSteps'
import { classNames } from '../../utils/formatters'
import {
  useDemoScenario,
  cameraIdFromSourceName,
  lookupCamera,
  formatDuration,
} from '../../context/DemoScenarioContext'

const STAGE_ORDER = ['idle', 'cam-002', 'anpr-processing', 'cam-014', 'cam-033', 'tracking', 'analytics', 'completed']
const stageIndex = (s) => STAGE_ORDER.indexOf(s)

const TIMELINE_STEPS = [
  { key: 'cam-002', label: 'CAM-002' },
  { key: 'anpr-processing', label: 'ANPR' },
  { key: 'cam-014', label: 'CAM-014' },
  { key: 'cam-033', label: 'CAM-033' },
  { key: 'tracking', label: 'Trajectory' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'completed', label: 'Complete' },
]

function TimelineIndicator({ stage }) {
  const current = stageIndex(stage)
  return (
    <div className="flex items-center flex-wrap gap-1.5 mb-4">
      {TIMELINE_STEPS.map((step, idx) => {
        const reached = current >= stageIndex(step.key)
        const active = stage === step.key
        return (
          <span key={step.key} className="flex items-center gap-1.5">
            <span
              className={classNames(
                'px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors',
                active
                  ? 'bg-brand-600 text-white border-brand-600'
                  : reached
                    ? 'bg-brand-50 text-brand-700 border-brand-100'
                    : 'bg-surface-subtle text-ink-400 border-surface-border',
              )}
            >
              {step.label}
            </span>
            {idx < TIMELINE_STEPS.length - 1 && <ArrowRight size={12} className="text-ink-300 shrink-0" />}
          </span>
        )
      })}
    </div>
  )
}

function DemoCameraFeedCard({ cameraId, detection, index }) {
  const camera = lookupCamera(cameraId)

  return (
    <Card>
      <CardHeader
        title={
          <span className="flex items-center gap-2">
            <CameraIcon size={15} className="text-brand-600" />
            <span className="data-mono">{cameraId}</span>
          </span>
        }
        subtitle={`${camera?.name || cameraId} · ${camera?.zone || '—'}`}
        action={<CameraStatusBadge status="online" />}
      />

      {!detection ? (
        <div className="rounded-lg border border-dashed border-surface-border bg-surface-muted h-28 flex flex-col items-center justify-center gap-2 animate-pulse">
          <ScanLine size={20} className="text-ink-400" />
          <p className="text-xs font-medium text-ink-500 tracking-wide">DEMO CAMERA FEED</p>
        </div>
      ) : (
        <ResultCard result={detection} index={index} />
      )}
    </Card>
  )
}

export default function DemoScenarioPanel() {
  const {
    status,
    stage,
    detections,
    summary,
    usingFallback,
    error,
    isRunning,
    isStopped,
    isCompleted,
    hasStarted,
    start,
    stop,
    reset,
  } = useDemoScenario()

  const started = hasStarted
  const showCam002 = started && stageIndex(stage) >= stageIndex('cam-002')
  const showAnpr = stage === 'anpr-processing'
  const showCam014 = started && stageIndex(stage) >= stageIndex('cam-014')
  const showCam033 = started && stageIndex(stage) >= stageIndex('cam-033')
  const showTrajectory = started && stageIndex(stage) >= stageIndex('tracking')

  const byCam = (id) => detections.find((d) => cameraIdFromSourceName(d.sourceName) === id)

  return (
    <Card className="mb-5">
      <CardHeader
        title="Start Demo Scenario"
        subtitle="One vehicle, tracked live across three cameras — built for the jury walkthrough."
        action={
          <div className="flex items-center gap-2">
            <button onClick={reset} disabled={status === 'idle'} className="btn-secondary">
              <RotateCcw size={15} /> Reset Demo
            </button>
            <button onClick={stop} disabled={!isRunning} className="btn-secondary">
              <StopCircle size={15} /> Stop Demo
            </button>
            <button onClick={start} disabled={isRunning} className="btn-primary">
              <PlayCircle size={15} /> {isRunning ? 'Running...' : 'Start Demo Scenario'}
            </button>
          </div>
        }
      />

      <MockDataNotice text="DEMO MODE — Camera feeds and vehicle movement are simulated. This does not represent a live CCTV/RTSP feed." />

      {isStopped && (
        <div className="mb-4 rounded-md bg-surface-muted text-ink-500 text-xs px-3.5 py-2.5">
          Demo stopped at the "{stage}" stage. Press Start to run it again from the beginning, or Reset to clear it.
        </div>
      )}

      {usingFallback && started && (
        <div className="mb-4 rounded-md bg-warning-50 text-warning-600 text-xs px-3.5 py-2.5">
          Backend unreachable — running the scenario fully in the browser with the same demo data.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md bg-danger-50 text-danger-600 text-sm px-3.5 py-2.5">{error}</div>
      )}

      {started && <TimelineIndicator stage={stage} />}

      {!started && (
        <div className="flex flex-col items-center justify-center text-center py-10 text-ink-400">
          <ScanLine size={28} className="mb-2" />
          <p className="text-sm">Click "Start Demo Scenario" to simulate GJ05AB1234 crossing CAM-002 → CAM-014 → CAM-033.</p>
        </div>
      )}

      {started && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-5">
          {showCam002 && <DemoCameraFeedCard cameraId="CAM-002" detection={byCam('CAM-002')} index={0} />}
          {showCam014 && <DemoCameraFeedCard cameraId="CAM-014" detection={byCam('CAM-014')} index={1} />}
          {showCam033 && <DemoCameraFeedCard cameraId="CAM-033" detection={byCam('CAM-033')} index={2} />}
        </div>
      )}

      {showAnpr && (
        <Card className="mb-5">
          <CardHeader title="ANPR Processing" subtitle="Vehicle Detection → Number Plate Detection → OCR → Validation → Result" />
          <ProcessingSteps activeStepIndex={2} />
        </Card>
      )}

      {showTrajectory && (
        <Card className="mb-5">
          <CardHeader
            title="Multi-Camera Association"
            subtitle={`Vehicle ${summary?.plate || 'GJ05AB1234'} · Detection Count ${detections.length}`}
            action={isCompleted ? <Badge variant="success">Same Vehicle: YES</Badge> : <Badge variant="warning">Tracking...</Badge>}
          />
          <div className="flex items-center flex-wrap gap-2 mb-4">
            {detections.map((d, idx) => {
              const id = cameraIdFromSourceName(d.sourceName)
              return (
                <span key={id} className="flex items-center gap-2">
                  <span className="badge badge-neutral data-mono">{id}</span>
                  {idx < detections.length - 1 && <ArrowRight size={14} className="text-ink-400" />}
                </span>
              )
            })}
          </div>

          {isCompleted && summary && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-surface-border">
              <div>
                <p className="text-[11px] text-ink-400 uppercase tracking-wide">First Seen</p>
                <p className="text-sm font-semibold text-ink-900 data-mono mt-0.5">{summary.firstSeen}</p>
              </div>
              <div>
                <p className="text-[11px] text-ink-400 uppercase tracking-wide">Last Seen</p>
                <p className="text-sm font-semibold text-ink-900 data-mono mt-0.5">{summary.lastSeen}</p>
              </div>
              <div>
                <p className="text-[11px] text-ink-400 uppercase tracking-wide">Journey Duration</p>
                <p className="text-sm font-semibold text-ink-900 mt-0.5">{formatDuration(summary.journeyDurationMs)}</p>
              </div>
              <div>
                <p className="text-[11px] text-ink-400 uppercase tracking-wide">Avg. Confidence</p>
                <p className="text-sm font-semibold text-success-600 mt-0.5">
                  {summary.avgConfidence != null ? `${Math.round(summary.avgConfidence * 100)}%` : '—'}
                </p>
              </div>
            </div>
          )}
        </Card>
      )}

      {isCompleted && summary && (
        <Card className="border-success-500/30">
          <CardHeader
            title="Demo Scenario Completed"
            subtitle="Simulated data — not live CCTV"
            action={<Badge variant="success">Status: DEMO COMPLETE</Badge>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">Vehicle</p>
              <p className="font-semibold text-ink-900 data-mono mt-0.5">{summary.plate}</p>
              <p className="text-ink-500 text-xs mt-0.5">{summary.vehicleType} · {summary.vehicleColor}</p>
            </div>
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">Cameras Visited</p>
              <p className="font-semibold text-ink-900 mt-0.5">{summary.detectionCount}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[11px] text-ink-400 uppercase tracking-wide mb-1.5">Trajectory</p>
              <div className="flex items-center flex-wrap gap-2">
                {summary.cameraIds.map((id, idx) => (
                  <span key={id} className="flex items-center gap-2">
                    <span className="text-ink-700">{lookupCamera(id)?.name || id}</span>
                    {idx < summary.cameraIds.length - 1 && <ArrowRight size={14} className="text-ink-400" />}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </Card>
  )
}
