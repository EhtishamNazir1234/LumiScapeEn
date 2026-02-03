import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/hooks";
import { useChat } from "../../store/hooks";
import { chatActions, loadChats, selectChats } from "../../store/slices/chatSlice";
import ChatSideBar from "./ChatSideBar";
import ChatDetails from "./ChatDetail";

const Chat = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { chatId: urlChatId } = useParams();
  const { isAuthenticated } = useAuth();
  const { activeChatId, setActiveChatId, selectChat } = useChat();
  const chats = useSelector(selectChats);
  const loadingChats = useSelector((state) => state.chat.loadingChats);
  const hasTriggeredLoad = useRef(false);

  // Clear chat badge when user lands on chat page (clicked chat icon)
  useEffect(() => {
    dispatch(chatActions.clearAllChatUnreads());
  }, [dispatch]);

  // Sync URL chatId with active chat (each chat has its own room via URL)
  useEffect(() => {
    const openChatId = location.state?.openChatId || urlChatId;
    if (openChatId && openChatId !== activeChatId) {
      selectChat(openChatId);
      if (location.state?.openChatId) window.history.replaceState({}, '', location.pathname);
    } else if (!urlChatId && activeChatId) {
      setActiveChatId(null);
    }
  }, [urlChatId, location.state?.openChatId, activeChatId, selectChat, setActiveChatId]);

  // Navigate to chat room when selecting a chat
  const handleSelectChat = (id) => {
    selectChat(id);
    navigate(id ? `/chat/${id}` : '/chat');
  };

  const handleBack = () => {
    setActiveChatId(null);
    navigate('/chat');
  };

  // Load chats only when list is empty so switching tabs doesn't refetch.
  // Ref prevents re-firing when user has 0 chats (would otherwise loop).
  useEffect(() => {
    if (!isAuthenticated) hasTriggeredLoad.current = false;
    if (isAuthenticated && chats.length === 0 && !loadingChats && !hasTriggeredLoad.current) {
      hasTriggeredLoad.current = true;
      dispatch(loadChats());
    }
  }, [isAuthenticated, chats.length, loadingChats, dispatch]);

  // Resolve active chat: URL param takes precedence for deep-linking
  const effectiveActiveChatId = urlChatId || activeChatId;

  return (
    <div className="w-full h-[calc(100%-20px)]">
      <div className="hidden md:flex gap-4 w-full h-full">
        <ChatSideBar onSelectChat={handleSelectChat} />
        <ChatDetails onBack={handleBack} urlChatId={urlChatId} />
      </div>
      <div className="flex md:hidden w-full h-full">
        {effectiveActiveChatId ? (
          <ChatDetails onBack={handleBack} urlChatId={urlChatId} />
        ) : (
          <ChatSideBar onSelectChat={handleSelectChat} />
        )}
      </div>
    </div>
  );
};

export default Chat;
