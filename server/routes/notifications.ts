import express from 'express';
import { protect } from '../middleware/authMiddleware';
import Notification from '../models/Notification';
import { NotificationService } from '../services/notificationService';

const router = express.Router();

// GET all notifications (paginated)
router.get('/', protect, async (req: any, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const query: any = { recipient: req.user.id };
    
    if (req.query.isRead !== undefined) {
      query.isRead = req.query.isRead === 'true';
    }
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(query);

    res.json({
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// GET unread count
router.get('/unread-count', protect, async (req: any, res) => {
  try {
    const count = await Notification.countDocuments({ recipient: req.user.id, isRead: false });
    res.json({ unreadCount: count });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// PATCH mark as read
router.patch('/:id/read', protect, async (req: any, res) => {
  try {
    const notification = await NotificationService.markAsRead(req.params.id, req.user.id);
    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }
    res.json(notification);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// PATCH mark all as read
router.patch('/read-all', protect, async (req: any, res) => {
  try {
    await NotificationService.markAllAsRead(req.user.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// DELETE notification
router.delete('/:id', protect, async (req: any, res) => {
  try {
    const notification = await NotificationService.deleteNotification(req.params.id, req.user.id);
    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST test endpoint (only for dev / authorized testing)
router.post('/test', protect, async (req: any, res) => {
  // Simple check to ensure we only run this in non-production or for admins
  if (process.env.NODE_ENV === 'production' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ msg: 'Not authorized' });
  }

  try {
    const { title, message, priority, type, category } = req.body;
    
    const notification = await NotificationService.createNotification({
      recipient: req.user.id,
      role: req.user.role,
      title: title || 'Test Notification',
      message: message || 'This is a test notification generated via API.',
      priority: priority || 'MEDIUM',
      type: type || 'system_alert',
      category: category || 'System'
    });

    res.json(notification);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;
