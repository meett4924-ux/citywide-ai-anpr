import api from './api'

export async function fetchAlerts(params = {}) {
  const { data } = await api.get('/alerts', { params })
  return data
}

export async function flagVehicle(payload) {
  const { data } = await api.post('/alerts/flag', payload)
  return data
}

export async function acknowledgeAlert(id) {
  const { data } = await api.patch(`/alerts/${id}/acknowledge`)
  return data
}
