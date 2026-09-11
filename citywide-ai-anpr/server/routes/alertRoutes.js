import { Router } from 'express'
import { listAlerts, flagVehicle, acknowledgeAlert } from '../controllers/alertController.js'
import { optionalAuth } from '../middleware/authMiddleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.get('/', optionalAuth, asyncHandler(listAlerts))
router.post('/flag', optionalAuth, asyncHandler(flagVehicle))
router.patch('/:id/acknowledge', optionalAuth, asyncHandler(acknowledgeAlert))

export default router
