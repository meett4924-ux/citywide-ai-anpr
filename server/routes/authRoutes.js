import { Router } from 'express'
import { signup, login, getMe } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.post('/register', asyncHandler(signup))
router.post('/signup', asyncHandler(signup)) // kept as an alias so nothing already wired to it breaks
router.post('/login', asyncHandler(login))
router.get('/me', protect, asyncHandler(getMe))

export default router
