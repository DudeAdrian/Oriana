const express = require('express');
const { authenticate } = require('../middleware/auth');
const likeService = require('../services/likeService');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { videoId } = req.body;
    const result = await likeService.likeVideo(req.userId, videoId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/video/:videoId', async (req, res) => {
  try {
    const count = await likeService.getVideoLikes(req.params.videoId);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
