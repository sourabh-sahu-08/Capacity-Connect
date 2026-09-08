import express from 'express';
import {
  getOverview,
  getQueue,
  getCapabilityMatrix,
  getRoleRequirements,
  simulateTalentMobility,
  getWorkforceReadiness
} from '../controllers/managerController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); // Manager routes require authentication

router.get('/overview', getOverview);
router.get('/attention-queue', getQueue);
router.get('/capability-matrix', getCapabilityMatrix);
router.get('/roles', getRoleRequirements);
router.post('/simulate-mobility', simulateTalentMobility);
router.get('/readiness', getWorkforceReadiness);

export default router;
