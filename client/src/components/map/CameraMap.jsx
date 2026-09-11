import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { cameras } from '../../services/mockData'

const STATUS_COLORS = {
  online: '#16a34a',
  degraded: '#d97706',
  offline: '#dc2626',
}

const DEFAULT_CENTER = [
  Number(import.meta.env.VITE_MAP_DEFAULT_LAT) || 23.2156,
  Number(import.meta.env.VITE_MAP_DEFAULT_LNG) || 72.6369,
]
const DEFAULT_ZOOM = Number(import.meta.env.VITE_MAP_DEFAULT_ZOOM) || 12

export default function CameraMap() {
  return (
    <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} scrollWheelZoom className="w-full h-full rounded-lg z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cameras.map((cam) => (
        <CircleMarker
          key={cam.id}
          center={[cam.lat, cam.lng]}
          radius={9}
          pathOptions={{
            color: STATUS_COLORS[cam.status],
            fillColor: STATUS_COLORS[cam.status],
            fillOpacity: 0.75,
            weight: 2,
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
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
