// This module is the intended integration point for a real ANPR/Computer Vision
// engine (e.g. a plate-recognition microservice or third-party API).
// It is intentionally unimplemented in this phase — no AI logic, no camera
// streams, no external credentials. Routes/controllers should call into this
// service once a real recognition backend is ready to be wired up.

export async function recognizePlate(/* imageBuffer */) {
  throw new Error('recognizePlate() is not implemented yet — ANPR engine is not connected.')
}

export async function ingestCameraFrame(/* cameraId, frame */) {
  throw new Error('ingestCameraFrame() is not implemented yet — camera stream ingestion is not connected.')
}
