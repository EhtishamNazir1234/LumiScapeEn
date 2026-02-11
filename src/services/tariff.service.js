import api from './api';

const tariffListCache = new Map();
const getKey = (params = {}) => JSON.stringify(params || {});
const clearTariffCache = () => tariffListCache.clear();

export const tariffService = {
  getAll: async (params = {}) => {
    const key = getKey(params);
    if (tariffListCache.has(key)) {
      return tariffListCache.get(key);
    }
    const response = await api.get('/tariff', { params });
    const data = Array.isArray(response.data) ? response.data : response.data?.tariffs ?? [];
    tariffListCache.set(key, data);
    return data;
  },

  create: async (payload) => {
    const response = await api.post('/tariff', payload);
    clearTariffCache();
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/tariff/${id}`, payload);
    clearTariffCache();
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/tariff/${id}`);
    clearTariffCache();
    return response.data;
  },
};
