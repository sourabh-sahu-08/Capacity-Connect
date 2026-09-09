import express from 'express';
import { createAssessment, submitAttempt, gradeAttempt, getAssessments } from '../controllers/assessmentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getAssessments);
router.post('/', protect, createAssessment);
router.post('/:id/attempt', protect, submitAttempt);
router.post('/attempt/:attemptId/grade', protect, gradeAttempt);

router.get('/my-submissions', getMySubmissions);

router.route('/:id')
  .get(getAssessmentById);

router.post('/:id/submit', submitAssessment);

router.get('/:id/submissions', getAssessmentSubmissions);

router.post('/:id/submissions/:submissionId/grade', gradeSubmission);

export default router;
