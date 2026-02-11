import api from './api';

const deviceListCache = new Map();
const deviceStatsCache = { data: null };
const getDeviceKey = (params = {}) => JSON.stringify(params || {});
const clearDeviceListCache = () => {
  deviceListCache.clear();
  deviceStatsCache.data = null;
};

export const deviceService = {
  getAll: async (params = {}) => {
    const key = getDeviceKey(params);
    if (deviceListCache.has(key)) {
      return deviceListCache.get(key);
    }
    const response = await api.get('/devices', { params });
    const data = response.data;
    deviceListCache.set(key, data);
    return data;
  },

  getById: async (id) => {
    const response = await api.get(`/devices/${id}`);
    return response.data;
  },

  create: async (deviceData) => {
    const response = await api.post('/devices', deviceData);
    clearDeviceListCache();
    return response.data;
  },

  update: async (id, deviceData) => {
    const response = await api.put(`/devices/${id}`, deviceData);
    clearDeviceListCache();
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/devices/${id}`);
    clearDeviceListCache();
    return response.data;
  },

  getStats: async () => {
    if (deviceStatsCache.data) {
      return deviceStatsCache.data;
    }
    const response = await api.get('/devices/stats/overview');
    deviceStatsCache.data = response.data;
    return response.data;
  }
};
