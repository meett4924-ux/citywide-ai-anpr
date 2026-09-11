import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, MapPin, Search } from 'lucide-react'
import Card, { CardHeader } from '../ui/Card'
import Badge from '../ui/Badge'
import { fetchByPlate } from '../../services/anprApi'
import {
  DEMO_PLATE,
  buildFallbackResults,
  buildSummary,
  cameraIdFromSourceName,
  lookupCamera,
  formatDuration,
} from '../../context/DemoScenarioContext'

function normalizePlateInput(raw = '') {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

// Lenient on purpose: this only gates "does this look like a plate at all"
// before spending a network round trip — the backend's own plateValidator
// (server/services/anpr/plateValidator.js) already does the stricter
// format/confidence scoring for actual OCR results.
function looksLikePlate(normalized) {
  return normalized.length >= 4 && normalized.length <= 12
}

// "NUMBER PLATE SEARCH" — SIH jury demo feature.
//
// Reuses the existing GET /api/anpr/plate/:plateNumber endpoint (already
// built for the ANPR history feature) — no new backend endpoint. If that
// returns no persisted detections yet for the known demo plate (e.g. no one
// has run Start Demo Scenario or Process Video in this session), this falls
// back to the exact same deterministic dataset those two features already
// use, so search works as a standalone entry point too. Any other plate
// with no matches is reported as not found — never fabricated.
export default function PlateSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [state, setState] = useState('idle') // idle | invalid | loading | found | not_found | error
  const [result, setResult] = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const [searchedPlate, setSearchedPlate] = useState('')

  async function runSearch(normalized) {
    setState('loading')
    setResult(null)

    try {
      const data = await fetchByPlate(normalized)
      if (data.results?.length) {
        setResult(buildSummary(data.results))
        setUsingFallback(false)
        setState('found')
        return
      }
      if (normalized === DEMO_PLATE) {
        setResult(buildSummary(buildFallbackResults()))
        setUsingFallback(true)
        setState('found')
        return
      }
      setState('not_found')
    } catch (err) {
      // Backend unreachable — still honor the deterministic demo plate so
      // the jury demo never dead-ends on a network hiccup.
      if (normalized === DEMO_PLATE) {
        setResult(buildSummary(buildFallbackResults()))
        setUsingFallback(true)
        setState('found')
        return
      }
      setState('error')
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const normalized = normalizePlateInput(query)
    setSearchedPlate(normalized)

    if (!normalized) {
      setState('idle')
      return
    }
    if (!looksLikePlate(normalized)) {
      setState('invalid')
      return
    }
    runSearch(normalized)
  }

  function handleViewOnMap() {
    if (!result) return
    navigate('/map', { state: { plate: result.plate, cameraIds: result.cameraIds } })
  }

  return (
    <Card className="mb-5">
      <CardHeader title="Number Plate Search" subtitle="Look up a plate to see its detection history and trajectory" />

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. GJ05AB1234"
          className="flex-1 rounded-md border border-surface-border bg-white px-3.5 py-2.5 text-sm data-mono uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
        />
        <button type="submit" disabled={state === 'loading'} className="btn-primary shrink-0">
          <Search size={15} /> Search
        </button>
      </form>

      {state === 'invalid' && (
        <p className="text-xs text-danger-600 mt-2">
          Enter a valid plate number (letters and digits only, e.g. GJ05AB1234).
        </p>
      )}

      {state === 'loading' && <p className="text-sm text-ink-500 mt-4">Searching...</p>}

      {state === 'error' && (
        <div className="mt-4 rounded-md bg-danger-50 text-danger-600 text-sm px-3.5 py-2.5">
          Unable to reach the server right now. Please try again.
        </div>
      )}

      {state === 'not_found' && (
        <div className="mt-4 rounded-md bg-surface-muted text-ink-500 text-sm px-3.5 py-2.5">
          No vehicle detections found for this number plate.{' '}
          {searchedPlate && <span className="data-mono">({searchedPlate})</span>}
        </div>
      )}

      {state === 'found' && result && (
        <div className="mt-5">
          {usingFallback && (
            <div className="mb-4 rounded-md bg-warning-50 text-warning-600 text-xs px-3.5 py-2.5">
              No live detections were on record yet for this plate — showing the deterministic demo dataset for{' '}
              {DEMO_PLATE}.
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-ink-900">Vehicle Information</h3>
            <Badge variant="brand">Demo vehicle</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-5 border-b border-surface-border">
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">Plate</p>
              <p className="text-sm font-semibold text-ink-900 data-mono mt-0.5">{result.plate}</p>
            </div>
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">Vehicle Type</p>
              <p className="text-sm font-semibold text-ink-900 mt-0.5">{result.vehicleType}</p>
            </div>
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">Color</p>
              <p className="text-sm font-semibold text-ink-900 mt-0.5">{result.vehicleColor}</p>
            </div>
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">Average Confidence</p>
              <p className="text-sm font-semibold text-success-600 mt-0.5">
                {result.avgConfidence != null ? `${Math.round(result.avgConfidence * 100)}%` : '—'}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">Detection Count</p>
              <p className="text-sm font-semibold text-ink-900 mt-0.5">{result.detectionCount}</p>
            </div>
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">First Seen</p>
              <p className="text-sm font-semibold text-ink-900 data-mono mt-0.5">{result.firstSeen}</p>
            </div>
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">Last Seen</p>
              <p className="text-sm font-semibold text-ink-900 data-mono mt-0.5">{result.lastSeen}</p>
            </div>
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">Journey Duration</p>
              <p className="text-sm font-semibold text-ink-900 mt-0.5">{formatDuration(result.journeyDurationMs)}</p>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-ink-900 mt-5 mb-3">Detection History</h3>
          <div className="space-y-3">
            {result.detections.map((d, idx) => {
              const id = cameraIdFromSourceName(d.sourceName)
              const camera = lookupCamera(id)
              return (
                <div key={`${id}-${idx}`} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-600 mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900 data-mono">{id}</p>
                    <p className="text-xs text-ink-500">
                      {camera?.name || id} · {camera?.zone || '—'}
                    </p>
                    <p className="text-xs text-ink-400 mt-0.5">{new Date(d.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <h3 className="text-sm font-semibold text-ink-900 mt-5 mb-3">Vehicle Trajectory</h3>
          <div className="flex items-center flex-wrap gap-2 mb-4">
            {result.cameraIds.map((id, idx) => (
              <span key={id} className="flex items-center gap-2">
                <span className="badge badge-neutral data-mono">{id}</span>
                {idx < result.cameraIds.length - 1 && <ArrowRight size={14} className="text-ink-400" />}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">First Camera</p>
              <p className="text-sm font-semibold text-ink-900 data-mono mt-0.5">{result.firstSeen}</p>
            </div>
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">Last Camera</p>
              <p className="text-sm font-semibold text-ink-900 data-mono mt-0.5">{result.lastSeen}</p>
            </div>
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">Cameras Visited</p>
              <p className="text-sm font-semibold text-ink-900 mt-0.5">{new Set(result.cameraIds).size}</p>
            </div>
            <div>
              <p className="text-[11px] text-ink-400 uppercase tracking-wide">Detection Count</p>
              <p className="text-sm font-semibold text-ink-900 mt-0.5">{result.detectionCount}</p>
            </div>
          </div>

          <button onClick={handleViewOnMap} className="btn-secondary">
            <MapPin size={15} /> View on Map
          </button>
          <p className="text-xs text-ink-500 mt-2">
            Demo scenario — multi-camera movement is simulated. The map will highlight a{' '}
            <span className="font-medium text-ink-700">simulated vehicle trajectory</span>, not real GPS tracking.
          </p>
        </div>
      )}
    </Card>
  )
}
