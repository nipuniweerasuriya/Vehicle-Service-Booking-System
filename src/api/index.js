import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
};

// Bookings API
export const bookingsAPI = {
  create: (booking) => api.post('/bookings', booking),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  getMyBookings: () => api.get('/bookings/my'),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  delete: (id) => api.delete(`/bookings/${id}`),
  getStats: () => api.get('/bookings/stats'),
};

// Services API
export const servicesAPI = {
  getAll: () => api.get('/services'),
  create: (service) => api.post('/services', service),
  update: (id, service) => api.put(`/services/${id}`, service),
  delete: (id) => api.delete(`/services/${id}`),
};

export default api;
