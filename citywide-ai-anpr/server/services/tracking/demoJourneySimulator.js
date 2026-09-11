import { randomCamera } from '../../data/demoCameras.js'

// Given one "primary" detection (the one that came from actually processing
// uploaded media), fabricates 1-3 additional detections of the SAME plate at
// OTHER demo cameras, a few minutes apart. This exists purely so a single
// upload can demonstrate cross-camera tracking/trajectory features without
// requiring the presenter to manually upload multiple files.
//
// Every record this produces is marked `simulated: true` and must be labeled
// as such wherever it's shown — these are not additional real detections of
// anything, they are a scripted demo aid.
function jitterConfidence(value) {
  if (value == null) return null
  const jittered = value + (Math.random() - 0.5) * 0.06
  return Math.max(0.6, Math.min(0.99, Math.round(jittered * 100) / 100))
}

export function simulateCompanionDetections(primary) {
  const companionCount = 1 + Math.floor(Math.random() * 3) // 1-3
  const companions = []
  let previousCameraId = primary.cameraId
  let cursor = new Date(primary.timestamp)

  for (let i = 0; i < companionCount; i++) {
    const camera = randomCamera(previousCameraId)
    cursor = new Date(cursor.getTime() + (4 + Math.random() * 12) * 60000) // +4 to +16 minutes

    companions.push({
      plateNumber: primary.plateNumber,
      vehicleType: primary.vehicleType,
      vehicleColor: primary.vehicleColor,
      vehicleConfidence: jitterConfidence(primary.vehicleConfidence),
      plateConfidence: jitterConfidence(primary.plateConfidence),
      ocrConfidence: jitterConfidence(primary.ocrConfidence),
      cameraId: camera.cameraId,
      cameraName: camera.name,
      location: { lat: camera.lat, lng: camera.lng },
      sourceType: 'camera',
      sourceName: camera.name,
      imageUrl: null,
      plateImageUrl: null,
      processingStatus: 'completed',
      processingMode: 'demo',
      simulated: true,
      timestamp: cursor,
    })

    previousCameraId = camera.cameraId
  }

  return companions
}
