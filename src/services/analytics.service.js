import api from './api';

export const analyticsService = {
  getDashboard: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  getSystem: async () => {
    const response = await api.get('/analytics/system');
    return response.data;
  }
};
