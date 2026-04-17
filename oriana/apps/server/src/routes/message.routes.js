const express = require('express');
const { authenticate } = require('../middleware/auth');
const messageService = require('../services/messageService');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const message = await messageService.sendMessage(
      req.userId,
      receiverId,
      content
    );
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/conversations', authenticate, async (req, res) => {
  try {
    const conversations = await messageService.getConversations(req.userId);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/conversation/:otherUserId', authenticate, async (req, res) => {
  try {
    const { skip = 0, take = 50 } = req.query;
    const messages = await messageService.getConversation(
      req.userId,
      req.params.otherUserId,
      parseInt(skip),
      parseInt(take)
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:messageId/read', authenticate, async (req, res) => {
  try {
    await messageService.markMessageAsRead(req.params.messageId);
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
