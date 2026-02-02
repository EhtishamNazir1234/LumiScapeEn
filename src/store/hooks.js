import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useCallback } from 'react';
import {
  selectUnreadCount,
  addNotification as addNotificationAction,
  markAsRead as markAsReadAction,
  markAllAsRead as markAllAsReadAction,
} from './slices/notificationSlice';
import {
  login as loginThunk,
  logout,
  updateProfile as updateProfileThunk,
  setUser,
} from './slices/authSlice';
import {
  selectChats,
  selectActiveChatId,
  selectActiveChat,
  selectMessagesForActiveChat,
  selectTotalUnreadChatMessages,
  loadChats as loadChatsThunk,
  loadAvailableUsers as loadAvailableUsersThunk,
  createChat as createChatThunk,
  sendMessage as sendMessageThunk,
  selectChat as selectChatThunk,
  chatActions,
} from './slices/chatSlice';

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      login: (email, password, rememberMe = false) =>
        dispatch(loginThunk({ email, password, rememberMe })).unwrap(),
      logout: () => dispatch(logout()),
      updateProfile: (data) => dispatch(updateProfileThunk(data)).unwrap(),
      setUser: (u) => dispatch(setUser(u)),
    }),
    [dispatch, user, loading, isAuthenticated]
  );
};

export const useNotifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notification.notifications);
  const unreadCount = useSelector(selectUnreadCount);
  return useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification: (payload) => dispatch(addNotificationAction(payload)),
      markAsRead: (id) => dispatch(markAsReadAction(id)),
      markAllAsRead: () => dispatch(markAllAsReadAction()),
    }),
    [dispatch, notifications, unreadCount]
  );
};

export const useChat = () => {
  const dispatch = useDispatch();
  const chats = useSelector(selectChats);
  const activeChatId = useSelector(selectActiveChatId);
  const activeChat = useSelector(selectActiveChat);
  const messages = useSelector(selectMessagesForActiveChat);
  const availableUsers = useSelector((state) => state.chat.availableUsers);
  const loadingChats = useSelector((state) => state.chat.loadingChats);
  const loadingMessages = useSelector((state) => state.chat.loadingMessages);
  const sending = useSelector((state) => state.chat.sending);
  const error = useSelector((state) => state.chat.error);
  const totalUnreadChatMessages = useSelector(selectTotalUnreadChatMessages);
  const onlineUserIds = useSelector((state) => state.chat.onlineUserIds);

  const isUserOnline = useCallback(
    (userId) => !!onlineUserIds[userId],
    [onlineUserIds]
  );

  return useMemo(
    () => ({
      chats,
      activeChatId,
      setActiveChatId: (id) => dispatch(chatActions.setActiveChatId(id)),
      activeChat,
      messages,
      availableUsers,
      loadChats: () => dispatch(loadChatsThunk()),
      loadMessages: (chatId) => dispatch(loadMessagesThunk(chatId)),
      loadAvailableUsers: () => dispatch(loadAvailableUsersThunk()),
      createChat: (participantId) => dispatch(createChatThunk(participantId)).unwrap(),
      sendMessage: (chatId, text, image = null, tempId = null) =>
        dispatch(sendMessageThunk({ chatId, text, image, tempId })).unwrap(),
      addOptimisticMessage: (payload) => dispatch(chatActions.addOptimisticMessage(payload)),
      selectChat: (chatId) => dispatch(selectChatThunk(chatId)),
      loadingChats,
      loadingMessages,
      sending,
      error,
      setError: (e) => dispatch(chatActions.setError(e)),
      isUserOnline,
      totalUnreadChatMessages,
    }),
    [
      dispatch,
      chats,
      activeChatId,
      activeChat,
      messages,
      availableUsers,
      loadingChats,
      loadingMessages,
      sending,
      error,
      isUserOnline,
      totalUnreadChatMessages,
    ]
  );
};
