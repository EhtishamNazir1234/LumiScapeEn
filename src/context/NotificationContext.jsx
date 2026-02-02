import React, { createContext, useState, useContext, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

let nextId = 1;
const genId = () => String(nextId++);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(({ label, message, date } = {}) => {
    const id = genId();
    setNotifications((prev) => [
      { id, label: label || 'Notification', message: message || '', isRead: false, date: date || new Date().toLocaleDateString() },
      ...prev,
    ]);
    return id;
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    unreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
