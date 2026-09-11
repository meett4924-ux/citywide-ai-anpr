import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { runDemoScenario as runDemoScenarioApi, resetDemoScenario as resetDemoScenarioApi } from '../services/anprApi'
import { cameras as knownCameras } from '../services/mockData'

// ---------------------------------------------------------------------------
// "START DEMO SCENARIO" — shared state for the SIH jury demo.
//
// This context is the ONLY place demo state lives. The Tracking
// (Trajectories) page owns the Start/Reset controls and the step-by-step
// camera reveal; the Live Map, Traffic Analytics, and Alerts pages read from
// this same context to reflect the scenario, so none of those pages need a
// data layer of their own for this feature.
//
// DEMO MODE — every value produced here is fixed, not random. The primary
// path persists real records through the existing ANPR backend
// (server/services/anpr/demoScenario.js, reusing detectionStore). If the
// backend is unreachable, this falls back to an identical, fully
// client-side simulation so the demo never hard-fails in front of a jury —
// it is always clearly labeled as simulated either way.
// ---------------------------------------------------------------------------

export const DEMO_PLATE = 'GJ05AB1234'
export const DEMO_VEHICLE_TYPE = 'Car'
export const DEMO_VEHICLE_COLOR = 'White'

// Mirrors server/services/anpr/demoScenario.js (id, offset, confidences).
// This small duplication only exists so the demo can still run end-to-end
// entirely client-side if the API is down — it is not a second backend, and
// camera display metadata (name/zone) is NOT duplicated here; it's looked up
// from the existing mockData `cameras` list below.
const FALLBACK_CAMERA_STEPS = [
  { id: 'CAM-002', offsetMs: 0, vehicleConfidence: 0.96, plateConfidence: 0.94, ocrConfidence: 0.92 },
  { id: 'CAM-014', offsetMs: 8 * 60 * 1000, vehicleConfidence: 0.97, plateConfidence: 0.95, ocrConfidence: 0.94 },
  { id: 'CAM-033', offsetMs: 15 * 60 * 1000, vehicleConfidence: 0.98, plateConfidence: 0.96, ocrConfidence: 0.95 },
]

// Presentation timing (ms from Start). Matches the requested pacing:
// 0-3s CAM-002, 3-5s ANPR, 5-8s CAM-014, 8-11s CAM-033, 11-15s tracking/analytics.
const TIMELINE_MS = {
  CAM_002_DETECTED: 1800,
  ANPR_PROCESSING: 3600,
  CAM_014_DETECTED: 6800,
  CAM_033_DETECTED: 9800,
  TRACKING: 12200,
  ANALYTICS: 13400,
  COMPLETED: 15000,
}

export function cameraIdFromSourceName(sourceName = '') {
  return sourceName.split(' - ')[0]
}

export function lookupCamera(cameraId) {
  return knownCameras.find((c) => c.id === cameraId) || null
}

export function buildFallbackResults() {
  const now = Date.now()
  return FALLBACK_CAMERA_STEPS.map((step) => {
    const cam = lookupCamera(step.id)
    return {
      _id: `local-${step.id}-${now}`,
      plateNumber: DEMO_PLATE,
      vehicleType: DEMO_VEHICLE_TYPE,
      vehicleColor: DEMO_VEHICLE_COLOR,
      vehicleConfidence: step.vehicleConfidence,
      plateConfidence: step.plateConfidence,
      ocrConfidence: step.ocrConfidence,
      sourceType: 'camera',
      sourceName: `${step.id} - ${cam?.name || step.id}`,
      imageUrl: null,
      plateImageUrl: null,
      processingStatus: 'completed',
      processingMode: 'demo',
      timestamp: new Date(now + step.offsetMs).toISOString(),
    }
  })
}

export function buildSummary(detections) {
  if (!detections.length) return null
  const sorted = [...detections].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const confidenceValues = sorted.flatMap((d) => [d.vehicleConfidence, d.plateConfidence, d.ocrConfidence].filter((v) => v != null))
  const avgConfidence = confidenceValues.length
    ? confidenceValues.reduce((sum, v) => sum + v, 0) / confidenceValues.length
    : null

  const perCameraCounts = {}
  sorted.forEach((d) => {
    const id = cameraIdFromSourceName(d.sourceName)
    perCameraCounts[id] = (perCameraCounts[id] || 0) + 1
  })
  const maxCount = Math.max(...Object.values(perCameraCounts))
  const busiest = Object.entries(perCameraCounts)
    .filter(([, count]) => count === maxCount)
    .map(([id]) => id)

  return {
    plate: sorted[0].plateNumber,
    vehicleType: sorted[0].vehicleType,
    vehicleColor: sorted[0].vehicleColor,
    detections: sorted,
    cameraIds: sorted.map((d) => cameraIdFromSourceName(d.sourceName)),
    firstSeen: cameraIdFromSourceName(first.sourceName),
    lastSeen: cameraIdFromSourceName(last.sourceName),
    detectionCount: sorted.length,
    journeyDurationMs: new Date(last.timestamp) - new Date(first.timestamp),
    avgConfidence,
    mostActiveCamera:
      busiest.length > 1
        ? `Tied across ${busiest.length} cameras (${maxCount} detection${maxCount > 1 ? 's' : ''} each)`
        : `${busiest[0]} (${maxCount} detection${maxCount > 1 ? 's' : ''})`,
  }
}

// Approximate straight-line distance (km) along a path of known camera IDs,
// using the same lat/lng already present in mockData `cameras` — avoids
// inventing a separate distance figure or a new geo dataset.
export function pathDistanceKm(cameraIds = []) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const haversine = (a, b) => {
    const R = 6371
    const dLat = toRad(b.lat - a.lat)
    const dLng = toRad(b.lng - a.lng)
    const h =
      Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  }

  let total = 0
  for (let i = 0; i < cameraIds.length - 1; i++) {
    const a = lookupCamera(cameraIds[i])
    const b = lookupCamera(cameraIds[i + 1])
    if (a && b) total += haversine(a, b)
  }
  return Math.round(total * 10) / 10
}

export function formatDuration(ms) {
  if (!ms || ms <= 0) return '0 min'
  const totalMinutes = Math.round(ms / 60000)
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h > 0) return `${h}h ${m}m`
  return `${m} min`
}

const DemoScenarioContext = createContext(null)

export function DemoScenarioProvider({ children }) {
  const [status, setStatus] = useState('idle') // idle | running | completed | error
  const [stage, setStage] = useState('idle')
  const [detections, setDetections] = useState([])
  const [summary, setSummary] = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const [error, setError] = useState(null)

  const timers = useRef([])
  const resultsRef = useRef([])
  const statusRef = useRef('idle')

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t))
    timers.current = []
  }, [])

  const schedule = useCallback((ms, fn) => {
    timers.current.push(setTimeout(fn, ms))
  }, [])

  const start = useCallback(async () => {
    // Guard: never run two scenarios at once.
    if (statusRef.current === 'running') return

    statusRef.current = 'running'
    setStatus('running')
    setStage('cam-002')
    setError(null)
    setDetections([])
    setSummary(null)
    clearTimers()

    let results
    let fallback = false
    try {
      const data = await runDemoScenarioApi()
      results = data.results
    } catch (apiErr) {
      // Graceful degradation: backend/API unavailable. Run the identical
      // scenario fully client-side rather than failing the demo.
      fallback = true
      results = buildFallbackResults()
    }

    if (!results || results.length < 3) {
      // Missing demo data — fail gracefully instead of a broken UI.
      statusRef.current = 'error'
      setStatus('error')
      setStage('idle')
      setError('Could not load demo scenario data. Please try again.')
      return
    }

    setUsingFallback(fallback)
    resultsRef.current = results

    schedule(TIMELINE_MS.CAM_002_DETECTED, () => {
      setDetections([results[0]])
    })
    schedule(TIMELINE_MS.ANPR_PROCESSING, () => {
      setStage('anpr-processing')
    })
    schedule(TIMELINE_MS.CAM_014_DETECTED, () => {
      setStage('cam-014')
      setDetections([results[0], results[1]])
    })
    schedule(TIMELINE_MS.CAM_033_DETECTED, () => {
      setStage('cam-033')
      setDetections([results[0], results[1], results[2]])
    })
    schedule(TIMELINE_MS.TRACKING, () => {
      setStage('tracking')
    })
    schedule(TIMELINE_MS.ANALYTICS, () => {
      setStage('analytics')
    })
    schedule(TIMELINE_MS.COMPLETED, () => {
      setStage('completed')
      statusRef.current = 'completed'
      setStatus('completed')
      setSummary(buildSummary(resultsRef.current))
    })
  }, [clearTimers, schedule])

  // "■ STOP DEMO" — halts the running timeline in place (whatever has been
  // revealed so far stays visible) without discarding the already-persisted
  // detections the way Reset does. Distinct from reset(): stop is "pause the
  // presentation", reset is "clear everything, including backend records".
  const stop = useCallback(() => {
    if (statusRef.current !== 'running') return
    clearTimers()
    statusRef.current = 'stopped'
    setStatus('stopped')
  }, [clearTimers])

  const reset = useCallback(async () => {
    // Safe to call at any time, including mid-run (per the "reset while
    // running" case): stop the timeline first, then clear all state.
    clearTimers()
    statusRef.current = 'idle'
    setStatus('idle')
    setStage('idle')
    setDetections([])
    setSummary(null)
    setError(null)
    setUsingFallback(false)
    resultsRef.current = []

    // Best-effort backend cleanup — never blocks or breaks the UI reset.
    try {
      await resetDemoScenarioApi()
    } catch {
      // Backend unreachable or nothing to clean up server-side; local state
      // is already cleared above, so this is safe to ignore.
    }
  }, [clearTimers])

  const value = {
    status,
    stage,
    detections,
    summary,
    usingFallback,
    error,
    isRunning: status === 'running',
    isStopped: status === 'stopped',
    isCompleted: status === 'completed',
    hasStarted: status !== 'idle',
    start,
    stop,
    reset,
  }

  return <DemoScenarioContext.Provider value={value}>{children}</DemoScenarioContext.Provider>
}

export function useDemoScenario() {
  const ctx = useContext(DemoScenarioContext)
  if (!ctx) throw new Error('useDemoScenario must be used within a DemoScenarioProvider')
  return ctx
}
