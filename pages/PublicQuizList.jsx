import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const PublicQuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Admin can browse too, but primarily for students
    if (!user && !isAdmin) {
      navigate('/login/student');
      return;
    }

    const fetch = async () => {
      setLoading(true);
      try {
        const allQuizzes = await apiService.getQuizzes();
        let myAttempts = [];
        
        if (user && !isAdmin) {
          myAttempts = await apiService.getUserAttempts();
        }

        setQuizzes(allQuizzes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setAttempts(myAttempts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user, isAdmin, navigate]);

  const getAttempt = (quizId) => {
    // Return latest attempt
    const quizAttempts = attempts.filter(a => a.quizId === quizId);
    return quizAttempts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  };

  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Available Quizzes</h1>
        <p className="mt-4 text-lg text-gray-500">
          {user ? `Welcome, ${user.username}! Select a quiz below.` : 'Browse available quizzes.'}
        </p>
      </div>

      {quizzes.length === 0 ? (
         <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <span className="text-4xl mb-4 block">📭</span>
          <h3 className="text-lg font-medium text-gray-900">No quizzes yet</h3>
          <p className="mt-1 text-gray-500">Check back later or ask an admin to create one!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {quizzes.map((quiz) => {
            const attempt = getAttempt(quiz._id);
            return (
              <div key={quiz._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{quiz.title}</h3>
                    {attempt && (
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                         attempt.score / attempt.maxScore >= 0.8 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                       }`}>
                         Score: {attempt.score}/{attempt.maxScore}
                       </span>
                    )}
                  </div>
                  <p className="mt-2 text-gray-600 line-clamp-3">{quiz.description}</p>
                  <div className="mt-4 flex items-center text-sm text-gray-400">
                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {quiz.questions.length} Questions
                    </span>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <Link
                    to={`/public/quiz/${quiz._id}`}
                    className={`block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      attempt 
                        ? 'bg-indigo-500 hover:bg-indigo-600'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {attempt ? 'Retake Quiz' : 'Start Quiz'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PublicQuizList;