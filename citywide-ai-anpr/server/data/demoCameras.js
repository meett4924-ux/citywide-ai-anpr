// Demo camera network for the prototype. No physical cameras or live feeds —
// these are simulated locations used so multi-camera tracking/trajectory
// features have something realistic to work with. Coordinates intentionally
// match the Part 1 frontend mock camera list (client/src/services/mockData.js)
// so the whole app feels like one consistent city network.
export const DEMO_CAMERAS = [
  { cameraId: 'CAM-002', name: 'Sabarmati Bridge East', zone: 'Zone 1 - Central', lat: 23.0281, lng: 72.5811, status: 'online' },
  { cameraId: 'CAM-014', name: 'GIFT City Junction', zone: 'Zone 4 - GIFT City', lat: 23.1610, lng: 72.6850, status: 'online' },
  { cameraId: 'CAM-033', name: 'Infocity Circle', zone: 'Zone 4 - GIFT City', lat: 23.1935, lng: 72.6383, status: 'online' },
  { cameraId: 'CAM-057', name: 'Sector 21 Crossing', zone: 'Zone 2 - Sectors', lat: 23.2020, lng: 72.6420, status: 'degraded' },
  { cameraId: 'CAM-076', name: 'Koba Toll Approach', zone: 'Zone 3 - Highway', lat: 23.2156, lng: 72.6369, status: 'online' },
  { cameraId: 'CAM-091', name: 'Mahatma Mandir Gate', zone: 'Zone 1 - Central', lat: 23.2260, lng: 72.6480, status: 'offline' },
  { cameraId: 'CAM-104', name: 'Adalaj Flyover North', zone: 'Zone 3 - Highway', lat: 23.1660, lng: 72.5850, status: 'online' },
]

export function getCameraById(cameraId) {
  return DEMO_CAMERAS.find((c) => c.cameraId === cameraId) || null
}

export function randomCamera(excludeCameraId) {
  const pool = excludeCameraId ? DEMO_CAMERAS.filter((c) => c.cameraId !== excludeCameraId) : DEMO_CAMERAS
  return pool[Math.floor(Math.random() * pool.length)]
}
