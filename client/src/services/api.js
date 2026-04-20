import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Return modified config
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  (error) => {
    // Handle error responses
    // If server responded, show appropriate toast based on status
    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message;

      if (status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        toast.error(serverMessage || 'Session expired. Please login again.');
      } else if (status === 400) {
        toast.error(serverMessage || 'Validation failed');
      } else if (status === 403) {
        toast.error(serverMessage || "You don't have permission to perform this action");
      } else if (status === 404) {
        toast.error(serverMessage || 'Resource not found');
      } else if (status >= 500) {
        toast.error(serverMessage || 'Something went wrong. Please try again.');
      }
    } else {
      // Network or other error without response
      toast.error(error.message || 'Network error. Please check your connection.');
    }

    // Return the error for component to handle (components may set inline UI state)
    return Promise.reject(error);
  }
);

export default api;