
const API_URL = import.meta.env.VITE_API_URL;


const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const apiService = {
  // --- Auth ---
  login: async (username, password, role) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  register: async (username, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  // --- Quizzes ---
  getQuizzes: async () => {
    const response = await fetch(`${API_URL}/quizzes`, { headers: getHeaders() });
    return response.json();
  },

  getQuizById: async (id) => {
    const response = await fetch(`${API_URL}/quizzes/${id}`, { headers: getHeaders() });
    return response.json();
  },

  saveQuiz: async (quiz) => {
    const method = quiz._id ? 'PUT' : 'POST';
    const url = quiz._id ? `${API_URL}/quizzes/${quiz._id}` : `${API_URL}/quizzes`;
    
    const response = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(quiz)
    });
    
    if (!response.ok) throw new Error('Failed to save quiz');
    return response.json();
  },

  deleteQuiz: async (id) => {
    await fetch(`${API_URL}/quizzes/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  },

  // --- Attempts ---
  saveAttempt: async (attempt) => {
    const response = await fetch(`${API_URL}/attempts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(attempt)
    });
    if (!response.ok) throw new Error('Failed to save attempt');
    return response.json();
  },

  getUserAttempts: async () => {
    const response = await fetch(`${API_URL}/attempts/my-attempts`, { headers: getHeaders() });
    return response.json();
  }
};
