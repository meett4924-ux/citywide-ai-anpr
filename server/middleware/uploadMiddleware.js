import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'anpr')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const ALLOWED_MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'video/mp4': '.mp4',
  'video/x-msvideo': '.avi',
  'video/quicktime': '.mov',
  'video/webm': '.webm',
}

const MAX_FILE_SIZE_MB = Number(process.env.ANPR_MAX_UPLOAD_MB) || 50

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename(req, file, cb) {
    // Never trust the client-supplied filename for the path on disk — generate
    // a random name and pick the extension from our own allow-list, not from
    // whatever the client sent, to avoid path traversal / double-extension tricks.
    const ext = ALLOWED_MIME_TO_EXT[file.mimetype] || ''
    cb(null, `${crypto.randomUUID()}${ext}`)
  },
})

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TO_EXT[file.mimetype]) {
    cb(new Error('Unsupported file type. Allowed: JPG, PNG images or MP4, MOV, WebM, AVI videos.'))
    return
  }
  cb(null, true)
}

export const anprUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
})

export function classifySourceType(mimetype) {
  return mimetype.startsWith('video/') ? 'video' : 'image'
}

export { UPLOAD_DIR }
