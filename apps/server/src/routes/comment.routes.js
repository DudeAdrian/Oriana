const express = require('express');
const { authenticate, optional } = require('../middleware/auth');
const commentService = require('../services/commentService');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { videoId, content } = req.body;
    const comment = await commentService.createComment(req.userId, videoId, content);
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/video/:videoId', optional, async (req, res) => {
  try {
    const { skip = 0, take = 20 } = req.query;
    const comments = await commentService.getVideoComments(
      req.params.videoId,
      parseInt(skip),
      parseInt(take)
    );
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:commentId', authenticate, async (req, res) => {
  try {
    await commentService.deleteComment(req.params.commentId, req.userId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
