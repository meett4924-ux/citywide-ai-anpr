// Orchestrates the conceptual ANPR pipeline:
//   input -> vehicle detection -> plate detection -> (crop) -> OCR -> validation -> result
//
// The provider used for each stage is imported from a single place below, so
// swapping the demo provider for a real one (YOLO / OpenCV / PaddleOCR /
// Tesseract / a Python inference microservice) later means changing only
// these three imports — nothing in the controller or routes needs to change.
import * as provider from './demoProvider.js'
import { normalizePlate, validatePlate } from './plateValidator.js'

const PROCESSING_MODE = 'demo' // flip to 'real' once a real provider is wired in

// Small artificial delays between stages purely to make the conceptual
// pipeline stages distinguishable in logs/UI timing — NOT simulated "AI
// processing time". Safe to remove once a real provider has genuine latency.
const STAGE_DELAY_MS = 60
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function runAnprPipeline({ sourceType, sourceName, imageUrl }) {
  const vehicles = await provider.detectVehicles({ sourceType })
  await wait(STAGE_DELAY_MS)

  const results = []

  for (const vehicle of vehicles) {
    const plateRegion = await provider.detectPlateRegion(vehicle)
    await wait(STAGE_DELAY_MS)

    const ocr = await provider.runOcr(plateRegion)
    await wait(STAGE_DELAY_MS)

    const normalized = normalizePlate(ocr.rawText)
    const validation = validatePlate(normalized)

    results.push({
      plateNumber: normalized || 'UNREADABLE',
      vehicleType: vehicle.vehicleType,
      vehicleColor: vehicle.vehicleColor,
      vehicleConfidence: vehicle.vehicleConfidence,
      plateConfidence: plateRegion.plateConfidence,
      ocrConfidence: ocr.ocrConfidence,
      sourceType,
      sourceName,
      imageUrl,
      plateImageUrl: plateRegion.plateImageUrl,
      processingStatus: validation.valid ? 'completed' : 'failed',
      processingMode: PROCESSING_MODE,
      timestamp: new Date(),
    })
  }

  return { processingMode: PROCESSING_MODE, provider: provider.PROVIDER_NAME, results }
}
