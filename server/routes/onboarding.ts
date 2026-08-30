import express from 'express';
import { getOptions, completeOnboarding } from '../controllers/onboardingController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/options', getOptions);
router.post('/complete', protect, completeOnboarding);

export default router;
