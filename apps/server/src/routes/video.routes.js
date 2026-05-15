const express = require('express');
const { authenticate, optional } = require('../middleware/auth');
const videoService = require('../services/videoService');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const video = await videoService.createVideo(req.userId, req.body);
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:videoId', optional, async (req, res) => {
  try {
    const video = await videoService.getVideo(req.params.videoId, req.userId);
    res.json(video);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get('/user/:userId', optional, async (req, res) => {
  try {
    const { skip = 0, take = 10 } = req.query;
    const videos = await videoService.getUserVideos(
      req.params.userId,
      parseInt(skip),
      parseInt(take)
    );
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:videoId', authenticate, async (req, res) => {
  try {
    await videoService.deleteVideo(req.params.videoId, req.userId);
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
