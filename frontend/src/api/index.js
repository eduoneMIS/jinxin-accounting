import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
};

export const transactionsAPI = {
  getAll: (params) => api.get('/api/transactions/', { params }),
  getOne: (id) => api.get(`/api/transactions/${id}`),
  create: (data) => api.post('/api/transactions/', data),
  update: (id, data) => api.put(`/api/transactions/${id}`, data),
  delete: (id) => api.delete(`/api/transactions/${id}`),
  getSummary: (params) => api.get('/api/transactions/summary/monthly', { params }),
  exportCSV: (params) => api.get('/api/transactions/export/csv', { params, responseType: 'blob' }),
};

export const categoriesAPI = {
  getAll: (type) => api.get('/api/categories/', { params: { type } }),
  create: (data) => api.post('/api/categories/', data),
  update: (id, data) => api.put(`/api/categories/${id}`, data),
  delete: (id) => api.delete(`/api/categories/${id}`),
};

export const budgetsAPI = {
  getAll: (params) => api.get('/api/budgets/', { params }),
  create: (data) => api.post('/api/budgets/', data),
  delete: (id) => api.delete(`/api/budgets/${id}`),
  getAlerts: (params) => api.get('/api/budgets/alerts', { params }),
};

export const recurringAPI = {
  getAll: (activeOnly = true) => api.get('/api/recurring/', { params: { active_only: activeOnly } }),
  create: (data) => api.post('/api/recurring/', data),
  toggle: (id) => api.put(`/api/recurring/${id}/toggle`),
  execute: (id) => api.post(`/api/recurring/${id}/execute`),
  delete: (id) => api.delete(`/api/recurring/${id}`),
};

export default api;
