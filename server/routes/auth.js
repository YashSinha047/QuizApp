const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

// Login
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  // Admin Login
  if (role === 'admin') {
    if (password === 'admin047') {
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token, role: 'admin' });
    } else {
      return res.status(400).json({ message: 'Invalid admin password' });
    }
  }

  // Student Login
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // In a real app, use bcrypt.compare here
    if (password !== user.password) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: 'student', username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, role: 'student', username: user.username });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ username, password });
    await user.save();

    const token = jwt.sign({ id: user._id, role: 'student', username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, role: 'student', username: user.username });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
