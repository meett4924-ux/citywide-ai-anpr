import * as alertStore from '../services/alerts/alertStore.js'
import * as detectionStore from '../services/anpr/detectionStore.js'
import { normalizePlate } from '../services/anpr/plateValidator.js'
import { isValidObjectId } from '../utils/mongoId.js'

// GET /api/alerts?severity=&status=
export async function listAlerts(req, res) {
  const alerts = await alertStore.listAlerts({
    severity: req.query.severity || undefined,
    status: req.query.status || undefined,
  })
  res.status(200).json({ success: true, count: alerts.length, alerts })
}

// POST /api/alerts/flag
// Prototype "flag a vehicle" action — creates an alert tied to a plate. This
// is a manual demo capability, not an automated suspicious-activity system.
export async function flagVehicle(req, res) {
  const { plateNumber, reason, severity } = req.body

  const normalized = normalizePlate(plateNumber || '')
  if (!normalized) {
    return res.status(400).json({ message: 'A plate number is required to flag a vehicle.' })
  }
  if (!reason || !reason.trim()) {
    return res.status(400).json({ message: 'Provide a reason for flagging this vehicle.' })
  }

  const allowedSeverity = ['critical', 'warning', 'info']
  const finalSeverity = allowedSeverity.includes(severity) ? severity : 'critical'

  const recent = await detectionStore.getByPlate(normalized)
  const latest = recent[0] || null

  const alert = await alertStore.createAlert({
    severity: finalSeverity,
    title: 'Vehicle flagged (manual)',
    detail: reason.trim(),
    relatedPlate: normalized,
    cameraId: latest?.cameraId || null,
    cameraName: latest?.cameraName || null,
    manuallyFlagged: true,
  })

  res.status(201).json({ success: true, alert })
}

// PATCH /api/alerts/:id/acknowledge
export async function acknowledgeAlert(req, res) {
  if (detectionStore.isDbConnected() && !isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid alert ID.' })
  }
  const updated = await alertStore.acknowledgeAlert(req.params.id)
  if (!updated) {
    return res.status(404).json({ message: 'Alert not found.' })
  }
  res.status(200).json({ success: true, alert: updated })
}
