import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatService } from '../../services/chat.service';

export const loadChats = createAsyncThunk(
  'chat/loadChats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await chatService.getChats();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load chats');
    }
  }
);

export const loadMessages = createAsyncThunk(
  'chat/loadMessages',
  async (chatId, { rejectWithValue }) => {
    if (!chatId) return { chatId: null, messages: [] };
    try {
      const data = await chatService.getMessages(chatId);
      return { chatId, messages: Array.isArray(data) ? data : [] };
    } catch (err) {
      return rejectWithValue({ chatId, error: err.response?.data?.message || 'Failed to load messages' });
    }
  }
);

export const loadAvailableUsers = createAsyncThunk(
  'chat/loadAvailableUsers',
  async (_, { rejectWithValue }) => {
    try {
      const data = await chatService.getAvailableUsers();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createChat = createAsyncThunk(
  'chat/createChat',
  async (participantId, { rejectWithValue }) => {
    try {
      const newChat = await chatService.createChat(participantId);
      return newChat;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create chat');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, text, image, tempId }, { getState, rejectWithValue }) => {
    if (!text?.trim() && !image) return rejectWithValue(new Error('Empty message'));
    try {
      const msg = await chatService.sendMessage(chatId, text?.trim() || '', image);
      return { chatId, message: msg, tempId };
    } catch (err) {
      return rejectWithValue({ error: err.response?.data?.message || 'Failed to send message', tempId });
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    activeChatId: null,
    messagesByChatId: {},
    availableUsers: [],
    loadingChats: false,
    loadingMessages: false,
    sending: false,
    error: null,
    onlineUserIds: {},
    unreadByChatId: {},
  },
  reducers: {
    setActiveChatId: (state, action) => {
      state.activeChatId = action.payload;
      if (action.payload) {
        state.unreadByChatId[action.payload] = 0;
      }
    },
    clearUnreadForChat: (state, action) => {
      const chatId = action.payload;
      if (chatId) state.unreadByChatId[chatId] = 0;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUserIds = action.payload;
    },
    setUserOnline: (state, action) => {
      const userId = action.payload;
      if (userId) state.onlineUserIds[userId] = true;
    },
    setUserOffline: (state, action) => {
      const userId = action.payload;
      if (userId) state.onlineUserIds[userId] = false;
    },
    appendMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messagesByChatId[chatId]) state.messagesByChatId[chatId] = [];
      state.messagesByChatId[chatId].push(message);
    },
    addOptimisticMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messagesByChatId[chatId]) state.messagesByChatId[chatId] = [];
      state.messagesByChatId[chatId].push(message);
    },
    removeOptimisticMessage: (state, action) => {
      const { chatId, tempId } = action.payload;
      const list = state.messagesByChatId[chatId];
      if (list) {
        const idx = list.findIndex((m) => m._id === tempId);
        if (idx !== -1) list.splice(idx, 1);
      }
    },
    updateChatLastMessage: (state, action) => {
      const { chatId, text, createdAt } = action.payload;
      const chat = state.chats.find((c) => c._id === chatId);
      if (chat) {
        chat.lastMessage = text;
        chat.lastMessageTime = createdAt;
      }
    },
    incrementUnreadForChat: (state, action) => {
      const chatId = action.payload;
      state.unreadByChatId[chatId] = (state.unreadByChatId[chatId] || 0) + 1;
    },
    resetChatState: (state) => {
      state.chats = [];
      state.activeChatId = null;
      state.messagesByChatId = {};
      state.availableUsers = [];
      state.unreadByChatId = {};
    },
    clearAllChatUnreads: (state) => {
      state.unreadByChatId = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadChats.pending, (state) => {
        state.loadingChats = true;
        state.error = null;
      })
      .addCase(loadChats.fulfilled, (state, action) => {
        state.loadingChats = false;
        state.chats = action.payload;
      })
      .addCase(loadChats.rejected, (state, action) => {
        state.loadingChats = false;
        state.error = action.payload;
        state.chats = [];
      })
      .addCase(loadMessages.pending, (state) => {
        state.loadingMessages = true;
        state.error = null;
      })
      .addCase(loadMessages.fulfilled, (state, action) => {
        state.loadingMessages = false;
        const { chatId, messages } = action.payload;
        if (chatId) state.messagesByChatId[chatId] = messages;
      })
      .addCase(loadMessages.rejected, (state, action) => {
        state.loadingMessages = false;
        if (action.payload?.error) state.error = action.payload.error;
      })
      .addCase(loadAvailableUsers.fulfilled, (state, action) => {
        state.availableUsers = action.payload;
      })
      .addCase(loadAvailableUsers.rejected, (state) => {
        state.availableUsers = [];
      })
      .addCase(createChat.fulfilled, (state, action) => {
        const newChat = action.payload;
        if (!state.chats.some((c) => c._id === newChat._id)) {
          state.chats.unshift(newChat);
        }
        state.activeChatId = newChat._id;
        state.error = null;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        const { chatId, message, tempId } = action.payload;
        const list = state.messagesByChatId[chatId];
        if (list && tempId) {
          const idx = list.findIndex((m) => m._id === tempId);
          if (idx !== -1) list[idx] = message;
          else list.push(message);
        } else {
          if (!state.messagesByChatId[chatId]) state.messagesByChatId[chatId] = [];
          state.messagesByChatId[chatId].push(message);
        }
        const chat = state.chats.find((c) => c._id === chatId);
        if (chat) {
          chat.lastMessage = message.text;
          chat.lastMessageTime = message.createdAt;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        const payload = action.payload;
        state.error = typeof payload === 'object' && payload?.error ? payload.error : payload;
        const arg = action.meta?.arg;
        if (arg?.chatId && arg?.tempId) {
          const list = state.messagesByChatId[arg.chatId];
          if (list) {
            const idx = list.findIndex((m) => m._id === arg.tempId);
            if (idx !== -1) list.splice(idx, 1);
          }
        }
      });
  },
});

export default chatSlice.reducer;
export const chatActions = chatSlice.actions;
const { setActiveChatId, clearUnreadForChat } = chatSlice.actions;

/**
 * Select a chat: set active, clear unread, load messages only if not already cached.
 */
export const selectChat = createAsyncThunk(
  'chat/selectChat',
  async (chatId, { getState, dispatch }) => {
    if (!chatId) {
      dispatch(setActiveChatId(null));
      return;
    }
    dispatch(setActiveChatId(chatId));
    dispatch(clearUnreadForChat(chatId));
    const { messagesByChatId } = getState().chat;
    if (messagesByChatId[chatId] === undefined) {
      await dispatch(loadMessages(chatId)).unwrap();
    }
  }
);

// Selectors
export const selectChats = (state) => state.chat.chats;
export const selectActiveChatId = (state) => state.chat.activeChatId;
export const selectMessagesByChatId = (state) => state.chat.messagesByChatId;
export const selectActiveChat = (state) => {
  const { chats, activeChatId } = state.chat;
  return chats.find((c) => c._id === activeChatId) ?? null;
};
export const selectMessagesForActiveChat = (state) => {
  const { activeChatId, messagesByChatId } = state.chat;
  return activeChatId ? (messagesByChatId[activeChatId] || []) : [];
};
export const selectTotalUnreadChatMessages = (state) =>
  Object.values(state.chat.unreadByChatId).reduce((sum, n) => sum + n, 0);
export const selectIsUserOnline = (state, userId) => !!state.chat.onlineUserIds[userId];
