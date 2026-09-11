import { useMemo, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import ListToolbar from '../components/ui/ListToolbar'
import MockDataNotice from '../components/ui/MockDataNotice'
import Badge from '../components/ui/Badge'
import { vehicles } from '../services/mockData'

const FLAG_LABELS = {
  stolen: { label: 'Stolen hotlist', variant: 'danger' },
  overspeed: { label: 'Overspeed', variant: 'warning' },
  'no-helmet': { label: 'No helmet', variant: 'warning' },
}

export default function Vehicles() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return vehicles
    return vehicles.filter((v) => v.plate.toLowerCase().includes(q) || v.type.toLowerCase().includes(q))
  }, [query])

  return (
    <div>
      <PageHeader
        title="Vehicle Detections"
        description="Recently recognized number plates across the ANPR camera network, with flags for hotlisted or violating vehicles."
      />

      <Card padded={false}>
        <div className="p-5 pb-0">
          <MockDataNotice text="Plate recognition results shown here are sample records. Live ANPR detections will populate this table once the recognition engine is connected." />
          <ListToolbar searchPlaceholder="Search by plate number or vehicle type..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-500 border-y border-surface-border bg-surface-muted">
                <th className="px-5 py-2.5 font-medium">Plate number</th>
                <th className="px-5 py-2.5 font-medium">Type</th>
                <th className="px-5 py-2.5 font-medium">Color</th>
                <th className="px-5 py-2.5 font-medium">Last seen camera</th>
                <th className="px-5 py-2.5 font-medium">Last seen</th>
                <th className="px-5 py-2.5 font-medium">Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((v) => {
                const flag = FLAG_LABELS[v.flag]
                return (
                  <tr key={v.plate} className="hover:bg-surface-muted/60">
                    <td className="px-5 py-3 font-medium text-ink-900 data-mono tracking-wide">{v.plate}</td>
                    <td className="px-5 py-3 text-ink-700">{v.type}</td>
                    <td className="px-5 py-3 text-ink-700">{v.color}</td>
                    <td className="px-5 py-3 text-ink-700 data-mono">{v.lastSeenCamera}</td>
                    <td className="px-5 py-3 text-ink-500">{v.lastSeenTime}</td>
                    <td className="px-5 py-3">
                      {flag ? <Badge variant={flag.variant}>{flag.label}</Badge> : <span className="text-ink-400 text-xs">&mdash;</span>}
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink-500">
                    No vehicles match "{query}".
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
