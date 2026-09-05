import express from 'express';
import { createCourse, getCourses } from '../controllers/courseController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); // Require authentication for all course routes

router.route('/')
  .post(createCourse)
  .get(getCourses);

export default router;
