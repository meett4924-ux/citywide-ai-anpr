import PageHeader from '../components/layout/PageHeader'
import StatCard from '../components/dashboard/StatCard'
import TrafficVolumeChart from '../components/dashboard/TrafficVolumeChart'
import { DetectionsByCameraChart, VehicleClassChart } from '../components/dashboard/AnalyticsCharts'
import RecentAlertsCard from '../components/dashboard/RecentAlertsCard'
import CameraStatusCard from '../components/dashboard/CameraStatusCard'
import { kpiSummary } from '../services/mockData'

export default function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Operations Overview"
        description="Real-time snapshot of camera network health, traffic flow, and active alerts across the city."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {kpiSummary.map((kpi) => (
          <StatCard key={kpi.id} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        <div className="xl:col-span-2">
          <TrafficVolumeChart />
        </div>
        <VehicleClassChart />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <DetectionsByCameraChart />
        <RecentAlertsCard />
        <CameraStatusCard />
      </div>
    </div>
  )
}
