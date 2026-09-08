import express from 'express';
import {
  createAssessment,
  getAssessments,
  getAssessmentById,
  submitAssessment,
  getMySubmissions,
  getAssessmentSubmissions,
  gradeSubmission
} from '../controllers/assessmentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); // Require authentication for all assessment routes

router.route('/')
  .post(createAssessment)
  .get(getAssessments);

router.get('/my-submissions', getMySubmissions);

router.route('/:id')
  .get(getAssessmentById);

router.post('/:id/submit', submitAssessment);

router.get('/:id/submissions', getAssessmentSubmissions);

router.post('/:id/submissions/:submissionId/grade', gradeSubmission);

export default router;
