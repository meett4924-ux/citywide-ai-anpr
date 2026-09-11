export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png']
export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/webm']
export const ACCEPTED_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES]

export const MAX_FILE_SIZE_MB = Number(import.meta.env.VITE_ANPR_MAX_UPLOAD_MB) || 50

export function formatFileSize(bytes) {
  if (!bytes) return '0 KB'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

// Mirrors the backend's allow-list so obviously-bad files are rejected before
// a network round trip; the backend still re-validates independently.
// `allowedTypes` defaults to every type this project accepts, but callers
// with a narrower use case (e.g. the video-only upload card) can pass a
// subset instead of re-implementing this function.
export function validateAnprFile(file, allowedTypes = ACCEPTED_TYPES) {
  if (!file) return { valid: false, error: 'No file selected.' }
  if (file.size === 0) return { valid: false, error: 'The selected file is empty.' }
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Unsupported file type. Use JPG/PNG images or MP4/MOV/WebM videos.' }
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `File exceeds the ${MAX_FILE_SIZE_MB}MB limit.` }
  }
  return { valid: true, error: null }
}

export function isVideoFile(file) {
  return ACCEPTED_VIDEO_TYPES.includes(file?.type)
}
