import { createSlice } from '@reduxjs/toolkit';

let nextId = 1;
const genId = () => String(nextId++);

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
  },
  reducers: {
    addNotification: (state, action) => {
      const { label = 'Notification', message = '', date, link, chatId, senderName } = action.payload;
      if (chatId && senderName) {
        const existing = state.notifications.find(
          (n) => n.chatId === chatId && !n.isRead
        );
        if (existing) {
          existing.count = (existing.count || 1) + 1;
          existing.message = `You have ${existing.count} messages from '${senderName}'`;
          existing.date = date || new Date().toLocaleDateString();
          return;
        }
      }
      state.notifications.unshift({
        id: genId(),
        label,
        message: message || (senderName ? `You have 1 message from '${senderName}'` : ''),
        isRead: false,
        date: date || new Date().toLocaleDateString(),
        link: link || null,
        chatId: chatId || null,
        count: 1,
      });
    },
    markAsRead: (state, action) => {
      const id = action.payload;
      const n = state.notifications.find((x) => x.id === id);
      if (n) n.isRead = true;
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => (n.isRead = true));
    },
    removeNotification: (state, action) => {
      const id = action.payload;
      state.notifications = state.notifications.filter((x) => x.id !== id);
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, removeNotification } = notificationSlice.actions;

export const selectUnreadCount = (state) =>
  state.notification.notifications.filter((n) => !n.isRead).length;

export default notificationSlice.reducer;
