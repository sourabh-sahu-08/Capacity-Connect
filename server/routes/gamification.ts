import express from 'express';
import { getLeaderboard, getGamificationProfile } from '../controllers/gamificationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/leaderboard', protect, getLeaderboard);
router.get('/me', protect, getGamificationProfile);

export default router;
