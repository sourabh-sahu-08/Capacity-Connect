import express from 'express';
import { getOverview, getQueue } from '../controllers/managerController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/overview', protect, getOverview);
router.get('/attention-queue', protect, getQueue);

export default router;
