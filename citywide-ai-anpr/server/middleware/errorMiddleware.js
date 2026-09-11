import multer from 'multer'

export function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` })
}

export function errorHandler(err, req, res, next) {
  // Give upload-related errors a clean, specific status instead of a generic 500.
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'File exceeds the maximum allowed upload size.' : err.message
    return res.status(400).json({ message })
  }
  if (err.message?.startsWith('Unsupported file type')) {
    return res.status(400).json({ message: err.message })
  }

  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  res.status(status).json({
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}
