import express from 'express';
import { getMyEnrollments, updateLessonProgress } from '../controllers/enrollmentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/my', protect, getMyEnrollments);
router.patch('/:enrollmentId/progress', protect, updateLessonProgress);

export default router;
