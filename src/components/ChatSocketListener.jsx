import { useEffect, useRef } from 'react';
import { useStore, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { getSocketUrl } from '../services/chat.service';
import { chatActions } from '../store/slices/chatSlice';
import { addNotification } from '../store/slices/notificationSlice';

export default function ChatSocketListener() {
  const store = useStore();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const socketRef = useRef(null);
  const prevActiveChatIdRef = useRef(null);

  // Connect socket when user is authenticated; re-run when auth becomes ready
  useEffect(() => {
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
      const { chats, activeChatId } = store.getState().chat;
      // Join all chat rooms so we receive new messages for every chat (not only the active one)
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

    socket.on('new_message', (message) => {
      const state = store.getState();
      const { user: currentUser } = state.auth;
      const { activeChatId } = state.chat;
      const chatId = message.chatId ? String(message.chatId) : message.chatId;
      const senderId = message.sender?._id ?? message.sender;
      const isFromMe = currentUser && (senderId === currentUser._id || String(senderId) === String(currentUser._id));

      if (!isFromMe) {
        store.dispatch(chatActions.appendMessage({ chatId, message }));
      }
      if (!isFromMe && chatId !== activeChatId) {
        store.dispatch(chatActions.incrementUnreadForChat(chatId));
        const senderName =
          message.senderName || message.sender?.name || 'Someone';
        store.dispatch(
          addNotification({
            label: 'New message',
            date: new Date().toLocaleDateString(),
            // Always go to /chat; we pass chatId via state so the chat
            // screen can open the specific conversation.
            link: `/chat`,
            chatId,
            senderName,
          })
        );
      }
      store.dispatch(
        chatActions.updateChatLastMessage({
          chatId,
          text: message.text,
          createdAt: message.createdAt,
        })
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [store, isAuthenticated, user?._id]);

  // Join all chat rooms when chats load/update; sync activeChatId for leave/join
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
      const prev = prevActiveChatIdRef.current;
      if (prev !== activeChatId) {
        prevActiveChatIdRef.current = activeChatId;
      }
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

  return null;
}
