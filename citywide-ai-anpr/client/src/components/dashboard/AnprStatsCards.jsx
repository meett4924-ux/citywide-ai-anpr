import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Fingerprint, ScanLine, CalendarClock, Percent } from 'lucide-react'
import Card from '../ui/Card'
import { fetchStats } from '../../services/anprApi'

function StatBlock({ icon: Icon, label, value, loading }) {
  return (
    <Card className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-md bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-ink-500">{label}</p>
        <p className="text-lg font-semibold text-ink-900 mt-0.5">{loading ? '—' : value}</p>
      </div>
    </Card>
  )
}

export default function AnprStatsCards() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchStats()
      .then((data) => {
        if (!cancelled) setStats(data.stats)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Unable to load ANPR statistics.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <Card className="mb-5 text-center text-sm text-ink-500">
        ANPR statistics are unavailable right now. <Link to="/anpr" className="text-brand-600 font-medium">Open ANPR Processing</Link> to get started.
      </Card>
    )
  }

  const hasData = stats && stats.totalVehicles > 0

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-ink-900">ANPR Detections</h2>
        <Link to="/anpr" className="text-xs font-medium text-brand-600 hover:text-brand-700">Open ANPR Processing</Link>
      </div>

      {!loading && !hasData ? (
        <Card className="text-center text-sm text-ink-500 py-8">
          No ANPR detections yet. Process an image or video on the{' '}
          <Link to="/anpr" className="text-brand-600 font-medium">ANPR Processing</Link> page to see stats here.
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatBlock icon={Fingerprint} label="Total Vehicles" value={stats?.totalVehicles ?? 0} loading={loading} />
          <StatBlock icon={ScanLine} label="Total Plates" value={stats?.totalPlates ?? 0} loading={loading} />
          <StatBlock icon={CalendarClock} label="Today's Detections" value={stats?.todayDetections ?? 0} loading={loading} />
          <StatBlock
            icon={Percent}
            label="Avg. OCR Confidence"
            value={stats?.avgOcrConfidence != null ? `${Math.round(stats.avgOcrConfidence * 100)}%` : '—'}
            loading={loading}
          />
        </div>
      )}
    </div>
  )
}
