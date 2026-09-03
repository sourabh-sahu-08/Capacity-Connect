import express from 'express';
import { createAssessment, getAssessments } from '../controllers/assessmentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); // Require authentication for all assessment routes

router.route('/')
  .post(createAssessment)
  .get(getAssessments);

export default router;
