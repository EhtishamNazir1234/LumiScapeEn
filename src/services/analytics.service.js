import api from './api';

const dashboardCache = { data: null };
const systemCache = { data: null };

export const analyticsService = {
  getDashboard: async () => {
    if (dashboardCache.data) {
      return dashboardCache.data;
    }
    const response = await api.get('/analytics/dashboard');
    dashboardCache.data = response.data;
    return response.data;
  },

  /** Fetch fresh dashboard data (bypasses cache) for real-time subscribed users graph */
  getDashboardFresh: async () => {
    const response = await api.get('/analytics/dashboard');
    dashboardCache.data = response.data;
    return response.data;
  },

  getSystem: async () => {
    if (systemCache.data) {
      return systemCache.data;
    }
    const response = await api.get('/analytics/system');
    systemCache.data = response.data;
    return response.data;
  }
};
