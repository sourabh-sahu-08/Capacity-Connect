import express from 'express';
import { discoverUsers } from '../controllers/usersController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/discover', protect, discoverUsers);

export default router;
