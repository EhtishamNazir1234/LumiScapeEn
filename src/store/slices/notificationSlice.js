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
      const { label = 'Notification', message = '', date } = action.payload;
      state.notifications.unshift({
        id: genId(),
        label,
        message,
        isRead: false,
        date: date || new Date().toLocaleDateString(),
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
  },
});

export const { addNotification, markAsRead, markAllAsRead } = notificationSlice.actions;

export const selectUnreadCount = (state) =>
  state.notification.notifications.filter((n) => !n.isRead).length;

export default notificationSlice.reducer;
