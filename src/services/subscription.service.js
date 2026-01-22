import api from './api';

export const subscriptionService = {
  getAll: async (params = {}) => {
    const response = await api.get('/subscriptions', { params });
    return response.data;
  },

  getPlans: async (billingCycle) => {
    const params = billingCycle ? { billingCycle } : {};
    const response = await api.get('/subscriptions/plans', { params });
    return response.data;
  },

  createPlan: async (planData) => {
    const response = await api.post('/subscriptions/plans', planData);
    return response.data;
  },

  updatePlan: async (id, planData) => {
    const response = await api.put(`/subscriptions/plans/${id}`, planData);
    return response.data;
  },

  create: async (subscriptionData) => {
    const response = await api.post('/subscriptions', subscriptionData);
    return response.data;
  },

  getRevenue: async () => {
    const response = await api.get('/subscriptions/revenue');
    return response.data;
  }
};
