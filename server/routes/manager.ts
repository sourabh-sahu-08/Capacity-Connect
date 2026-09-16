import express from 'express';
import { getOverview, getQueue, getSkillGaps, getTeams } from '../controllers/managerController';
import { getCapabilityMatrix } from '../controllers/capabilityController';
import { getRoles, simulateMobility, getReadiness } from '../controllers/readinessController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/overview', protect, getOverview);
router.get('/attention-queue', protect, getQueue);
router.get('/skill-gaps', protect, getSkillGaps);
router.get('/teams', protect, getTeams);

router.get('/capability-matrix', protect, getCapabilityMatrix);
router.get('/roles', protect, getRoles);
router.post('/simulate-mobility', protect, simulateMobility);
router.get('/readiness', protect, getReadiness);

export default router;
