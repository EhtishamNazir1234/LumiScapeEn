import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../store/hooks";
import { useChat } from "../../store/hooks";
import { chatActions, loadChats, selectChats } from "../../store/slices/chatSlice";
import ChatSideBar from "./ChatSideBar";
import ChatDetails from "./ChatDetail";

const Chat = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { activeChatId, setActiveChatId, selectChat } = useChat();
  const chats = useSelector(selectChats);
  const loadingChats = useSelector((state) => state.chat.loadingChats);
  const hasTriggeredLoad = useRef(false);

  // Clear chat badge when user lands on chat page (clicked chat icon)
  useEffect(() => {
    dispatch(chatActions.clearAllChatUnreads());
  }, [dispatch]);

  // Open specific chat when navigated from notification (state.openChatId)
  useEffect(() => {
    const openChatId = location.state?.openChatId;
    if (openChatId) {
      selectChat(openChatId);
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location.state?.openChatId, selectChat, location.pathname]);

  // Load chats only when list is empty so switching tabs doesn't refetch.
  // Ref prevents re-firing when user has 0 chats (would otherwise loop).
  useEffect(() => {
    if (!isAuthenticated) hasTriggeredLoad.current = false;
    if (isAuthenticated && chats.length === 0 && !loadingChats && !hasTriggeredLoad.current) {
      hasTriggeredLoad.current = true;
      dispatch(loadChats());
    }
  }, [isAuthenticated, chats.length, loadingChats, dispatch]);

  return (
    <div className="w-full h-[calc(100%-20px)]">
      <div className="hidden md:flex gap-4 w-full h-full">
        <ChatSideBar />
        <ChatDetails onBack={() => setActiveChatId(null)} />
      </div>
      <div className="flex md:hidden w-full h-full">
        {activeChatId ? (
          <ChatDetails onBack={() => setActiveChatId(null)} />
        ) : (
          <ChatSideBar />
        )}
      </div>
    </div>
  );
};

export default Chat;
