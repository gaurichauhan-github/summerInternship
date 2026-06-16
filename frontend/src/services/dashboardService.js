import { apiClient } from './apiClient.js';

export const dashboardService = {
  getSummary() {
    return apiClient.get('/dashboard/summary');
  },
};
