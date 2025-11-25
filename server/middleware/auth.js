require('dotenv').config();
const jwt = require('jsonwebtoken');

// Use environment variable or fallback for local dev only
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

module.exports = { auth, JWT_SECRET };