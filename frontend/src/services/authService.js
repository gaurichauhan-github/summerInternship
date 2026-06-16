import { apiClient } from './apiClient.js';

export const authService = {
  async register(payload) {
    return apiClient.post('/auth/register', payload);
  },

  async verifyRegisterOtp(payload) {
    return apiClient.post('/auth/verify-register-otp', payload);
  },

  async login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },

  async verifyLoginOtp(payload) {
    return apiClient.post('/auth/verify-login-otp', payload);
  },

  async getProfile() {
    return apiClient.get('/auth/profile');
  },
};
