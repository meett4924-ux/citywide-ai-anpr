import { Router } from 'express'
import {
  processMedia,
  listResults,
  getResultById,
  getByPlate,
  deleteResult,
  getStats,
  runDemoScenario,
  resetDemoScenario,
} from '../controllers/anprController.js'
import { optionalAuth } from '../middleware/authMiddleware.js'
import { anprUpload } from '../middleware/uploadMiddleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

// Uses optionalAuth rather than protect: this module is required to keep
// working in "demo mode" without a live MongoDB connection, and login itself
// depends on MongoDB — so hard-requiring a token here would make the ANPR
// module untestable whenever the database is down. If a valid token AND a
// working DB are both present, req.user is still attached for later use;
// otherwise the request proceeds unauthenticated. Revisit before production.
//
// Order matters below: specific paths ('/stats', '/plate/:plateNumber',
// '/demo-scenario') must be declared before the generic '/:id' so they
// aren't swallowed by it.
router.get('/stats', optionalAuth, asyncHandler(getStats))
router.get('/plate/:plateNumber', optionalAuth, asyncHandler(getByPlate))

// "START DEMO SCENARIO" / "RESET DEMO" — SIH jury demo feature. Reuses the
// existing ANPR pipeline's storage layer; see controllers/anprController.js.
router.post('/demo-scenario', optionalAuth, asyncHandler(runDemoScenario))
router.delete('/demo-scenario', optionalAuth, asyncHandler(resetDemoScenario))

router.post('/process', optionalAuth, anprUpload.single('file'), asyncHandler(processMedia))
router.get('/', optionalAuth, asyncHandler(listResults))
router.get('/:id', optionalAuth, asyncHandler(getResultById))
router.delete('/:id', optionalAuth, asyncHandler(deleteResult))

export default router
