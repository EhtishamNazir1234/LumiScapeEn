import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { chatService } from '../../services/chat.service';

function normalizeMessageId(v) {
  if (v == null) return null;
  if (typeof v === 'string') return v;
  if (typeof v === 'object' && v.$oid) return v.$oid;
  return String(v);
}

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

export const deleteChat = createAsyncThunk(
  'chat/deleteChat',
  async (chatId, { rejectWithValue }) => {
    try {
      await chatService.deleteChat(chatId);
      return chatId;
    } catch (err) {
      // If the backend says 404 Chat not found, treat as already deleted
      const status = err.response?.status;
      if (status === 404) {
        return chatId;
      }
      return rejectWithValue(err.response?.data?.message || 'Failed to delete chat');
    }
  }
);

export const deleteMessages = createAsyncThunk(
  'chat/deleteMessages',
  async ({ chatId, messageIds }, { rejectWithValue }) => {
    try {
      const result = await chatService.deleteMessages(chatId, messageIds);
      return { chatId, messageIds, lastMessage: result.lastMessage };
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        // Chat or messages already gone – treat as success
        return { chatId, messageIds, lastMessage: null };
      }
      return rejectWithValue(err.response?.data?.message || 'Failed to delete messages');
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
    sendingCount: 0,
    error: null,
    onlineUserIds: {},
    unreadByChatId: {},
    typingByChatId: {}, // { [chatId]: { userId, userName, ts } }
  },
  reducers: {
    setActiveChatId: (state, action) => {
      state.activeChatId = action.payload != null ? String(action.payload) : null;
      if (action.payload) {
        state.unreadByChatId[String(action.payload)] = 0;
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
    setUserTyping: (state, action) => {
      const { chatId, userId, userName } = action.payload;
      const id = chatId != null ? String(chatId) : null;
      if (!id) return;
      if (!state.typingByChatId[id]) state.typingByChatId[id] = {};
      const uid = userId != null ? String(userId) : null;
      if (uid) state.typingByChatId[id][uid] = { userName: userName || 'Someone', ts: Date.now() };
    },
    setUserStoppedTyping: (state, action) => {
      const { chatId, userId } = action.payload;
      const id = chatId != null ? String(chatId) : null;
      if (!id || !state.typingByChatId[id]) return;
      const uid = userId != null ? String(userId) : null;
      if (uid) delete state.typingByChatId[id][uid];
      if (Object.keys(state.typingByChatId[id]).length === 0) {
        delete state.typingByChatId[id];
      }
    },
    appendMessage: (state, action) => {
      const { chatId, message } = action.payload;
      const id = String(chatId);
      if (!state.messagesByChatId[id]) state.messagesByChatId[id] = [];
      const list = state.messagesByChatId[id];
      const msgId = normalizeMessageId(message._id);
      const existingIdx = msgId ? list.findIndex((m) => normalizeMessageId(m._id) === msgId) : -1;
      if (existingIdx !== -1) {
        list[existingIdx] = message;
      } else {
        list.push(message);
      }
    },
    addOptimisticMessage: (state, action) => {
      const { chatId, message } = action.payload;
      const id = String(chatId);
      if (!state.messagesByChatId[id]) state.messagesByChatId[id] = [];
      state.messagesByChatId[id].push(message);
    },
    removeOptimisticMessage: (state, action) => {
      const { chatId, tempId } = action.payload;
      const list = state.messagesByChatId[String(chatId)];
      if (list) {
        const idx = list.findIndex((m) => m._id === tempId);
        if (idx !== -1) list.splice(idx, 1);
      }
    },
    updateChatLastMessage: (state, action) => {
      const { chatId, text, createdAt } = action.payload;
      const id = String(chatId);
      const chat = state.chats.find((c) => String(c._id) === id);
      if (chat) {
        chat.lastMessage = text;
        chat.lastMessageTime = createdAt;
      }
    },
    incrementUnreadForChat: (state, action) => {
      const chatId = String(action.payload);
      state.unreadByChatId[chatId] = (state.unreadByChatId[chatId] || 0) + 1;
    },
    resetChatState: (state) => {
      state.chats = [];
      state.activeChatId = null;
      state.messagesByChatId = {};
      state.availableUsers = [];
      state.unreadByChatId = {};
      state.typingByChatId = {};
    },
    clearAllChatUnreads: (state) => {
      state.unreadByChatId = {};
    },
    removeMessages: (state, action) => {
      const { chatId, messageIds } = action.payload;
      const id = String(chatId);
      const list = state.messagesByChatId[id];
      if (!list) return;
      const ids = new Set(action.payload.messageIds.map(String));
      state.messagesByChatId[id] = list.filter((m) => !ids.has(String(m._id)));
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
        if (chatId) state.messagesByChatId[String(chatId)] = messages;
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
        const newId = newChat._id != null ? String(newChat._id) : null;
        if (newId && !state.chats.some((c) => String(c._id) === newId)) {
          state.chats.unshift(newChat);
        }
        state.activeChatId = newId;
        state.error = null;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.sendingCount += 1;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingCount = Math.max(0, state.sendingCount - 1);
        const { chatId, message, tempId } = action.payload;
        const id = String(chatId);
        if (!state.messagesByChatId[id]) state.messagesByChatId[id] = [];
        const list = state.messagesByChatId[id];
        if (tempId) {
          const idx = list.findIndex((m) => m._id === tempId);
          if (idx !== -1) list[idx] = message;
          else list.push(message);
        } else {
          list.push(message);
        }
        const realId = normalizeMessageId(message._id);
        if (realId) {
          const result = [];
          let slotForRealId = -1;
          list.forEach((m) => {
            const mid = normalizeMessageId(m._id);
            if (mid === realId) {
              if (slotForRealId === -1) {
                result.push(message);
                slotForRealId = result.length - 1;
              } else {
                result[slotForRealId] = message;
              }
            } else {
              result.push(m);
            }
          });
          if (slotForRealId === -1) result.push(message);
          state.messagesByChatId[id] = result;
        }
        const chat = state.chats.find((c) => String(c._id) === id);
        if (chat) {
          chat.lastMessage = message.text;
          chat.lastMessageTime = message.createdAt;
        }
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        const chatId = String(action.payload);
        state.chats = state.chats.filter((c) => String(c._id) !== chatId);
        delete state.messagesByChatId[chatId];
        if (String(state.activeChatId) === chatId) state.activeChatId = null;
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteMessages.fulfilled, (state, action) => {
        const { chatId, messageIds, lastMessage } = action.payload;
        const id = String(chatId);
        const list = state.messagesByChatId[id];
        if (list) {
          const ids = new Set(messageIds.map(String));
          state.messagesByChatId[id] = list.filter((m) => !ids.has(String(m._id)));
        }
        const chat = state.chats.find((c) => String(c._id) === id);
        if (chat && lastMessage !== undefined) {
          chat.lastMessage = lastMessage ? (lastMessage.text || (lastMessage.image ? '[Image]' : '')) : null;
          chat.lastMessageTime = lastMessage ? lastMessage.createdAt : null;
        }
      })
      .addCase(deleteMessages.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingCount = Math.max(0, state.sendingCount - 1);
        const payload = action.payload;
        state.error = typeof payload === 'object' && payload?.error ? payload.error : payload;
        const arg = action.meta?.arg;
        if (arg?.chatId && arg?.tempId) {
          const list = state.messagesByChatId[String(arg.chatId)];
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
    const id = String(chatId);
    dispatch(setActiveChatId(id));
    dispatch(clearUnreadForChat(id));
    const { messagesByChatId } = getState().chat;
    if (messagesByChatId[id] === undefined) {
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
  if (!activeChatId) return null;
  const id = String(activeChatId);
  return chats.find((c) => c._id != null && String(c._id) === id) ?? null;
};
const EMPTY_MESSAGES = [];
export const selectMessagesForActiveChat = createSelector(
  [selectActiveChatId, selectMessagesByChatId],
  (activeChatId, messagesByChatId) =>
    activeChatId ? (messagesByChatId[String(activeChatId)] ?? EMPTY_MESSAGES) : EMPTY_MESSAGES
);
export const selectTotalUnreadChatMessages = (state) =>
  Object.values(state.chat.unreadByChatId).reduce((sum, n) => sum + n, 0);
export const selectIsUserOnline = (state, userId) => !!state.chat.onlineUserIds[userId];
const EMPTY_TYPING = [];
export const selectTypingInActiveChat = createSelector(
  [
    (state) => state.chat.activeChatId,
    (state) => state.chat.typingByChatId,
    (state) => state.auth.user?._id,
  ],
  (activeChatId, typingByChatId, myId) => {
    const chatKey = activeChatId ? String(activeChatId) : null;
    if (!chatKey || !typingByChatId?.[chatKey]) return EMPTY_TYPING;
    const myIdStr = myId ? String(myId) : null;
    const list = Object.entries(typingByChatId[chatKey])
      .filter(([uid]) => uid !== myIdStr)
      .map(([uid, v]) => ({ userId: uid, userName: v?.userName || 'Someone' }));
    return list.length ? list : EMPTY_TYPING;
  }
);
