import express from 'express';
import { createAssessment, submitAttempt, gradeAttempt, getAssessments } from '../controllers/assessmentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getAssessments);
router.post('/', protect, createAssessment);
router.post('/:id/attempt', protect, submitAttempt);
router.post('/attempt/:attemptId/grade', protect, gradeAttempt);

export default router;
