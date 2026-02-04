// API service - handles all backend communication
// NOTE: Error handling is inconsistent - needs improvement

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// Shows API
export const showsApi = {
  getAll: () => api.get('/api/shows'),
  getById: (id) => api.get(`/api/shows/${id}`),
  getFull: (id) => api.get(`/api/shows/${id}/full`),
  create: (data) => api.post('/api/shows', data),
  update: (id, data) => api.put(`/api/shows/${id}`, data),
  delete: (id) => api.delete(`/api/shows/${id}`),
};

// Characters API
export const charactersApi = {
  getAll: (params) => api.get('/api/characters', { params }),
  getById: (id) => api.get(`/api/characters/${id}`),
  create: (data) => api.post('/api/characters', data),
  update: (id, data) => api.patch(`/api/characters/${id}`, data), // Note: PATCH not PUT!
  delete: (id) => api.delete(`/api/characters/${id}`),
};

// Episodes API
export const episodesApi = {
  getAll: (params) => api.get('/api/episodes', { params }),
  getById: (id) => api.get(`/api/episodes/${id}`),
  create: (data) => api.post('/api/episodes', data),
  update: (id, data) => api.put(`/api/episodes/${id}`, data),
  delete: (id) => api.delete(`/api/episodes/${id}`),
};

// Quotes API
export const quotesApi = {
  getAll: (params) => api.get('/api/quotes', { params }),
  getById: (id) => api.get(`/api/quotes/${id}`),
  getRandom: (params) => api.get('/api/quotes/random', { params }),
  create: (data) => api.post('/api/quotes', data),
  update: (id, data) => api.put(`/api/quotes/${id}`, data),
  delete: (id) => api.delete(`/api/quotes/${id}`),
  like: (id) => api.post(`/api/quotes/${id}/like`),
};

// Auth API - different path structure!
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Export the api instance for custom requests
export default api;
