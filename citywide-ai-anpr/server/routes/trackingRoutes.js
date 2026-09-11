import { Router } from 'express'
import { listTrackedVehicles, getVehicleJourney } from '../controllers/trackingController.js'
import { optionalAuth } from '../middleware/authMiddleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.get('/', optionalAuth, asyncHandler(listTrackedVehicles))
router.get('/:plateNumber', optionalAuth, asyncHandler(getVehicleJourney))

export default router
