import express from 'express';
import { getLeaderboard, getUserGamificationProfile } from '../controllers/gamificationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/leaderboard', protect, getLeaderboard);
router.get('/me', protect, getUserGamificationProfile);

export default router;
