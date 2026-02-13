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
  // Check for admin token first, then regular user token
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('token');
  const token = adminToken || userToken;
  
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
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getReviews: () => api.get('/admin/reviews'),
  updateReviewStatus: (id, status) => api.put(`/admin/reviews/${id}/status`, { status }),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
};

// Bookings API
export const bookingsAPI = {
  create: (booking) => api.post('/bookings', booking),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  getMyBookings: () => api.get('/bookings/my'),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  updateProgress: (id, progress, progressStage) => api.put(`/bookings/${id}/progress`, { progress, progressStage }),
  delete: (id) => api.delete(`/bookings/${id}`),
  getStats: () => api.get('/bookings/stats'),
};

// Services API
export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getStats: () => api.get('/services/stats'),
  create: (service) => api.post('/services', service),
  update: (id, service) => api.put(`/services/${id}`, service),
  delete: (id) => api.delete(`/services/${id}`),
  toggleStatus: (id) => api.patch(`/services/${id}/toggle-status`),
  toggleFeatured: (id) => api.patch(`/services/${id}/toggle-featured`),
  bulkUpdateStatus: (serviceIds, status) => api.post('/services/bulk-status', { serviceIds, status }),
  bulkDelete: (serviceIds) => api.post('/services/bulk-delete', { serviceIds }),
};

// Reviews API
export const reviewsAPI = {
  getAll: () => api.get('/reviews'),
  create: (review) => api.post('/reviews', review),
};

export default api;
