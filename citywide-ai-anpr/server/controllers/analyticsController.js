import * as detectionStore from '../services/anpr/detectionStore.js'
import { DEMO_CAMERAS } from '../data/demoCameras.js'
import { buildJourney } from '../services/tracking/journeyBuilder.js'

// Simple prototype heuristic — NOT an official traffic measurement. Buckets
// a detection count into a congestion label for demo purposes only.
function congestionLevel(count) {
  if (count >= 6) return 'HIGH'
  if (count >= 3) return 'MEDIUM'
  return 'LOW'
}

// GET /api/analytics
export async function getAnalytics(req, res) {
  const all = await detectionStore.getAll()

  const totalDetections = all.length
  const uniquePlates = new Set(all.map((d) => d.plateNumber))
  const uniqueVehicles = uniquePlates.size

  const vehicleTypeDistribution = {}
  const cameraCounts = {}
  const hourlyBuckets = Array.from({ length: 24 }, () => 0)
  let confidenceSum = 0
  let confidenceCount = 0

  for (const d of all) {
    vehicleTypeDistribution[d.vehicleType] = (vehicleTypeDistribution[d.vehicleType] || 0) + 1
    if (d.cameraId) cameraCounts[d.cameraId] = (cameraCounts[d.cameraId] || 0) + 1
    if (d.ocrConfidence != null) {
      confidenceSum += d.ocrConfidence
      confidenceCount += 1
    }
    const hour = new Date(d.timestamp).getHours()
    hourlyBuckets[hour] += 1
  }

  const cameraActivity = DEMO_CAMERAS.map((cam) => ({
    cameraId: cam.cameraId,
    cameraName: cam.name,
    zone: cam.zone,
    detectionCount: cameraCounts[cam.cameraId] || 0,
    congestion: congestionLevel(cameraCounts[cam.cameraId] || 0),
  })).sort((a, b) => b.detectionCount - a.detectionCount)

  const mostActiveCamera = cameraActivity.find((c) => c.detectionCount > 0) || null
  const overallCongestion = mostActiveCamera ? congestionLevel(mostActiveCamera.detectionCount) : 'LOW'

  // Average journey duration across vehicles seen at more than one camera.
  const byPlate = new Map()
  for (const d of all) {
    if (!byPlate.has(d.plateNumber)) byPlate.set(d.plateNumber, [])
    byPlate.get(d.plateNumber).push(d)
  }
  const journeys = [...byPlate.entries()]
    .map(([plate, dets]) => buildJourney(plate, dets))
    .filter((j) => j && j.camerasVisited.length > 1)
  const avgJourneyDurationMinutes = journeys.length
    ? Math.round(journeys.reduce((sum, j) => sum + j.journeyDurationMinutes, 0) / journeys.length)
    : null

  res.status(200).json({
    success: true,
    analytics: {
      totalDetections,
      uniqueVehicles,
      vehicleTypeDistribution,
      cameraActivity,
      mostActiveCamera,
      overallCongestion,
      trafficByHour: hourlyBuckets.map((count, hour) => ({ hour, count })),
      avgOcrConfidence: confidenceCount ? confidenceSum / confidenceCount : null,
      avgJourneyDurationMinutes,
      recentDetections: all.slice(0, 8),
    },
  })
}
