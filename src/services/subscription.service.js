import api from './api';

const subscriptionListCache = new Map();
const planListCache = new Map();
const revenueCache = { data: null };

const getKey = (params = {}) => JSON.stringify(params || {});
const clearSubscriptionCaches = () => {
  subscriptionListCache.clear();
  planListCache.clear();
  revenueCache.data = null;
};

export const subscriptionService = {
  getAll: async (params = {}) => {
    const key = getKey(params);
    if (subscriptionListCache.has(key)) {
      return subscriptionListCache.get(key);
    }
    const response = await api.get('/subscriptions', { params });
    const data = response.data;
    subscriptionListCache.set(key, data);
    return data;
  },

  getPlans: async (billingCycle) => {
    const params = billingCycle ? { billingCycle } : {};
    const key = getKey(params);
    if (planListCache.has(key)) {
      return planListCache.get(key);
    }
    const response = await api.get('/subscriptions/plans', { params });
    const data = response.data;
    planListCache.set(key, data);
    return data;
  },

  createPlan: async (planData) => {
    const response = await api.post('/subscriptions/plans', planData);
    clearSubscriptionCaches();
    return response.data;
  },

  updatePlan: async (id, planData) => {
    const response = await api.put(`/subscriptions/plans/${id}`, planData);
    clearSubscriptionCaches();
    return response.data;
  },

  create: async (subscriptionData) => {
    const response = await api.post('/subscriptions', subscriptionData);
    clearSubscriptionCaches();
    return response.data;
  },

  createCheckoutSession: async (planId, userId) => {
    const payload = userId ? { planId, userId } : { planId };
    const response = await api.post('/subscriptions/create-checkout-session', payload);
    return response.data;
  },

  getRevenue: async () => {
    if (revenueCache.data) {
      return revenueCache.data;
    }
    const response = await api.get('/subscriptions/revenue');
    revenueCache.data = response.data;
    return response.data;
  }
};
