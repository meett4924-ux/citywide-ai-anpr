import * as detectionStore from '../services/anpr/detectionStore.js'
import { normalizePlate } from '../services/anpr/plateValidator.js'
import { buildJourney } from '../services/tracking/journeyBuilder.js'

// GET /api/tracking?plate=partial&limit=20
// Returns a browsable list of distinct vehicles seen so far, most-recent first.
export async function listTrackedVehicles(req, res) {
  const all = await detectionStore.getAll()
  const search = req.query.plate ? normalizePlate(req.query.plate) : ''
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100)

  const byPlate = new Map()
  for (const d of all) {
    if (!byPlate.has(d.plateNumber)) byPlate.set(d.plateNumber, [])
    byPlate.get(d.plateNumber).push(d)
  }

  let vehicles = [...byPlate.entries()]
    .filter(([plate]) => !search || plate.includes(search))
    .map(([plate, detections]) => {
      const sorted = detections.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      const latest = sorted[0]
      return {
        plateNumber: plate,
        vehicleType: latest.vehicleType,
        vehicleColor: latest.vehicleColor,
        detectionCount: detections.length,
        camerasVisited: [...new Set(detections.map((d) => d.cameraId).filter(Boolean))].length,
        lastCameraId: latest.cameraId,
        lastCameraName: latest.cameraName,
        lastSeen: latest.timestamp,
        flagged: detections.some((d) => d.flag),
      }
    })
    .sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen))
    .slice(0, limit)

  res.status(200).json({ success: true, count: vehicles.length, vehicles })
}

// GET /api/tracking/:plateNumber
export async function getVehicleJourney(req, res) {
  const normalized = normalizePlate(req.params.plateNumber)
  if (!normalized) {
    return res.status(400).json({ message: 'Provide a plate number to search for.' })
  }

  const detections = await detectionStore.getByPlate(normalized)
  const journey = buildJourney(normalized, detections)

  if (!journey) {
    return res.status(404).json({ message: `No detections found for plate ${normalized}.` })
  }

  res.status(200).json({ success: true, journey })
}
