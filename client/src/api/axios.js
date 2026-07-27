import axios from 'axios';

const apiBaseURL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')
  || (import.meta.env.PROD
    ? 'https://doubtsnap.onrender.com/api'
    : 'http://localhost:8000/api');

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('doubtsnap_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('doubtsnap_token');
      localStorage.removeItem('doubtsnap_user');
      // Only redirect if not already on login/register
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
