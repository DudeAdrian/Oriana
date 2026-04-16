const express = require('express');
const { authenticate } = require('../middleware/auth');
const authService = require('../services/authService');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, username, password, displayName } = req.body;
    const result = await authService.register(email, username, password, displayName);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

router.get('/verify', authenticate, (req, res) => {
  res.json({ userId: req.userId });
});

module.exports = router;
