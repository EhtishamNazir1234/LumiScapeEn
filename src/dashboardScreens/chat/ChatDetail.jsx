import React, { useState, useRef, useEffect } from "react";
import profilePic from "../../assets/profile.svg";
import emogiIcon from "../../assets/emogiIcon.svg";
import gallaryIcon from "../../assets/gallaryIcon.svg";
import { useChat } from "../../store/hooks";
import { useAuth } from "../../store/hooks";
import { useChatSocket } from "../../contexts/ChatSocketContext";
import EmojiPicker from "emoji-picker-react";
import { compressImage } from "../../utils/imageCompress";
import { Trash2, X } from "lucide-react";

const formatMessageTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ChatDetails = ({ onBack }) => {
  const { user } = useAuth();
  const { activeChatId, activeChat, messages, sendMessage, addOptimisticMessage, deleteMessages, deleteChat, loadingMessages, sending, error, isUserOnline, typingInActiveChat } = useChat();
  const socketRef = useChatSocket();
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    if (!showEmojiPicker) return;
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) setShowEmojiPicker(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when opening or switching chat so user can type immediately
  useEffect(() => {
    if (activeChatId) {
      const t = setTimeout(() => textareaRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [activeChatId]);

  useEffect(() => {
    clearSelection();
  }, [activeChatId]);

  // Emit typing indicator (debounced) when user types
  useEffect(() => {
    const socket = socketRef?.current;
    if (!activeChatId || !socket?.connected) return;
    if (inputText.trim()) {
      socket.emit('typing_start', { chatId: activeChatId });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', { chatId: activeChatId });
      }, 2000);
    } else {
      socket.emit('typing_stop', { chatId: activeChatId });
    }
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [inputText, activeChatId, socketRef]);

  // Emit typing_stop when leaving chat or sending
  useEffect(() => {
    return () => {
      const socket = socketRef?.current;
      if (activeChatId && socket?.connected) {
        socket.emit('typing_stop', { chatId: activeChatId });
      }
    };
  }, [activeChatId, socketRef]);

  const handleSend = (e) => {
    e?.preventDefault();
    if ((!inputText.trim() && !pendingImage) || !activeChatId) return;
    const text = inputText.trim();
    const image = pendingImage || undefined;
    const tempId = `opt-${Date.now()}`;
    addOptimisticMessage({
      chatId: activeChatId,
      message: {
        _id: tempId,
        text: text || (image ? "[Image]" : ""),
        image: image || undefined,
        sender: user,
        senderName: user?.name,
        createdAt: new Date().toISOString(),
      },
    });
    setInputText("");
    setPendingImage(null);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socketRef?.current?.connected && socketRef.current.emit('typing_stop', { chatId: activeChatId });
    setTimeout(() => textareaRef.current?.focus(), 0);
    sendMessage(activeChatId, text, image, tempId).catch(() => {
      // Error handled in reducer (removes optimistic msg, sets error)
    });
  };

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData?.emoji || "";
    if (!emoji) return;
    const ta = textareaRef.current;
    if (ta) {
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newText = inputText.slice(0, start) + emoji + inputText.slice(end);
      setInputText(newText);
      setTimeout(() => ta.focus(), 0);
    } else {
      setInputText((prev) => prev + emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      if (typeof dataUrl !== "string") return;
      try {
        const compressed = await compressImage(dataUrl);
        setPendingImage(compressed);
      } catch {
        if (dataUrl.length < 5 * 1024 * 1024) setPendingImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const toggleSelect = (msgId) => {
    if (!msgId) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(msgId)) next.delete(msgId);
      else next.add(msgId);
      return next;
    });
  };

  const clearSelection = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = async () => {
    if (!activeChatId || selectedIds.size === 0) return;
    try {
      await deleteMessages(activeChatId, [...selectedIds]);
      clearSelection();
    } catch {
      // error in store
    }
  };

  const handleDeleteChat = async () => {
    if (!activeChatId || !window.confirm("Delete this chat and all messages?")) return;
    try {
      await deleteChat(activeChatId);
      onBack?.();
    } catch {
      // error in store
    }
  };

  const getOtherParticipant = () => {
    if (!activeChat?.participants?.length || !user?._id) return { _id: null, name: "Unknown", profileImage: null };
    const other = activeChat.participants.find((p) => p._id !== user._id);
    return other ? { _id: other._id, name: other.name || other.email, profileImage: other.profileImage } : { _id: null, name: "Unknown", profileImage: null };
  };

  if (!activeChatId) {
    return (
      <div className="global-bg-color w-full box-shadow rounded-2xl h-full flex flex-col items-center justify-center font-vivita text-gray-500">
        <p className="text-lg">Select a chat or start a new one</p>
      </div>
    );
  }

  const other = getOtherParticipant();
  const isOtherOnline = isUserOnline(other._id);
  const canSend = !!(inputText.trim() || pendingImage);

  return (
    <div className="global-bg-color w-full box-shadow rounded-2xl h-full flex flex-col font-vivita overflow-hidden">
      <div className="flex items-center justify-between border-b-[1px] p-3 xl:p-6 border-[#C5DCEB] pb-2 mb-3 shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-black/5"
              aria-label="Back to chats"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="w-12 h-12 xl:w-20 xl:h-20 shrink-0 aspect-square rounded-full overflow-hidden bg-gray-200">
            <img
              src={other.profileImage || profilePic}
              alt={other.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="text-xs xl:text-base font-medium">{other.name}</div>
            <div className="flex items-center p-0 space-x-1 text-xs md:text-sm">
              <span className={`text-lg md:text-xl ${isOtherOnline ? "text-[#86efac]" : "text-gray-400"}`}>•</span>
              <span className={`text-[10px] md:text-xs ${isOtherOnline ? "text-[#0060A9]" : "text-gray-500"}`}>
                {isOtherOnline ? "Active now" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {selectMode ? (
            <>
              <button
                type="button"
                onClick={handleDeleteSelected}
                disabled={selectedIds.size === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 text-sm"
              >
                <Trash2 size={16} />
                Delete ({selectedIds.size})
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="p-1.5 rounded hover:bg-black/5"
                aria-label="Cancel"
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setSelectMode(true)}
                className="text-sm text-[#0060A9] hover:underline"
              >
                Select
              </button>
              <button
                type="button"
                onClick={handleDeleteChat}
                className="p-1.5 rounded hover:bg-red-100 text-red-500"
                aria-label="Delete chat"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mx-3 p-2 rounded bg-red-100 text-red-700 text-sm shrink-0">{error}</div>
      )}

      <div className="overflow-auto flex-1 min-h-0">
        <div className="flex items-center gap-x-2 md:gap-x-10 justify-center my-2">
          <hr className="w-24 md:w-60 border-[#0060A9]" />
          <span className="text-gray-400 text-[10px] md:text-xs">
            {messages.length ? formatMessageTime(messages[0]?.createdAt) : "No messages yet"}
          </span>
          <hr className="w-24 md:w-60 border-[#0060A9]" />
        </div>
        <div className="border-b-[1px] border-[#C5DCEB] last:border-0 p-3 md:p-6">
          {loadingMessages ? (
            <div className="py-8 text-center text-gray-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No messages yet. Say hello!</div>
          ) : (
            messages.map((msg) => {
              const isSelf = msg.sender?._id === user?._id || msg.sender === user?._id;
              const senderName = msg.senderName || msg.sender?.name || (isSelf ? "You" : "Unknown");
              const senderAvatar = isSelf ? (user?.profileImage || profilePic) : (msg.sender?.profileImage || profilePic);
              const msgId = String(msg._id);
              const isSelected = selectMode && selectedIds.has(msgId);
              return (
                <div
                  key={msg._id}
                  className={`flex pb-2 md:pb-3 ${selectMode ? "cursor-pointer" : ""} ${isSelected ? "bg-[#C5DCEB]/20 rounded-lg -mx-2 px-2" : ""}`}
                  onClick={() => selectMode && toggleSelect(msgId)}
                >
                  {selectMode && (
                    <input
                      type="checkbox"
                      checked={!!isSelected}
                      onChange={() => toggleSelect(msgId)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 mr-2 shrink-0 w-4 h-4 rounded border-[#0060A9] text-[#0060A9]"
                    />
                  )}
                  <div className="w-8 h-8 xl:w-14 xl:h-14 shrink-0 aspect-square rounded-full overflow-hidden bg-gray-200">
                    <img
                      src={senderAvatar}
                      alt={senderName}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="rounded-xl px-3 xl:px-5 py-1 min-w-0">
                    <div
                      className={`text-sm xl:text-base mb-1 ${isSelf ? "text-[#0060A9]" : ""}`}
                    >
                      {senderName}
                      <span className="text-[10px] xl:text-xs text-gray-400 ml-2">
                        <span className="text-sm align-middle text-[#86efac]">•</span>{" "}
                        {formatMessageTime(msg.createdAt)}
                      </span>
                    </div>
                    {msg.image && (
                      <div className="mb-1 inline-block max-w-[200px] xl:max-w-[280px] rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                        <img
                          src={msg.image}
                          alt="Sent"
                          className="block max-w-full w-full h-auto align-top"
                          loading="lazy"
                        />
                      </div>
                    )}
                    {msg.text && msg.text !== "[Image]" && (
                      <div className="chat-emoji-safe text-gray-600 text-xs xl:text-base break-words">{msg.text}</div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          {typingInActiveChat?.length > 0 && (
            <div className="flex items-center gap-2 py-2 text-[#0060A9] text-sm">
              <span className="typing-indicator flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0060A9]" />
                <span className="w-2 h-2 rounded-full bg-[#0060A9]" />
                <span className="w-2 h-2 rounded-full bg-[#0060A9]" />
              </span>
              <span>
                {typingInActiveChat.map((t) => t.userName).join(', ')} typing...
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSend} className="p-3 md:p-6 shrink-0">
        {pendingImage && (
          <div className="mb-2 relative inline-block max-w-[200px] rounded-lg border border-[#AFCDE2] overflow-hidden bg-gray-50">
            <img
              src={pendingImage}
              alt="Preview"
              className="block max-w-full max-h-24 w-full h-auto object-contain object-top"
            />
            <button
              type="button"
              onClick={() => setPendingImage(null)}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-sm leading-none"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        )}
        <textarea
          ref={textareaRef}
          id="message"
          name="message"
          rows="2"
          placeholder="Enter your text here..."
          value={inputText}
          autoFocus
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="chat-emoji-safe border border-[#AFCDE2] rounded-xl p-3 w-full text-xs md:text-[14px] placeholder-[#9AC0DC] resize-none focus:outline-none focus:ring-2 focus:ring-[#0060A9]/30"
        />
        <div className="flex py-3 md:py-5 justify-between items-center w-full relative">
          <div className="flex gap-2 items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1 rounded hover:bg-black/5"
              aria-label="Attach image"
            >
              <img src={gallaryIcon} width={24} height={24} alt="" />
            </button>
            <button
              type="button"
              onClick={() => setShowEmojiPicker((p) => !p)}
              className="p-1 rounded hover:bg-black/5"
              aria-label="Insert emoji"
            >
              <img src={emogiIcon} width={24} height={24} alt="" />
            </button>
            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute bottom-full left-0 mb-1 z-20">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={320}
                  height={360}
                  theme="light"
                  previewConfig={{ showPreview: false }}
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="custom-shadow-button min-w-[100px]"
            disabled={!canSend}
          >
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatDetails;
