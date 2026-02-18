import api from './api';

const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes - avoid refetch when switching sidebar
const dashboardCache = { data: null, timestamp: null };
const systemCache = { data: null };

const isCacheValid = (cache) =>
  cache?.data != null && cache?.timestamp != null && (Date.now() - cache.timestamp) < CACHE_TTL_MS;

export const analyticsService = {
  /** Uses cache when valid (avoids refetch when switching menus). Call getDashboardFresh() for explicit refresh. */
  getDashboard: async () => {
    if (isCacheValid(dashboardCache)) {
      return dashboardCache.data;
    }
    const response = await api.get('/analytics/dashboard');
    dashboardCache.data = response.data;
    dashboardCache.timestamp = Date.now();
    return response.data;
  },

  /** Bypasses cache - use for refresh button or when fresh data is required */
  getDashboardFresh: async () => {
    const response = await api.get('/analytics/dashboard');
    dashboardCache.data = response.data;
    dashboardCache.timestamp = Date.now();
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
