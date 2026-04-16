const express = require('express');
const { authenticate } = require('../middleware/auth');
const feedService = require('../services/feedService');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { skip = 0, take = 10 } = req.query;
    const videos = await feedService.getFeed(
      req.userId,
      parseInt(skip),
      parseInt(take)
    );
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/discover', async (req, res) => {
  try {
    const { skip = 0, take = 10 } = req.query;
    const videos = await feedService.getDiscoveryFeed(
      parseInt(skip),
      parseInt(take)
    );
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
