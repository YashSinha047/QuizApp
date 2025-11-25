import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const QuizEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAdmin } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login/admin');
      return;
    }

    if (id) {
      setLoading(true);
      apiService.getQuizById(id).then(quiz => {
        if (quiz) {
          setTitle(quiz.title);
          setDescription(quiz.description);
          setQuestions(quiz.questions || []);
        }
        setLoading(false);
      });
    } else {
        // Initial question for new quiz
        handleAddQuestion();
    }
  }, [id, isAdmin, navigate]);

  const handleAddQuestion = () => {
    const newQuestion = {
      // Temporary ID for UI tracking (not saved to DB)
      tempId: Date.now().toString(),
      type: 'MCQ',
      text: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 10
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const updateQuestion = (index, updates) => {
    setQuestions(questions.map((q, i) => i === index ? { ...q, ...updates } : q));
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title || questions.length === 0) {
      alert("Please provide a title and at least one question.");
      return;
    }

    const invalid = questions.find(q => !q.text || !q.correctAnswer || (q.type === 'MCQ' && q.options.some(o => !o)));
    if (invalid) {
      alert("Please ensure all questions are fully filled out with correct answers.");
      return;
    }

    const quizData = {
      _id: id, 
      title,
      description,
      questions
    };

    try {
      await apiService.saveQuiz(quizData);
      navigate('/admin');
    } catch (err) {
      alert(err.message || 'Failed to save quiz');
    }
  };

  if (loading) return <div className="p-12 text-center">Loading quiz data...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit Quiz' : 'Create Quiz'}</h1>
        <div className="space-x-3">
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {id ? 'Update Quiz' : 'Save Quiz'}
            </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700">Quiz Title</label>
            <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            />
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
            <div key={q.tempId || idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative group">
            <button
                onClick={() => removeQuestion(idx)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            <h3 className="text-md font-medium text-gray-900 mb-4">Question {idx + 1}</h3>
            
            <div className="grid grid-cols-1 gap-4">
                <div className="flex gap-4">
                <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700">Question Text</label>
                    <input
                    type="text"
                    value={q.text}
                    onChange={(e) => updateQuestion(idx, { text: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>
                <div className="w-24">
                    <label className="block text-sm font-medium text-gray-700">Points</label>
                    <input
                        type="number"
                        min="1"
                        value={q.points}
                        onChange={(e) => updateQuestion(idx, { points: parseInt(e.target.value) || 0 })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                    value={q.type}
                    onChange={(e) => {
                    const newType = e.target.value;
                    updateQuestion(idx, {
                        type: newType,
                        options: newType === 'TRUE_FALSE' ? ["True", "False"] : ["", "", "", ""],
                        correctAnswer: ""
                    });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                >
                    <option value="MCQ">Multiple Choice</option>
                    <option value="TRUE_FALSE">True / False</option>
                </select>
                </div>

                <div className="space-y-3 mt-2">
                <label className="block text-sm font-medium text-gray-700">Options & Correct Answer</label>
                {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center space-x-3">
                    <input
                        type="radio"
                        name={`correct-${idx}`}
                        checked={q.correctAnswer === opt && opt !== ''}
                        onChange={() => updateQuestion(idx, { correctAnswer: opt })}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <input
                        type="text"
                        value={opt}
                        readOnly={q.type === 'TRUE_FALSE'}
                        onChange={(e) => {
                        const newOptions = [...q.options];
                        newOptions[optIdx] = e.target.value;
                        const updates = { options: newOptions };
                        if (q.correctAnswer === opt) {
                            updates.correctAnswer = e.target.value;
                        }
                        updateQuestion(idx, updates);
                        }}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${q.type === 'TRUE_FALSE' ? 'bg-gray-100' : ''}`}
                        placeholder={`Option ${optIdx + 1}`}
                    />
                    </div>
                ))}
                </div>
            </div>
            </div>
        ))}
        </div>

        <button
        onClick={handleAddQuestion}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-500 transition-colors font-medium flex items-center justify-center"
        >
        Add Another Question
        </button>
    </div>
  );
};

export default QuizEditor;