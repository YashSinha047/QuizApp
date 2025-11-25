import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Landing from './pages/Landing.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import QuizEditor from './pages/QuizEditor.jsx';
import PublicQuizList from './pages/PublicQuizList.jsx';
import QuizPlayer from './pages/QuizPlayer.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import StudentLogin from './pages/StudentLogin.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

const App = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            
            {/* Auth Routes */}
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/login/student" element={<StudentLogin />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/create" element={<QuizEditor />} />
            <Route path="/admin/edit/:id" element={<QuizEditor />} />
            
            {/* Public/Student Routes */}
            <Route path="/public" element={<PublicQuizList />} />
            <Route path="/public/quiz/:id" element={<QuizPlayer />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;