const express = require('express');
const { authenticate } = require('../middleware/auth');
const followService = require('../services/followService');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { followingId } = req.body;
    const result = await followService.followUser(req.userId, followingId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:userId/followers', async (req, res) => {
  try {
    const { skip = 0, take = 20 } = req.query;
    const followers = await followService.getFollowers(
      req.params.userId,
      parseInt(skip),
      parseInt(take)
    );
    res.json(followers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:userId/following', async (req, res) => {
  try {
    const { skip = 0, take = 20 } = req.query;
    const following = await followService.getFollowing(
      req.params.userId,
      parseInt(skip),
      parseInt(take)
    );
    res.json(following);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:followerId/:followingId/status', async (req, res) => {
  try {
    const isFollowing = await followService.isFollowing(
      req.params.followerId,
      req.params.followingId
    );
    res.json({ isFollowing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
