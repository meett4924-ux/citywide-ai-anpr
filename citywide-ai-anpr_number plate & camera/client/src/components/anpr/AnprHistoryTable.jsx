import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, Trash2 } from 'lucide-react'
import Card, { CardHeader } from '../ui/Card'
import Badge from '../ui/Badge'
import ListToolbar from '../ui/ListToolbar'
import { fetchResults, deleteResult } from '../../services/anprApi'
import { useToast } from '../../context/ToastContext'

const VEHICLE_TYPES = ['Car', 'Two-wheeler', 'Bus', 'Truck', 'Other']
const STATUSES = ['completed', 'failed']
const PAGE_SIZE = 8

export default function AnprHistoryTable({ refreshKey }) {
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchResults({
        page,
        limit: PAGE_SIZE,
        plate: query || undefined,
        vehicleType: vehicleType || undefined,
        processingStatus: status || undefined,
      })
      setRows(data.results)
      setTotal(data.total)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load ANPR history. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [page, query, vehicleType, status])

  useEffect(() => {
    load()
  }, [load, refreshKey])

  // Reset to page 1 whenever a filter changes.
  useEffect(() => {
    setPage(1)
  }, [query, vehicleType, status])

  async function handleDelete(id) {
    try {
      await deleteResult(id)
      toast.success('Result deleted.')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to delete result.')
    }
  }

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1)

  return (
    <Card padded={false}>
      <div className="p-5 pb-0">
        <CardHeader
          title="ANPR History"
          subtitle={`${total} recorded detection${total === 1 ? '' : 's'}`}
          action={
            <button onClick={load} className="btn-ghost !py-1.5 !px-2.5" aria-label="Refresh">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          }
        />
        <ListToolbar searchPlaceholder="Search by plate number..." value={query} onChange={(e) => setQuery(e.target.value)}>
          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="input !w-auto text-xs py-1.5">
            <option value="">All vehicle types</option>
            {VEHICLE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input !w-auto text-xs py-1.5">
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </ListToolbar>
      </div>

      {error && <div className="mx-5 mb-4 rounded-md bg-danger-50 text-danger-600 text-sm px-3.5 py-2.5">{error}</div>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-ink-500 border-y border-surface-border bg-surface-muted">
              <th className="px-5 py-2.5 font-medium">Plate</th>
              <th className="px-5 py-2.5 font-medium">Type</th>
              <th className="px-5 py-2.5 font-medium">Confidence</th>
              <th className="px-5 py-2.5 font-medium">Source</th>
              <th className="px-5 py-2.5 font-medium">Timestamp</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
              <th className="px-5 py-2.5 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {!loading && rows.map((r) => (
              <tr key={r._id} className="hover:bg-surface-muted/60">
                <td className="px-5 py-3 font-medium text-ink-900 data-mono tracking-wide">{r.plateNumber}</td>
                <td className="px-5 py-3 text-ink-700">{r.vehicleType}</td>
                <td className="px-5 py-3 text-ink-700 data-mono">
                  {r.ocrConfidence != null ? `${Math.round(r.ocrConfidence * 100)}%` : '—'}
                </td>
                <td className="px-5 py-3 text-ink-500 truncate max-w-[160px]">{r.sourceName || '—'}</td>
                <td className="px-5 py-3 text-ink-500">{new Date(r.timestamp).toLocaleString()}</td>
                <td className="px-5 py-3">
                  <Badge variant={r.processingStatus === 'completed' ? 'success' : 'danger'}>{r.processingStatus}</Badge>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="p-1.5 rounded-md text-ink-400 hover:text-danger-600 hover:bg-danger-50"
                    aria-label="Delete result"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && !error && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-ink-500">
                  No ANPR results yet. Process an image or video above to see results here.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-ink-500">Loading...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-border">
          <span className="text-xs text-ink-500">Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="btn-secondary !py-1 !px-3 text-xs disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="btn-secondary !py-1 !px-3 text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}
