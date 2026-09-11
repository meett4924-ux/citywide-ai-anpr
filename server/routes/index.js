import { Router } from 'express'
import authRoutes from './authRoutes.js'

const router = Router()

router.use('/auth', authRoutes)

// Health check for the API root.
router.get('/status', (req, res) => {
  res.json({ status: 'ok', service: 'anpr-platform-api', timestamp: new Date().toISOString() })
})

export default router
