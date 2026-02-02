import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { chatService, getSocketUrl } from '../services/chat.service';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [onlineUserIds, setOnlineUserIds] = useState({});
  const [unreadByChatId, setUnreadByChatId] = useState({});

  const isUserOnline = useCallback((userId) => !!onlineUserIds[userId], [onlineUserIds]);
  const totalUnreadChatMessages = Object.values(unreadByChatId).reduce((sum, n) => sum + n, 0);

  const activeChat = chats.find((c) => c._id === activeChatId);

  const loadChats = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingChats(true);
    setError(null);
    try {
      const data = await chatService.getChats();
      setChats(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load chats');
      setChats([]);
    } finally {
      setLoadingChats(false);
    }
  }, [isAuthenticated]);

  const loadMessages = useCallback(async (chatId) => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    setError(null);
    try {
      const data = await chatService.getMessages(chatId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load messages');
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const loadAvailableUsers = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await chatService.getAvailableUsers();
      setAvailableUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setAvailableUsers([]);
    }
  }, [isAuthenticated]);

  const createChat = useCallback(async (participantId) => {
    setError(null);
    try {
      const newChat = await chatService.createChat(participantId);
      setChats((prev) =>
        prev.some((c) => c._id === newChat._id) ? prev : [newChat, ...prev]
      );
      setActiveChatId(newChat._id);
      return newChat;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create chat');
      throw err;
    }
  }, []);

  const sendMessage = useCallback(async (chatId, text, image = null) => {
    if (!text?.trim() && !image) return;
    setSending(true);
    setError(null);
    try {
      const msg = await chatService.sendMessage(chatId, text?.trim() || '', image);
      setMessages((prev) => [...prev, msg]);
      setChats((prev) =>
        prev.map((c) =>
          c._id === chatId
            ? { ...c, lastMessage: msg.text, lastMessageTime: msg.createdAt }
            : c
        )
      );
      return msg;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
      throw err;
    } finally {
      setSending(false);
    }
  }, []);

  // Socket connection when authenticated and on chat
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const socketUrl = getSocketUrl();
    const newSocket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {});

    newSocket.on('online_users', (userIds) => {
      const map = (Array.isArray(userIds) ? userIds : []).reduce((acc, id) => ({ ...acc, [id]: true }), {});
      setOnlineUserIds(map);
    });
    newSocket.on('user_online', ({ userId }) => {
      if (userId) setOnlineUserIds((prev) => ({ ...prev, [userId]: true }));
    });
    newSocket.on('user_offline', ({ userId }) => {
      if (userId) setOnlineUserIds((prev) => ({ ...prev, [userId]: false }));
    });

    newSocket.on('connect_error', (err) => {
      console.warn('Chat socket connection error:', err.message);
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [isAuthenticated, user]);

  // Realtime: listen for new_message (skip if we sent it – already added from API response)
  useEffect(() => {
    if (!socket || !user) return;
    const onNewMessage = (message) => {
      const isFromMe = message.sender?._id === user._id || message.sender === user._id;
      if (message.chatId === activeChatId && !isFromMe) {
        setMessages((prev) => [...prev, message]);
      }
      if (!isFromMe && message.chatId !== activeChatId) {
        setUnreadByChatId((prev) => ({
          ...prev,
          [message.chatId]: (prev[message.chatId] || 0) + 1,
        }));
        const senderName = message.senderName || message.sender?.name || 'Someone';
        addNotification({
          label: 'New message',
          message: `${senderName} sent you a message`,
          date: new Date().toLocaleDateString(),
        });
      }
      setChats((prev) =>
        prev.map((c) =>
          c._id === message.chatId
            ? {
                ...c,
                lastMessage: message.text,
                lastMessageTime: message.createdAt,
              }
            : c
        )
      );
    };
    socket.on('new_message', onNewMessage);
    return () => socket.off('new_message', onNewMessage);
  }, [socket, activeChatId, user, addNotification]);

  // Join/leave chat room when activeChatId changes
  useEffect(() => {
    if (!socket || !activeChatId) return;
    socket.emit('join_chat', activeChatId);
    return () => {
      socket.emit('leave_chat', activeChatId);
    };
  }, [socket, activeChatId]);

  // Load messages when active chat changes; clear unread for that chat
  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);
      setUnreadByChatId((prev) => ({ ...prev, [activeChatId]: 0 }));
    } else {
      setMessages([]);
    }
  }, [activeChatId, loadMessages]);

  const value = {
    socket,
    chats,
    setChats,
    activeChatId,
    setActiveChatId,
    activeChat,
    messages,
    availableUsers,
    loadChats,
    loadMessages,
    loadAvailableUsers,
    createChat,
    sendMessage,
    loadingChats,
    loadingMessages,
    sending,
    error,
    setError,
    isUserOnline,
    totalUnreadChatMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
