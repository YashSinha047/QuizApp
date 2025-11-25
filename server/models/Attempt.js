const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  score: Number,
  maxScore: Number,
  timestamp: { type: Date, default: Date.now },
  answers: Object // Store the map of answers
});

module.exports = mongoose.model('Attempt', AttemptSchema);
