import api from './api';

const roleListCache = new Map();
const roleByIdCache = new Map();
const getKey = (params = {}) => JSON.stringify(params || {});
const clearListCache = () => roleListCache.clear();

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
    if (!id) return null;
    if (roleByIdCache.has(id)) {
      return roleByIdCache.get(id);
    }
    const response = await api.get(`/roles/${id}`);
    const role = response.data;
    roleByIdCache.set(id, role);
    return role;
  },

  create: async (payload) => {
    const response = await api.post('/roles', payload);
    const role = response.data;
    clearListCache();
    if (role?._id) roleByIdCache.set(role._id, role);
    return role;
  },

  update: async (id, payload) => {
    const response = await api.put(`/roles/${id}`, payload);
    const role = response.data;
    clearListCache();
    if (role?._id) roleByIdCache.set(role._id, role);
    return role;
  },

  delete: async (id) => {
    const response = await api.delete(`/roles/${id}`);
    clearListCache();
    roleByIdCache.delete(id);
    return response.data;
  },
};
