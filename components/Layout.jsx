import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  QuizGenius
                </span>
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Home
              </Link>
              
              {!isAdmin && (
                 <Link
                 to="/public"
                 className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                   location.pathname.startsWith('/public') 
                     ? 'text-indigo-600 bg-indigo-50' 
                     : 'text-gray-500 hover:text-gray-700'
                 }`}
               >
                 Student Area
               </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/admin') 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Admin Panel
                </Link>
              )}

              {(isAdmin || user) && (
                <div className="flex items-center ml-4 pl-4 border-l border-gray-200 space-x-3">
                  <span className="text-sm text-gray-600">
                    Hi, <span className="font-bold">{isAdmin ? 'Admin' : user?.username}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} QuizGenius. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;