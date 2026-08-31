const fs = require('fs');

const content = `import express from 'express';
import { registerUser, loginUser, getMe, forgotPassword, resetPassword } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
`;

fs.writeFileSync('server/routes/auth.ts', content, 'utf8');
