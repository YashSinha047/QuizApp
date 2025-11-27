import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const QuizPlayer = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Quiz State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); 
  const [isFinished, setIsFinished] = useState(false);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(10);
  
  // Results
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);

  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Helper function to shuffle array (Fisher-Yates)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    // Protect route
    if (!user && !isAdmin) {
      navigate('/login/student');
      return;
    }

    const fetch = async () => {
      if (!id) return;
      try {
        const data = await apiService.getQuizById(id);
        if (data && data.questions) {
            // Randomize questions on load
            data.questions = shuffleArray(data.questions);
        }
        setQuiz(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, user, isAdmin, navigate]);

  // Timer Logic
  useEffect(() => {
    if (!quiz || isFinished) return;

    // Reset timer when question changes
    setTimeLeft(10);

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          handleNext(true); // Pass true to indicate auto-advance
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [currentIndex, quiz, isFinished]);

  const handleSelectOption = (option) => {
    if (!quiz) return;
    // Store answer based on current index
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: option
    }));
  };

  const handleNext = (isAuto = false) => {
    if (!quiz) return;
    
    // Check if we are at the last question
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (!quiz) return;
    let earnedPoints = 0;
    let totalPoints = 0;

    quiz.questions.forEach((q, idx) => {
      const qPoints = q.points || 10;
      totalPoints += qPoints;
      // If answers[idx] is undefined (due to timer runout), they get 0 points
      if (answers[idx] === q.correctAnswer) {
        earnedPoints += qPoints;
      }
    });

    setScore(earnedPoints);
    setMaxScore(totalPoints);
    setIsFinished(true);
    
    if (user && !isAdmin) {
        try {
          await apiService.saveAttempt({
              quizId: quiz._id,
              score: earnedPoints,
              maxScore: totalPoints,
              answers
          });
        } catch (err) {
          console.error("Failed to save attempt", err);
        }
    }
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!quiz) return (
    <div className="text-center py-24">
      <h2 className="text-xl font-bold text-gray-900">Quiz not found</h2>
      <Link to="/public" className="text-indigo-600 hover:text-indigo-800 mt-4 block">Return to list</Link>
    </div>
  );

  if (isFinished) {
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    let message = "Good effort!";
    if (percentage >= 80) message = "Excellent work! 🎉";
    else if (percentage >= 60) message = "Well done!";

    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden text-center p-8 sm:p-12">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-indigo-100 text-indigo-600 text-4xl mb-6 font-bold">
            {percentage}%
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{message}</h2>
          <p className="text-gray-500 mb-8">You scored {score} out of {maxScore} points</p>
          
          <div className="space-x-4">
            <Link
              to="/public"
              className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Quizzes
            </Link>
            <button
              onClick={() => {
                // To retake with new random order, we reload the data
                window.location.reload();
              }}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Retake Quiz
            </button>
          </div>

          <div className="mt-12 text-left space-y-8">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-4">Detailed Results</h3>
            {quiz.questions.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === q.correctAnswer;
              const pts = q.points || 10;
              return (
                <div key={idx} className={`p-4 rounded-lg border-l-4 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                  <div className="flex justify-between">
                     <p className="font-medium text-gray-900 mb-2"><span className="text-gray-500 mr-2">Q{idx + 1}.</span> {q.text}</p>
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{pts} Pts</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className={isCorrect ? "text-green-700 font-medium" : "text-red-600 line-through"}>
                      Your Answer: {userAnswer || "(Time Up / Skipped)"}
                    </p>
                    {!isCorrect && (
                      <p className="text-green-700 font-medium">Correct Answer: {q.correctAnswer}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100;
  const hasAnswered = !!answers[currentIndex];
  
  // Timer color logic
  let timerColor = 'bg-green-500';
  if (timeLeft <= 5) timerColor = 'bg-yellow-500';
  if (timeLeft <= 3) timerColor = 'bg-red-500';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header / Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">{quiz.title}</h2>
          <span className="text-sm font-medium text-gray-500">
            Question {currentIndex + 1} / {quiz.questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
            <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${timeLeft <= 3 ? 'text-red-600 bg-red-200' : 'text-indigo-600 bg-indigo-200'}`}>
                Time Left
            </span>
            <span className={`text-sm font-bold ${timeLeft <= 3 ? 'text-red-600' : 'text-gray-700'}`}>
                {timeLeft} seconds
            </span>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div 
                style={{ width: `${(timeLeft / 10) * 100}%` }} 
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${timerColor} transition-all duration-1000 ease-linear`}
            ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-medium text-gray-900 leading-relaxed">
              {currentQuestion.text}
            </h3>
            <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
              {currentQuestion.points || 10} pts
            </span>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center group ${
                  answers[currentIndex] === option
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className={`h-6 w-6 rounded-full border flex items-center justify-center mr-4 transition-colors ${
                  answers[currentIndex] === option
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-gray-300 group-hover:border-indigo-400'
                }`}>
                  {answers[currentIndex] === option && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                <span className="font-medium">{option}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className={`text-gray-500 font-medium ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-900'}`}
          >
            Previous
          </button>
          
          <button
            onClick={() => handleNext(false)}
            // Next is always enabled now because timer forces progress anyway, 
            // but we can keep it clickable even if skipped to manually skip
            className={`px-6 py-2 rounded-md text-white font-medium shadow-sm transition-all bg-indigo-600 hover:bg-indigo-700 hover:shadow-md`}
          >
            {currentIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;