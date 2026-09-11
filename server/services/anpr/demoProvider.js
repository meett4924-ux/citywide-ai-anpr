// DEMO / MOCK PROVIDER
// ---------------------------------------------------------------------------
// This module does NOT run any real computer-vision or OCR model. It produces
// plausible-looking vehicle/plate data so the rest of the application (API,
// database, UI) can be built and tested end-to-end before a real inference
// engine is connected.
//
// Every value produced here is randomized/deterministic-by-seed, not detected.
// Every result that flows from this file must carry processingMode: 'demo' so
// the frontend can label it clearly and nobody mistakes it for a real reading.
//
// To connect a real engine later (YOLO / OpenCV / PaddleOCR / Tesseract / a
// Python inference microservice, etc.), implement a new provider module with
// the same three function signatures (detectVehicles, detectPlateRegion,
// runOcr) and swap it in `server/services/anpr/pipeline.js`.

const VEHICLE_TYPES = ['Car', 'Two-wheeler', 'Bus', 'Truck']
const VEHICLE_COLORS = ['White', 'Black', 'Silver', 'Red', 'Blue', 'Grey']
const STATE_CODES = ['GJ', 'MH', 'DL', 'KA', 'RJ', 'UP']

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function randomInRange(min, max) {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100
}

function randomDigits(count) {
  let out = ''
  for (let i = 0; i < count; i++) out += Math.floor(Math.random() * 10)
  return out
}

function randomLetters(count) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let out = ''
  for (let i = 0; i < count; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)]
  return out
}

// Produces a plausible Indian-format plate string, e.g. "GJ05AB1234".
// Occasionally introduces a slightly malformed string (missing digit, stray
// space) so the validator downstream has something real to normalize/reject —
// this keeps the demo honest about OCR not being perfect.
function generateRawPlateText() {
  const clean = `${randomItem(STATE_CODES)}${randomDigits(2)}${randomLetters(2)}${randomDigits(4)}`
  const roll = Math.random()
  if (roll < 0.15) return ` ${clean.slice(0, -1)} ` // simulate a dropped trailing digit
  if (roll < 0.3) return clean.toLowerCase().replace(/(.{2})(.{2})/, '$1 $2 ') // lowercase + stray spacing
  return clean
}

// Simulates "vehicle detection": how many vehicles are visible and their
// coarse attributes. Images yield exactly one primary vehicle for this demo;
// videos yield a small handful to simulate multiple frames/vehicles.
export async function detectVehicles({ sourceType }) {
  const count = sourceType === 'video' ? 1 + Math.floor(Math.random() * 3) : 1

  return Array.from({ length: count }, () => ({
    vehicleType: randomItem(VEHICLE_TYPES),
    vehicleColor: randomItem(VEHICLE_COLORS),
    vehicleConfidence: randomInRange(0.85, 0.99),
  }))
}

// Simulates "plate region detection" for a single already-detected vehicle.
export async function detectPlateRegion() {
  return {
    plateConfidence: randomInRange(0.78, 0.98),
    // A real provider would return crop coordinates / a cropped image buffer here.
    // Demo mode has no real image to crop, so this is intentionally left null.
    plateImageUrl: null,
  }
}

// Simulates OCR on a (non-existent, in demo mode) cropped plate region.
export async function runOcr() {
  return {
    rawText: generateRawPlateText(),
    ocrConfidence: randomInRange(0.7, 0.97),
  }
}

export const PROVIDER_NAME = 'demo-mock-provider'
