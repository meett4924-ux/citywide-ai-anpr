import * as anprService from '../services/anprService.js'
import * as detectionStore from '../services/anpr/detectionStore.js'
import { classifySourceType } from '../middleware/uploadMiddleware.js'
import { normalizePlate } from '../services/anpr/plateValidator.js'
import { isValidObjectId } from '../utils/mongoId.js'
import { buildDemoScenarioResults } from '../services/anpr/demoScenario.js'

// POST /api/anpr/process
export async function processMedia(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded. Attach an image or video file.' })
  }

  const sourceType = classifySourceType(req.file.mimetype)
  const sourceName = req.file.originalname
  const imageUrl = `/uploads/anpr/${req.file.filename}`

  const pipelineOutput = await anprService.processUpload({ sourceType, sourceName, imageUrl })

  if (!pipelineOutput.results.length) {
    return res.status(200).json({
      success: true,
      processingMode: pipelineOutput.processingMode,
      storage: detectionStore.isDbConnected() ? 'mongodb' : 'memory',
      results: [],
      message: 'No vehicles detected in the provided media.',
    })
  }

  const saved = await detectionStore.insertResults(
    pipelineOutput.results.map((r) => ({ ...r, plateNumber: normalizePlate(r.plateNumber) || r.plateNumber })),
  )

  res.status(201).json({
    success: true,
    processingMode: pipelineOutput.processingMode,
    storage: detectionStore.isDbConnected() ? 'mongodb' : 'memory',
    results: saved,
  })
}

// GET /api/anpr
export async function listResults(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1)
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100)

  const { results, total } = await detectionStore.listResults({
    plateSearch: req.query.plate ? normalizePlate(req.query.plate) : undefined,
    vehicleType: req.query.vehicleType || undefined,
    processingStatus: req.query.processingStatus || undefined,
    sort: req.query.sort,
    page,
    limit,
  })

  res.status(200).json({ success: true, page, limit, total, results })
}

// GET /api/anpr/:id
export async function getResultById(req, res) {
  // Memory-mode IDs are UUIDs, not Mongo ObjectIds, so only enforce the
  // strict ObjectId format check when we're actually querying MongoDB.
  if (detectionStore.isDbConnected() && !isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid result ID.' })
  }
  const result = await detectionStore.getById(req.params.id)
  if (!result) {
    return res.status(404).json({ message: 'ANPR result not found.' })
  }
  res.status(200).json({ success: true, result })
}

// GET /api/anpr/plate/:plateNumber
export async function getByPlate(req, res) {
  const normalized = normalizePlate(req.params.plateNumber)
  if (!normalized) {
    return res.status(400).json({ message: 'Provide a plate number to search for.' })
  }
  const results = await detectionStore.getByPlate(normalized)
  res.status(200).json({ success: true, plateNumber: normalized, count: results.length, results })
}

// DELETE /api/anpr/:id
export async function deleteResult(req, res) {
  if (detectionStore.isDbConnected() && !isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid result ID.' })
  }
  const deleted = await detectionStore.deleteById(req.params.id)
  if (!deleted) {
    return res.status(404).json({ message: 'ANPR result not found.' })
  }
  res.status(200).json({ success: true, message: 'ANPR result deleted.' })
}

// POST /api/anpr/demo-scenario — "START DEMO SCENARIO" (SIH jury demo).
// Persists the same 3 deterministic multi-camera detections every time,
// through the exact same detectionStore used by processMedia above — this
// is the existing ANPR architecture, reused, not a second implementation.
export async function runDemoScenario(req, res) {
  const results = buildDemoScenarioResults()
  const saved = await detectionStore.insertResults(results)

  res.status(201).json({
    success: true,
    processingMode: 'demo',
    storage: detectionStore.isDbConnected() ? 'mongodb' : 'memory',
    results: saved,
  })
}

// DELETE /api/anpr/demo-scenario — "RESET DEMO". Only removes the demo
// scenario's own detections (sourceType: 'camera'); real uploaded ANPR
// history is untouched.
export async function resetDemoScenario(req, res) {
  const deletedCount = await detectionStore.deleteDemoResults()
  res.status(200).json({ success: true, deletedCount })
}

// GET /api/anpr/stats — genuine store-derived numbers (MongoDB or the demo
// in-memory store), never fabricated. Returns zeros when there's no data yet
// so the frontend can render an honest empty state.
export async function getStats(req, res) {
  const stats = await detectionStore.getStats()
  res.status(200).json({
    success: true,
    storage: detectionStore.isDbConnected() ? 'mongodb' : 'memory',
    stats,
  })
}
