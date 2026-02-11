import api from './api';

const roleListCache = new Map();
const getKey = (params = {}) => JSON.stringify(params || {});
const clearRoleCache = () => roleListCache.clear();

export const roleService = {
  getAll: async (params = {}) => {
    const key = getKey(params);
    if (roleListCache.has(key)) {
      return roleListCache.get(key);
    }
    const response = await api.get('/roles', { params });
    const data = Array.isArray(response.data) ? response.data : response.data?.roles ?? [];
    roleListCache.set(key, data);
    return data;
  },

  getById: async (id) => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await api.post('/roles', payload);
    clearRoleCache();
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/roles/${id}`, payload);
    clearRoleCache();
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/roles/${id}`);
    clearRoleCache();
    return response.data;
  },
};
