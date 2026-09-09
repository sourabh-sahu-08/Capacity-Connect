import express from 'express';
import { createCourse, getCourses, getCourseById, updateCourse, publishCourse, getRecommendedCourses } from '../controllers/courseController';
import { enroll, getLearnersForTrainer } from '../controllers/enrollmentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createCourse);
router.get('/', protect, getCourses);
router.get('/recommended', protect, getRecommendedCourses);
router.get('/:id', protect, getCourseById);
router.patch('/:id', protect, updateCourse);
router.post('/:id/publish', protect, publishCourse);

// Enrollments
router.post('/:id/enroll', protect, enroll);
router.get('/trainer/learners', protect, getLearnersForTrainer);

export default router;
