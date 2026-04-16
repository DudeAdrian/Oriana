const express = require('express');
const { authenticate, optional } = require('../middleware/auth');
const userService = require('../services/userService');

const router = express.Router();

router.get('/profile/:userId', optional, async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.params.userId);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get('/username/:username', optional, async (req, res) => {
  try {
    const user = await userService.getUserByUsername(req.params.username);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Query parameter required' });
    }
    const users = await userService.searchUsers(q);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const user = await userService.updateProfile(req.userId, req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
