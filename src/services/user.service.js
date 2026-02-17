import api from './api';

// Simple in-memory cache so that list APIs are not called
// repeatedly when switching between sidebar menus. Cache is
// invalidated on any create/update/archive/delete.
const userListCache = new Map();
const getCacheKey = (params = {}) => JSON.stringify(params || {});
const clearUserListCache = () => {
  userListCache.clear();
};

export const userService = {
  getAll: async (params = {}, options = {}) => {
    if (options.skipCache) clearUserListCache();
    const key = getCacheKey(params);
    if (!options.skipCache && userListCache.has(key)) {
      return userListCache.get(key);
    }
    const response = await api.get('/users', { params });
    const data = response.data;
    userListCache.set(key, data);
    return data;
  },

  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (userData) => {
    const response = await api.post('/users', userData);
    clearUserListCache();
    return response.data;
  },

  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    clearUserListCache();
    return response.data;
  },

  archive: async (id) => {
    const response = await api.put(`/users/${id}/archive`);
    clearUserListCache();
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    clearUserListCache();
    return response.data;
  }
};
