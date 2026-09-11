import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import { CameraStatusBadge } from '../components/ui/Badge'
import MockDataNotice from '../components/ui/MockDataNotice'
import CameraMap from '../components/map/CameraMap'
import { cameras } from '../services/mockData'

export default function MapView() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Live Camera Map"
        description="Geographic view of every camera on the network, color-coded by connectivity status."
      />

      <MockDataNotice text="Camera coordinates are sample locations for layout purposes; live geodata will replace these once cameras are provisioned." />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-5 min-h-[520px]">
        <Card className="lg:col-span-3 !p-2 h-[520px] lg:h-auto">
          <CameraMap />
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
