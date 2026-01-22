import api from './api';

export const deviceService = {
  getAll: async (params = {}) => {
    const response = await api.get('/devices', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/devices/${id}`);
    return response.data;
  },

  create: async (deviceData) => {
    const response = await api.post('/devices', deviceData);
    return response.data;
  },

  update: async (id, deviceData) => {
    const response = await api.put(`/devices/${id}`, deviceData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/devices/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/devices/stats/overview');
    return response.data;
  }
};
