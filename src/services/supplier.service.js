import api from './api';

const supplierListCache = new Map();
const getSupplierKey = (params = {}) => JSON.stringify(params || {});
const clearSupplierListCache = () => {
  supplierListCache.clear();
};

export const supplierService = {
  getAll: async (params = {}) => {
    const key = getSupplierKey(params);
    if (supplierListCache.has(key)) {
      return supplierListCache.get(key);
    }
    const response = await api.get('/suppliers', { params });
    const data = response.data;
    supplierListCache.set(key, data);
    return data;
  },

  getById: async (id) => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },

  create: async (supplierData) => {
    const response = await api.post('/suppliers', supplierData);
    clearSupplierListCache();
    return response.data;
  },

  update: async (id, supplierData) => {
    const response = await api.put(`/suppliers/${id}`, supplierData);
    clearSupplierListCache();
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/suppliers/${id}`);
    clearSupplierListCache();
    return response.data;
  }
};
