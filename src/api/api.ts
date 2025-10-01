import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  withCredentials: true,
  withXSRFToken: true,
});

// Request Interceptor: Attaches the auth token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handles global errors like 401 and 403.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        localStorage.removeItem('authToken');
        alert('Your session has expired. Please log in again.');
        window.location.href = '/auth/login'; 
      } else if (status === 403) {
        alert('You do not have permission to perform this action. Please verify your email account.');
        window.location.href = '/auth/verification';
      }
    }
    return Promise.reject(error);
  }
);

export default api;