// This module is the intended integration point for a real ANPR/Computer Vision
// engine (e.g. a plate-recognition microservice or third-party API).
// It is intentionally unimplemented in this phase — no AI logic, no camera
// streams, no external credentials. Routes/controllers should call into this
// service once a real recognition backend is ready to be wired up.
import { runAnprPipeline } from './anpr/pipeline.js'

export async function recognizePlate(/* imageBuffer */) {
  throw new Error('recognizePlate() is not implemented yet — ANPR engine is not connected.')
}

export async function ingestCameraFrame(/* cameraId, frame */) {
  throw new Error('ingestCameraFrame() is not implemented yet — camera stream ingestion is not connected.')
}

// Added in Part 3: runs an uploaded image/video through the current ANPR
// pipeline (demo provider for now). This is the function the ANPR controller
// calls — it's the seam that will eventually call a real provider instead of
// the demo one, without any change needed above this file.
export async function processUpload({ sourceType, sourceName, imageUrl }) {
  return runAnprPipeline({ sourceType, sourceName, imageUrl })
}
