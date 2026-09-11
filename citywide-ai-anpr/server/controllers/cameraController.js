import { DEMO_CAMERAS } from '../data/demoCameras.js'
import * as detectionStore from '../services/anpr/detectionStore.js'

// GET /api/cameras
export async function listCameras(req, res) {
  const all = await detectionStore.getAll()

  const cameras = DEMO_CAMERAS.map((cam) => {
    const seen = all.filter((d) => d.cameraId === cam.cameraId)
    const lastDetection = seen[0]?.timestamp || null // getAll() is already sorted desc
    return {
      ...cam,
      detectionCount: seen.length,
      lastDetection,
    }
  })

  res.status(200).json({ success: true, cameras })
}

// GET /api/cameras/:cameraId
export async function getCameraDetail(req, res) {
  const camera = DEMO_CAMERAS.find((c) => c.cameraId === req.params.cameraId)
  if (!camera) {
    return res.status(404).json({ message: 'Camera not found.' })
  }

  const all = await detectionStore.getAll()
  const seenAtCamera = all.filter((d) => d.cameraId === camera.cameraId)

  res.status(200).json({
    success: true,
    camera: { ...camera, detectionCount: seenAtCamera.length },
    recentDetections: seenAtCamera.slice(0, 10),
  })
}
