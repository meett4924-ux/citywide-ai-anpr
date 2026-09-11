import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Tooltip } from 'react-leaflet'
import { cameras } from '../../services/mockData'
import { useDemoScenario, cameraIdFromSourceName, DEMO_PLATE } from '../../context/DemoScenarioContext'

const STATUS_COLORS = {
  online: '#16a34a',
  degraded: '#d97706',
  offline: '#dc2626',
}

const DEMO_ROUTE_COLOR = '#1e54d6' // brand-600

const DEFAULT_CENTER = [
  Number(import.meta.env.VITE_MAP_DEFAULT_LAT) || 23.2156,
  Number(import.meta.env.VITE_MAP_DEFAULT_LNG) || 72.6369,
]
const DEFAULT_ZOOM = Number(import.meta.env.VITE_MAP_DEFAULT_ZOOM) || 12

// `searchRoute` (optional: { plate, cameraIds }) lets "View on Map" from the
// Number Plate Search feature highlight a specific searched route on demand,
// without this component owning a second tracking/demo implementation —
// it's the same rendering path as the live Demo Scenario route below, just
// fed a different source of camera IDs.
export default function CameraMap({ searchRoute }) {
  // Reflects the shared Demo Scenario state (see DemoScenarioContext) so the
  // Live Map updates as the vehicle "moves" between cameras, without this
  // component owning any demo logic of its own.
  const { detections, isRunning, isCompleted } = useDemoScenario()

  const routeCameraIds = searchRoute?.cameraIds?.length
    ? searchRoute.cameraIds
    : detections.map((d) => cameraIdFromSourceName(d.sourceName))
  const routePlate = searchRoute?.plate || DEMO_PLATE
  const routePositions = routeCameraIds
    .map((id) => cameras.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => [c.lat, c.lng])
  const showRoute = (!!searchRoute?.cameraIds?.length || isRunning || isCompleted) && routePositions.length >= 2

  return (
    <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} scrollWheelZoom className="w-full h-full rounded-lg z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cameras.map((cam) => {
        const onDemoRoute = routeCameraIds.includes(cam.id)
        return (
          <CircleMarker
            key={cam.id}
            center={[cam.lat, cam.lng]}
            radius={onDemoRoute ? 11 : 9}
            pathOptions={{
              color: onDemoRoute ? DEMO_ROUTE_COLOR : STATUS_COLORS[cam.status],
              fillColor: onDemoRoute ? DEMO_ROUTE_COLOR : STATUS_COLORS[cam.status],
              fillOpacity: onDemoRoute ? 0.9 : 0.75,
              weight: onDemoRoute ? 3 : 2,
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-ink-900">{cam.name}</p>
                <p className="text-xs text-ink-500 font-mono">{cam.id}</p>
                <p className="text-xs text-ink-500 mt-1">{cam.zone}</p>
                <p className="text-xs mt-1 capitalize">
                  Status: <span className="font-medium">{cam.status}</span>
                </p>
                {onDemoRoute && (
                  <p className="text-xs mt-1.5 font-medium text-brand-700">
                    Demo vehicle {routePlate} detected here (simulated)
                  </p>
                )}
              </div>
            </Popup>
          </CircleMarker>
        )
      })}

      {showRoute && (
        <Polyline
          positions={routePositions}
          pathOptions={{ color: DEMO_ROUTE_COLOR, weight: 3, dashArray: '6 6' }}
        >
          <Tooltip permanent direction="center" className="!bg-brand-600 !text-white !border-0 !text-[10px] !font-medium">
            SIMULATED VEHICLE TRAJECTORY — {routePlate}
          </Tooltip>
        </Polyline>
      )}
    </MapContainer>
  )
}
