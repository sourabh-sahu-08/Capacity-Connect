import express from 'express';
import { getOptions, completeOnboarding, completeTrainerOnboarding } from '../controllers/onboardingController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/options', getOptions);
router.post('/complete', protect, completeOnboarding);

export default router;

router.post('/complete-trainer', protect, completeTrainerOnboarding);
