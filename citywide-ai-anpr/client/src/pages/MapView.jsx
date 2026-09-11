import { useLocation } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import { CameraStatusBadge } from '../components/ui/Badge'
import MockDataNotice from '../components/ui/MockDataNotice'
import CameraMap from '../components/map/CameraMap'
import { useDemoScenario, DEMO_PLATE } from '../context/DemoScenarioContext'
import { cameras } from '../services/mockData'

export default function MapView() {
  const { isRunning, isCompleted } = useDemoScenario()
  // Set only when arriving via "View on Map" from Number Plate Search
  // (see components/anpr/PlateSearch.jsx) — otherwise CameraMap falls back
  // to the live Demo Scenario route, same as before.
  const location = useLocation()
  const searchRoute = location.state?.cameraIds?.length ? location.state : null

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Live Camera Map"
        description="Geographic view of every camera on the network, color-coded by connectivity status."
      />

      <MockDataNotice text="Camera coordinates are sample locations for layout purposes; live geodata will replace these once cameras are provisioned." />

      {searchRoute ? (
        <MockDataNotice
          text={`SIMULATED VEHICLE TRAJECTORY — showing the searched plate ${searchRoute.plate || DEMO_PLATE}'s route. Multi-camera movement is simulated, not real GPS tracking.`}
        />
      ) : (
        (isRunning || isCompleted) && (
          <MockDataNotice text="DEMO MODE — the highlighted route shows a simulated vehicle trajectory (GJ05AB1234), not real GPS tracking. Start/reset it from the Trajectories page." />
        )
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-5 min-h-[520px]">
        <Card className="lg:col-span-3 !p-2 h-[520px] lg:h-auto">
          <CameraMap searchRoute={searchRoute} />
        </Card>

        <Card padded={false} className="flex flex-col h-[520px] lg:h-auto overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-border">
            <p className="text-sm font-semibold text-ink-900">Cameras ({cameras.length})</p>
          </div>
          <ul className="overflow-y-auto divide-y divide-surface-border flex-1">
            {cameras.map((cam) => (
              <li key={cam.id} className="px-5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink-900 truncate">{cam.name}</p>
                  <CameraStatusBadge status={cam.status} />
                </div>
                <p className="text-xs text-ink-500 data-mono mt-0.5">{cam.id} &middot; {cam.zone}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
