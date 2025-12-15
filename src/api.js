import axios from 'axios';

// The API base URL is dynamically loaded from environment variables.
// This allows the frontend to call different backends depending on the environment:
// - In development: value comes from .env.development  → http://localhost:8000/api
// - In production:  value is set in Vercel environment → https://excellence-healthcare-backend.onrender.com/api

const api = axios.create({
  baseURL: 'https://excellence-healthcare-backend.onrender.com/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Auto-add JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
