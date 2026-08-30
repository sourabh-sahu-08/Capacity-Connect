import express from 'express';
import { getProfile, getSkillGaps, triggerCycle } from '../controllers/competencyController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.post('/analyze', protect, getSkillGaps);
router.post('/cycle', protect, triggerCycle);

export default router;
