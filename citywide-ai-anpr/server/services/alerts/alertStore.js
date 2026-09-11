import crypto from 'node:crypto'
import Alert from '../../models/Alert.js'
import { isDbConnected } from '../../utils/dbState.js'

const memory = [] // process-local only; cleared on server restart

export async function createAlert(data) {
  if (isDbConnected()) {
    const alert = await Alert.create(data)
    return alert.toObject()
  }
  const now = new Date()
  const saved = { _id: crypto.randomUUID(), status: 'open', manuallyFlagged: false, ...data, createdAt: now, updatedAt: now }
  memory.unshift(saved)
  return saved
}

export async function listAlerts({ severity, status } = {}) {
  if (isDbConnected()) {
    const filter = { ...(severity && { severity }), ...(status && { status }) }
    const docs = await Alert.find(filter).sort({ createdAt: -1 })
    return docs.map((d) => d.toObject())
  }
  return memory.filter((a) => (!severity || a.severity === severity) && (!status || a.status === status))
}

export async function acknowledgeAlert(id) {
  if (isDbConnected()) {
    const updated = await Alert.findByIdAndUpdate(id, { status: 'acknowledged' }, { new: true })
    return updated ? updated.toObject() : null
  }
  const alert = memory.find((a) => a._id === id)
  if (!alert) return null
  alert.status = 'acknowledged'
  alert.updatedAt = new Date()
  return alert
}
