import express from 'express';
import { getConversations, getOrCreateConversation, getMessages } from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getConversations);
router.post('/', protect, getOrCreateConversation);
router.get('/:id/messages', protect, getMessages);

export default router;
