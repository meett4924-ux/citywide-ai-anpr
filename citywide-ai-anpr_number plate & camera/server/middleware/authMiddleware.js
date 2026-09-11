import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'

export async function protect(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided.' })
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user no longer exists.' })
    }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired.' })
  }
}

// Added in Part 3: attaches req.user when a valid token AND a working
// database connection are both available, but never blocks the request
// either way. This exists specifically so modules that must keep working in
// "demo mode" (no live MongoDB — see server/services/anpr/detectionStore.js)
// aren't hard-blocked by the login->DB dependency chain that `protect` above
// requires. Routes using this middleware should not assume `req.user` exists.
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ') || mongoose.connection.readyState !== 1) {
    return next()
  }
  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
  } catch {
    // Invalid/expired token — proceed unauthenticated rather than blocking.
  }
  next()
}
