import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Landing = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const handleStudentClick = (e) => {
    e.preventDefault();
    if (user && !isAdmin) navigate('/public');
    else navigate('/login/student');
  };

  const handleAdminClick = (e) => {
    e.preventDefault();
    if (isAdmin) navigate('/admin');
    else navigate('/login/admin');
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-24">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Master any subject with</span>
          <span className="block text-indigo-600">QuizGenius</span>
        </h1>
        <p className="mt-4 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Create custom quizzes manually, or challenge yourself with our existing library.
        </p>
        
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 max-w-2xl mx-auto">
          <button
            onClick={handleStudentClick}
            className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all duration-200 w-full text-left"
          >
            <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
              🎓
            </div>
            <h3 className="text-lg font-bold text-gray-900">I am a Student</h3>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Login to track your progress, view marks, and retake quizzes.
            </p>
          </button>

          <button
            onClick={handleAdminClick}
            className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all duration-200 w-full text-left"
          >
            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-gray-900">I am an Admin</h3>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Secure login to create, edit, and manage quizzes.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;