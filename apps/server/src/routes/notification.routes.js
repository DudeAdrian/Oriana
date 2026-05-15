const express = require('express');
const { authenticate } = require('../middleware/auth');
const notificationService = require('../services/notificationService');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { skip = 0, take = 20 } = req.query;
    const notifications = await notificationService.getNotifications(
      req.userId,
      parseInt(skip),
      parseInt(take)
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:notificationId/read', authenticate, async (req, res) => {
  try {
    await notificationService.markAsRead(req.params.notificationId);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.userId);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
