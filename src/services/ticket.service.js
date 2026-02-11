import api from './api';

const ticketListCache = new Map();
const ticketStatsCache = { data: null };
const getTicketKey = (params = {}) => JSON.stringify(params || {});
const clearTicketCaches = () => {
  ticketListCache.clear();
  ticketStatsCache.data = null;
};

export const ticketService = {
  getAll: async (params = {}) => {
    const key = getTicketKey(params);
    if (ticketListCache.has(key)) {
      return ticketListCache.get(key);
    }
    const response = await api.get('/tickets', { params });
    const data = response.data;
    ticketListCache.set(key, data);
    return data;
  },

  getStats: async () => {
    if (ticketStatsCache.data) {
      return ticketStatsCache.data;
    }
    const response = await api.get('/tickets/stats');
    ticketStatsCache.data = response.data;
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  create: async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    clearTicketCaches();
    return response.data;
  },

  update: async (id, ticketData) => {
    const response = await api.put(`/tickets/${id}`, ticketData);
    clearTicketCaches();
    return response.data;
  },

  assign: async (id, assignedTo) => {
    const response = await api.put(`/tickets/${id}/assign`, { assignedTo });
    clearTicketCaches();
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    clearTicketCaches();
    return response.data;
  }
};
