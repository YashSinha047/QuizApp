const express = require('express');
const router = express.Router();
const Attempt = require('../models/Attempt');
const { auth } = require('../middleware/auth');

// Save attempt
router.post('/', auth, async (req, res) => {
  try {
    const attempt = new Attempt({
      ...req.body,
      userId: req.user.id
    });
    const savedAttempt = await attempt.save();
    res.json(savedAttempt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get attempts for logged in user
router.get('/my-attempts', auth, async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.id });
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
