import mongoose from 'mongoose'
import crypto from 'node:crypto'
import Detection from '../../models/Detection.js'

// ---------------------------------------------------------------------------
// Why this file exists:
// The product decision for this phase is that the ANPR module must work in
// "demo mode" even when MongoDB is not reachable. The MongoDB architecture
// (Detection model, connection config) is left completely intact — this is
// purely an additive fallback layer that the controller calls uniformly.
// Whenever MongoDB is connected, every function below delegates straight to
// the real Detection model and this in-memory array is not used at all.
// ---------------------------------------------------------------------------

const memory = [] // process-local only; cleared on server restart

export function isDbConnected() {
  return mongoose.connection.readyState === 1
}

function matchesFilter(doc, { plateSearch, vehicleType, processingStatus }) {
  if (plateSearch && !doc.plateNumber.includes(plateSearch.toUpperCase())) return false
  if (vehicleType && doc.vehicleType !== vehicleType) return false
  if (processingStatus && doc.processingStatus !== processingStatus) return false
  return true
}

export async function insertResults(docs) {
  if (isDbConnected()) {
    return Detection.insertMany(docs)
  }
  const now = new Date()
  const saved = docs.map((d) => ({ _id: crypto.randomUUID(), ...d, createdAt: now, updatedAt: now }))
  memory.push(...saved)
  return saved
}

export async function listResults({ plateSearch, vehicleType, processingStatus, sort, page, limit }) {
  if (isDbConnected()) {
    const filter = {
      ...(plateSearch && { plateNumber: { $regex: plateSearch, $options: 'i' } }),
      ...(vehicleType && { vehicleType }),
      ...(processingStatus && { processingStatus }),
    }
    const sortObj = sort === 'oldest' ? { timestamp: 1 } : { timestamp: -1 }
    const [results, total] = await Promise.all([
      Detection.find(filter).sort(sortObj).skip((page - 1) * limit).limit(limit),
      Detection.countDocuments(filter),
    ])
    return { results, total }
  }

  const filtered = memory.filter((d) => matchesFilter(d, { plateSearch, vehicleType, processingStatus }))
  filtered.sort((a, b) => (sort === 'oldest' ? a.timestamp - b.timestamp : b.timestamp - a.timestamp))
  const start = (page - 1) * limit
  return { results: filtered.slice(start, start + limit), total: filtered.length }
}

// id format validation is intentionally left to the caller — memory-mode IDs
// are UUIDs, not Mongo ObjectIds, so the two modes can't share one check.
export async function getById(id) {
  if (isDbConnected()) return Detection.findById(id)
  return memory.find((d) => d._id === id) || null
}

export async function deleteById(id) {
  if (isDbConnected()) return Detection.findByIdAndDelete(id)
  const idx = memory.findIndex((d) => d._id === id)
  if (idx === -1) return null
  return memory.splice(idx, 1)[0]
}

export async function getByPlate(plateNumber) {
  if (isDbConnected()) {
    return Detection.find({ plateNumber }).sort({ timestamp: -1 })
  }
  return memory
    .filter((d) => d.plateNumber === plateNumber)
    .sort((a, b) => b.timestamp - a.timestamp)
}

// Removes only "START DEMO SCENARIO" detections (sourceType: 'camera' — see
// services/anpr/demoScenario.js for why this marker is safe/unique) so
// RESET DEMO never touches real uploaded ANPR history. Mirrors the same
// isDbConnected() branch pattern used by every other function in this file.
export async function deleteDemoResults() {
  if (isDbConnected()) {
    const result = await Detection.deleteMany({ sourceType: 'camera' })
    return result.deletedCount || 0
  }
  const before = memory.length
  for (let i = memory.length - 1; i >= 0; i--) {
    if (memory[i].sourceType === 'camera') memory.splice(i, 1)
  }
  return before - memory.length
}

export async function getStats() {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  if (isDbConnected()) {
    const [totalVehicles, distinctPlates, todayDetections, avgAgg] = await Promise.all([
      Detection.countDocuments(),
      Detection.distinct('plateNumber'),
      Detection.countDocuments({ timestamp: { $gte: startOfToday } }),
      Detection.aggregate([
        { $match: { ocrConfidence: { $ne: null } } },
        { $group: { _id: null, avg: { $avg: '$ocrConfidence' } } },
      ]),
    ])
    return {
      totalVehicles,
      totalPlates: distinctPlates.length,
      todayDetections,
      avgOcrConfidence: avgAgg[0]?.avg ?? null,
    }
  }

  const totalVehicles = memory.length
  const totalPlates = new Set(memory.map((d) => d.plateNumber)).size
  const todayDetections = memory.filter((d) => d.timestamp >= startOfToday).length
  const withConfidence = memory.filter((d) => d.ocrConfidence != null)
  const avgOcrConfidence = withConfidence.length
    ? withConfidence.reduce((sum, d) => sum + d.ocrConfidence, 0) / withConfidence.length
    : null

  return { totalVehicles, totalPlates, todayDetections, avgOcrConfidence }
}
