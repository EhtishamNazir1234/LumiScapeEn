import { useEffect, useRef } from 'react';
import { useStore } from 'react-redux';
import { io } from 'socket.io-client';
import { getSocketUrl } from '../services/chat.service';
import { chatActions } from '../store/slices/chatSlice';
import { addNotification } from '../store/slices/notificationSlice';

export default function ChatSocketListener() {
  const store = useStore();
  const socketRef = useRef(null);
  const prevActiveChatIdRef = useRef(null);

  useEffect(() => {
    const state = store.getState();
    const { user, isAuthenticated } = state.auth;
    if (!isAuthenticated || !user) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const socketUrl = getSocketUrl();
    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;
    prevActiveChatIdRef.current = null;

    socket.on('connect', () => {
      const activeChatId = store.getState().chat.activeChatId;
      if (activeChatId) {
        socket.emit('join_chat', activeChatId);
        prevActiveChatIdRef.current = activeChatId;
      }
    });

    socket.on('online_users', (userIds) => {
      const map = (Array.isArray(userIds) ? userIds : []).reduce(
        (acc, id) => ({ ...acc, [id]: true }),
        {}
      );
      store.dispatch(chatActions.setOnlineUsers(map));
    });
    socket.on('user_online', ({ userId }) => {
      if (userId) store.dispatch(chatActions.setUserOnline(userId));
    });
    socket.on('user_offline', ({ userId }) => {
      if (userId) store.dispatch(chatActions.setUserOffline(userId));
    });
    socket.on('connect_error', (err) => {
      console.warn('Chat socket connection error:', err.message);
    });

    socket.on('new_message', (message) => {
      const state = store.getState();
      const { user } = state.auth;
      const { activeChatId, chats } = state.chat;
      const isFromMe =
        message.sender?._id === user._id || message.sender === user._id;

      if (!isFromMe) {
        store.dispatch(chatActions.appendMessage({ chatId: message.chatId, message }));
      }
      if (!isFromMe && message.chatId !== activeChatId) {
        store.dispatch(chatActions.incrementUnreadForChat(message.chatId));
        const senderName =
          message.senderName || message.sender?.name || 'Someone';
        store.dispatch(
          addNotification({
            label: 'New message',
            message: `${senderName} sent you a message`,
            date: new Date().toLocaleDateString(),
          })
        );
      }
      store.dispatch(
        chatActions.updateChatLastMessage({
          chatId: message.chatId,
          text: message.text,
          createdAt: message.createdAt,
        })
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [store]);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const socket = socketRef.current;
      if (!socket) return;
      const activeChatId = store.getState().chat.activeChatId;
      const prev = prevActiveChatIdRef.current;
      if (prev !== activeChatId) {
        if (prev) socket.emit('leave_chat', prev);
        if (activeChatId) socket.emit('join_chat', activeChatId);
        prevActiveChatIdRef.current = activeChatId;
      }
    });
    const activeChatId = store.getState().chat.activeChatId;
    if (activeChatId && socketRef.current) {
      socketRef.current.emit('join_chat', activeChatId);
      prevActiveChatIdRef.current = activeChatId;
    }
    return unsubscribe;
  }, [store]);

  return null;
}
