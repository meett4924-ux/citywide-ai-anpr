import { Router } from 'express'
import authRoutes from './authRoutes.js'
import anprRoutes from './anprRoutes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/anpr', anprRoutes)

// Health check for the API root.
router.get('/status', (req, res) => {
  res.json({ status: 'ok', service: 'anpr-platform-api', timestamp: new Date().toISOString() })
})

export default router
