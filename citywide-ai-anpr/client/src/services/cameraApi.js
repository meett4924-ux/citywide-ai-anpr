import api from './api'

export async function fetchCameras() {
  const { data } = await api.get('/cameras')
  return data
}

export async function fetchCameraDetail(cameraId) {
  const { data } = await api.get(`/cameras/${encodeURIComponent(cameraId)}`)
  return data
}
