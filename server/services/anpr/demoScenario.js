// "START DEMO SCENARIO" dataset — SIH jury presentation feature.
// ---------------------------------------------------------------------------
// This is NOT a second ANPR implementation. It reuses the exact same
// Detection shape produced by the real pipeline (see pipeline.js) and is
// persisted through the same detectionStore used by the upload-based ANPR
// flow, so it shows up in the existing ANPR History table and stats
// automatically with zero changes to either.
//
// Every value below is fixed — no Math.random() anywhere in this file — so
// the scenario reproduces identically on every run, per the jury-demo
// requirement for deterministic (not random) data.
//
// The vehicle is tagged sourceType: 'camera' (an option the Detection model
// already reserved for exactly this — see the "camera" enum value and the
// comment on Detection.camera). Real uploads only ever use 'image'/'video',
// so this is a safe, unique marker for "which detections belong to the
// demo scenario" without any schema change.

export const DEMO_PLATE = 'GJ05AB1234'
export const DEMO_VEHICLE_TYPE = 'Car'
export const DEMO_VEHICLE_COLOR = 'White'

// Camera metadata here intentionally mirrors (does not replace) the camera
// list already defined client-side in client/src/services/mockData.js —
// kept minimal (id/name/zone + fixed confidences) since the backend has no
// Camera API yet and shouldn't grow one just for this demo.
export const DEMO_CAMERAS = [
  {
    id: 'CAM-002',
    name: 'Sabarmati Bridge East',
    zone: 'Zone 1 - Central',
    offsetMs: 0,
    vehicleConfidence: 0.96,
    plateConfidence: 0.94,
    ocrConfidence: 0.92,
  },
  {
    id: 'CAM-014',
    name: 'GIFT City Junction',
    zone: 'Zone 4 - GIFT City',
    offsetMs: 8 * 60 * 1000, // +8 min — deterministic, not real elapsed wall time
    vehicleConfidence: 0.97,
    plateConfidence: 0.95,
    ocrConfidence: 0.94,
  },
  {
    id: 'CAM-033',
    name: 'Infocity Circle',
    zone: 'Zone 4 - GIFT City',
    offsetMs: 15 * 60 * 1000, // +15 min
    vehicleConfidence: 0.98,
    plateConfidence: 0.96,
    ocrConfidence: 0.95,
  },
]

// Builds the 3 deterministic Detection-shaped records for the scenario.
// `now` is injectable for tests; defaults to the real clock so timestamps
// are anchored to "when the jury clicked Start" while offsets between
// cameras stay fixed.
export function buildDemoScenarioResults(now = Date.now()) {
  return DEMO_CAMERAS.map((cam) => ({
    plateNumber: DEMO_PLATE,
    vehicleType: DEMO_VEHICLE_TYPE,
    vehicleColor: DEMO_VEHICLE_COLOR,
    vehicleConfidence: cam.vehicleConfidence,
    plateConfidence: cam.plateConfidence,
    ocrConfidence: cam.ocrConfidence,
    sourceType: 'camera',
    sourceName: `${cam.id} - ${cam.name}`,
    imageUrl: null,
    plateImageUrl: null,
    processingStatus: 'completed',
    processingMode: 'demo',
    timestamp: new Date(now + cam.offsetMs),
  }))
}
