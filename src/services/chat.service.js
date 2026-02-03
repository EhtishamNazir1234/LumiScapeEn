import api from './api';

const getSocketBaseUrl = () => {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return base.replace(/\/api\/?$/, '');
};

export const getSocketUrl = getSocketBaseUrl;

export const chatService = {
  getChats: async () => {
    const response = await api.get('/chat');
    return response.data;
  },

  getAvailableUsers: async () => {
    const response = await api.get('/chat/available-users');
    return response.data;
  },

  getMessages: async (chatId) => {
    const response = await api.get(`/chat/${chatId}/messages`);
    return response.data;
  },

  createChat: async (participantId) => {
    const response = await api.post('/chat', { participantId });
    return response.data;
  },

  sendMessage: async (chatId, text, image = null) => {
    const payload = image ? { text: text || '', image } : { text: text || '' };
    const response = await api.post(`/chat/${chatId}/messages`, payload);
    return response.data;
  },

  deleteChat: async (chatId) => {
    const response = await api.delete(`/chat/${chatId}`);
    return response.data;
  },

  deleteMessages: async (chatId, messageIds) => {
    const response = await api.delete(`/chat/${chatId}/messages`, {
      data: { messageIds: Array.isArray(messageIds) ? messageIds : [messageIds] },
    });
    return response.data;
  },
};
