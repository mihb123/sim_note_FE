import axios from 'axios';
import config from '@/app.config';

const api = axios.create({
  baseURL: config.API_HOST,
  withCredentials: true,
  withXSRFToken: true,
});

// Request Interceptor: Attaches the auth token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
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
        console.error("error: ", error);
        alert('Invaild credentials or your session has expired. Please try again.');
        window.location.href = '/auth/login';
      } else if (status === 403) {
        console.error("error: ", error);
        window.location.href = '/auth/verification';
      }
    }
    return Promise.reject(error);
  }
);

export default api;