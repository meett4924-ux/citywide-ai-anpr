import PageHeader from '../components/layout/PageHeader'
import Card, { CardHeader } from '../components/ui/Card'
import TrafficVolumeChart from '../components/dashboard/TrafficVolumeChart'
import { DetectionsByCameraChart, VehicleClassChart } from '../components/dashboard/AnalyticsCharts'
import MockDataNotice from '../components/ui/MockDataNotice'

const ZONE_STATS = [
  { zone: 'Zone 1 - Central', avgSpeed: '32 km/h', peakHour: '18:00 - 19:00', volume: '12,410', congestion: 'High' },
  { zone: 'Zone 2 - Sectors', avgSpeed: '41 km/h', peakHour: '08:00 - 09:00', volume: '9,860', congestion: 'Moderate' },
  { zone: 'Zone 3 - Highway', avgSpeed: '58 km/h', peakHour: '19:00 - 20:00', volume: '15,220', congestion: 'Moderate' },
  { zone: 'Zone 4 - GIFT City', avgSpeed: '36 km/h', peakHour: '09:00 - 10:00', volume: '10,730', congestion: 'High' },
]

const CONGESTION_VARIANT = { High: 'danger', Moderate: 'warning', Low: 'success' }

export default function TrafficAnalytics() {
  return (
    <div>
      <PageHeader
        title="Traffic Analytics"
        description="City-wide traffic flow patterns derived from ANPR detection volume across zones."
      />

      <MockDataNotice text="Charts and zone metrics use representative sample data pending live camera integration." />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        <div className="xl:col-span-2">
          <TrafficVolumeChart />
        </div>
        <VehicleClassChart />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <DetectionsByCameraChart />

        <Card padded={false}>
          <div className="p-5 pb-0">
            <CardHeader title="Zone-wise Summary" subtitle="Average speed, peak hours and congestion level" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-500 border-y border-surface-border bg-surface-muted">
                  <th className="px-5 py-2.5 font-medium">Zone</th>
                  <th className="px-5 py-2.5 font-medium">Avg. speed</th>
                  <th className="px-5 py-2.5 font-medium">Peak hour</th>
                  <th className="px-5 py-2.5 font-medium">Congestion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {ZONE_STATS.map((z) => (
                  <tr key={z.zone} className="hover:bg-surface-muted/60">
                    <td className="px-5 py-3 font-medium text-ink-900">{z.zone}</td>
                    <td className="px-5 py-3 text-ink-700 data-mono">{z.avgSpeed}</td>
                    <td className="px-5 py-3 text-ink-700 data-mono">{z.peakHour}</td>
                    <td className="px-5 py-3">
                      <span className={`badge badge-${CONGESTION_VARIANT[z.congestion]}`}>{z.congestion}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
