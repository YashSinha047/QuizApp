const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: String,
  type: {
    type: String,
    enum: ['MCQ', 'TRUE_FALSE'],
    default: 'MCQ'
  },
  options: [String],
  correctAnswer: String,
  points: { type: Number, default: 10 }
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
  questions: [QuestionSchema]
});

module.exports = mongoose.model('Quiz', QuizSchema);
