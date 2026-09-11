import { Router } from 'express'
import { getAnalytics } from '../controllers/analyticsController.js'
import { optionalAuth } from '../middleware/authMiddleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.get('/', optionalAuth, asyncHandler(getAnalytics))

export default router
