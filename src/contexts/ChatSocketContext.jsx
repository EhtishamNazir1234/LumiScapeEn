import { createContext, useContext, useEffect, useRef } from 'react';
import { useStore, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { getSocketUrl } from '../services/chat.service';
import { chatActions, loadChats } from '../store/slices/chatSlice';
import { addNotification } from '../store/slices/notificationSlice';

function normalizeChatId(v) {
  if (v == null) return v;
  if (typeof v === 'string') return v;
  if (typeof v === 'object' && v.$oid) return v.$oid;
  return String(v);
}

const ChatSocketContext = createContext(null);

export function ChatSocketProvider({ children }) {
  const store = useStore();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const socketRef = useRef(null);
  const prevActiveChatIdRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(getSocketUrl(), {
      auth: { token },
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;
    prevActiveChatIdRef.current = null;

    socket.on('connect', () => {
      const { chats, activeChatId } = store.getState().chat;
      (chats || []).forEach((c) => {
        if (c._id) socket.emit('join_chat', String(c._id));
      });
      if (activeChatId) prevActiveChatIdRef.current = activeChatId;
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

    socket.on('user_typing', ({ chatId, userId, userName }) => {
      if (userId && chatId) {
        store.dispatch(chatActions.setUserTyping({
          chatId: normalizeChatId(chatId),
          userId,
          userName,
        }));
      }
    });
    socket.on('user_stopped_typing', ({ chatId, userId }) => {
      if (userId && chatId) {
        store.dispatch(chatActions.setUserStoppedTyping({
          chatId: normalizeChatId(chatId),
          userId,
        }));
      }
    });

    socket.on('new_message', (message) => {
      const state = store.getState();
      const { user: currentUser } = state.auth;
      const { activeChatId } = state.chat;
      const chatId = normalizeChatId(message.chatId);
      const senderId = message.sender?._id ?? message.sender;
      const isFromMe = currentUser && (senderId === currentUser._id || String(senderId) === String(currentUser._id));

      store.dispatch(chatActions.appendMessage({ chatId, message }));
      if (!isFromMe && String(chatId) !== String(activeChatId)) {
        store.dispatch(chatActions.incrementUnreadForChat(chatId));
        const senderName = message.senderName || message.sender?.name || 'Someone';
        store.dispatch(
          addNotification({
            label: 'New message',
            date: new Date().toLocaleDateString(),
            // Always navigate to /chat and let the chat
            // screen open the right conversation based on state.
            link: `/chat`,
            chatId,
            senderName,
          })
        );
      }
      store.dispatch(
        chatActions.updateChatLastMessage({
          chatId: String(chatId),
          text: message.text,
          createdAt: message.createdAt,
        })
      );

      const latestState = store.getState();
      const existsInList = (latestState.chat.chats || []).some(
        (c) => String(c._id) === String(chatId)
      );
      if (!existsInList) {
        store.dispatch(loadChats());
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [store, isAuthenticated, user?._id]);

  useEffect(() => {
    if (!socketRef.current) return;
    const joinedChatIdsRef = { current: new Set() };
    const unsubscribe = store.subscribe(() => {
      const socket = socketRef.current;
      if (!socket || !socket.connected) return;
      const { chats, activeChatId } = store.getState().chat;
      const chatIds = (chats || []).map((c) => (c._id ? String(c._id) : null)).filter(Boolean);
      chatIds.forEach((id) => {
        if (!joinedChatIdsRef.current.has(id)) {
          socket.emit('join_chat', id);
          joinedChatIdsRef.current.add(id);
        }
      });
      prevActiveChatIdRef.current = activeChatId;
    });
    const { chats, activeChatId } = store.getState().chat;
    const socket = socketRef.current;
    if (socket?.connected) {
      (chats || []).forEach((c) => {
        if (c._id) {
          const id = String(c._id);
          socket.emit('join_chat', id);
          joinedChatIdsRef.current.add(id);
        }
      });
      if (activeChatId) prevActiveChatIdRef.current = activeChatId;
    }
    return unsubscribe;
  }, [store, isAuthenticated]);

  return (
    <ChatSocketContext.Provider value={socketRef}>
      {children}
    </ChatSocketContext.Provider>
  );
}

export function useChatSocket() {
  return useContext(ChatSocketContext);
}
