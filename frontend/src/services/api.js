import axios from 'axios';

const ENV_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const ENV_API_BASE_URL = 'http://localhost:5000/api'; // Fallback for development

// Connection state management
let isServerUnreachable = false;
let lastServerErrorTime = 0;
let serverErrorNotificationShown = false;
const SERVER_ERROR_DEBOUNCE_MS = 30000; // 30 seconds debounce

// Create axios instance with base configuration
const api = axios.create({
  baseURL: ENV_API_BASE_URL ,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to show server error notification
const showServerErrorNotification = () => {
  const now = Date.now();
  
  // Only show notification if enough time has passed since last error
  if (!serverErrorNotificationShown || (now - lastServerErrorTime) > SERVER_ERROR_DEBOUNCE_MS) {
    const event = new CustomEvent('serverError', {
      detail: {
        message: 'Unable to connect to server. Please check your connection and try again.',
        type: 'CONNECTION_ERROR'
      }
    });
    window.dispatchEvent(event);
    
    serverErrorNotificationShown = true;
    lastServerErrorTime = now;
    
    // Reset notification flag after debounce period
    setTimeout(() => {
      serverErrorNotificationShown = false;
    }, SERVER_ERROR_DEBOUNCE_MS);
  }
};

// Function to check if error is a connection error
const isConnectionError = (error) => {
  return (
    !error.response || // Network error
    error.code === 'ECONNABORTED' || // Timeout
    error.code === 'NETWORK_ERROR' ||
    error.message === 'Network Error' ||
    (error.response && error.response.status >= 500) // Server errors
  );
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    // Server is reachable, reset connection state
    if (isServerUnreachable) {
      isServerUnreachable = false;
      serverErrorNotificationShown = false;
      
      // Notify that connection is restored
      const event = new CustomEvent('serverRestored', {
        detail: {
          message: 'Connection restored successfully!',
          type: 'CONNECTION_RESTORED'
        }
      });
      window.dispatchEvent(event);
    }
    
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Handle connection errors
    if (isConnectionError(error)) {
      isServerUnreachable = true;
      showServerErrorNotification();
    }
    
    return Promise.reject(error);
  }
);

export default api;