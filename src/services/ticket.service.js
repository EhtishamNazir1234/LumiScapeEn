import api from './api';

export const ticketService = {
  getAll: async (params = {}) => {
    const response = await api.get('/tickets', { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/tickets/stats');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  create: async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  update: async (id, ticketData) => {
    const response = await api.put(`/tickets/${id}`, ticketData);
    return response.data;
  },

  assign: async (id, assignedTo) => {
    const response = await api.put(`/tickets/${id}/assign`, { assignedTo });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  }
};
