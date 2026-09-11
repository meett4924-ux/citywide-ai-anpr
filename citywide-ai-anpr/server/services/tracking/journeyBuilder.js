// Turns a flat list of Detection records for one plate into a readable
// "journey": ordered camera path, first/last sighting, duration, etc.
// This is a prototype cross-camera association, not a real re-identification
// system — it simply trusts that the plate number is the same vehicle.
export function buildJourney(plateNumber, detections) {
  const sorted = [...detections].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  if (sorted.length === 0) {
    return null
  }

  const path = sorted.map((d) => ({
    cameraId: d.cameraId,
    cameraName: d.cameraName,
    location: d.location,
    timestamp: d.timestamp,
    vehicleType: d.vehicleType,
    vehicleColor: d.vehicleColor,
    ocrConfidence: d.ocrConfidence,
    simulated: Boolean(d.simulated),
  }))

  // Unique cameras visited, in first-seen order.
  const camerasVisited = []
  for (const p of path) {
    if (p.cameraId && !camerasVisited.includes(p.cameraId)) camerasVisited.push(p.cameraId)
  }

  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const durationMinutes = Math.max(
    0,
    Math.round((new Date(last.timestamp) - new Date(first.timestamp)) / 60000),
  )

  return {
    plateNumber,
    vehicleType: first.vehicleType,
    vehicleColor: first.vehicleColor,
    detectionCount: sorted.length,
    camerasVisited,
    firstCameraId: first.cameraId,
    lastCameraId: last.cameraId,
    firstDetectionTime: first.timestamp,
    lastDetectionTime: last.timestamp,
    journeyDurationMinutes: durationMinutes,
    path,
    flagged: sorted.some((d) => d.flag),
    hasSimulatedDetections: sorted.some((d) => d.simulated),
  }
}
