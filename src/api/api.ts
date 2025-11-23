import axios from 'axios';
import config from '@/app.config';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
 

 
window.Pusher = Pusher;
// Pusher.logToConsole = true;

const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${config.API_HOST}/broadcasting/auth`,
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
    },
});

window.Echo = echo;

const api = axios.create({
  baseURL: config.API_HOST,
  withCredentials: true,
  withXSRFToken: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (echo && echo.socketId()) {
    config.headers['X-Socket-ID'] = echo.socketId();
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
declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: typeof echo;
    }
}

export { echo };
export default api;