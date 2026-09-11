import api from './api'

// POST /api/anpr/process — multipart upload. We explicitly set the content
// type; axios/the browser fills in the correct multipart boundary regardless
// of what's written here, as long as we pass a FormData body.
export async function processMedia(file, { onUploadProgress } = {}) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post('/anpr/process', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })
  return data
}

export async function fetchResults(params = {}) {
  const { data } = await api.get('/anpr', { params })
  return data
}

export async function fetchResultById(id) {
  const { data } = await api.get(`/anpr/${id}`)
  return data
}

export async function fetchByPlate(plateNumber) {
  const { data } = await api.get(`/anpr/plate/${encodeURIComponent(plateNumber)}`)
  return data
}

export async function deleteResult(id) {
  const { data } = await api.delete(`/anpr/${id}`)
  return data
}

export async function fetchStats() {
  const { data } = await api.get('/anpr/stats')
  return data
}

// "START DEMO SCENARIO" / "RESET DEMO" — see server/services/anpr/demoScenario.js.
// Reuses this same axios instance and the same /anpr resource as everything
// else in this file; no separate demo API surface.
export async function runDemoScenario() {
  const { data } = await api.post('/anpr/demo-scenario')
  return data
}

export async function resetDemoScenario() {
  const { data } = await api.delete('/anpr/demo-scenario')
  return data
}
