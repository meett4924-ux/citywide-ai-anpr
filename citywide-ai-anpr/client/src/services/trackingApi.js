import api from './api'

export async function fetchTrackedVehicles(params = {}) {
  const { data } = await api.get('/tracking', { params })
  return data
}

export async function fetchVehicleJourney(plateNumber) {
  const { data } = await api.get(`/tracking/${encodeURIComponent(plateNumber)}`)
  return data
}
