import { Router } from 'express'
import { listCameras, getCameraDetail } from '../controllers/cameraController.js'
import { optionalAuth } from '../middleware/authMiddleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.get('/', optionalAuth, asyncHandler(listCameras))
router.get('/:cameraId', optionalAuth, asyncHandler(getCameraDetail))

export default router
