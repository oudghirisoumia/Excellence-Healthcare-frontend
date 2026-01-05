import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Accept: 'application/json',
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

// HANDLE AUTH / B2B ERRORS GLOBALLY
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error;

    // Not authenticated → login
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }

    // B2B not approved → waiting approval
    if (
      status === 403 &&
      message?.toLowerCase().includes('validation')
    ) {
      window.location.href = '/waiting-approval';
    }

    return Promise.reject(error);
  }
);

export default api;
