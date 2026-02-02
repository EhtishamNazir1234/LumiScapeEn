import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../store/hooks";
import { useChat } from "../../store/hooks";
import { chatActions } from "../../store/slices/chatSlice";
import ChatSideBar from "./ChatSideBar";
import ChatDetails from "./ChatDetail";

const Chat = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { activeChatId, setActiveChatId, loadChats, chats } = useChat();

  // Clear chat badge when user lands on chat page (clicked chat icon)
  useEffect(() => {
    dispatch(chatActions.clearAllChatUnreads());
  }, [dispatch]);

  // Load chats only when list is empty so switching tabs doesn't refetch
  useEffect(() => {
    if (isAuthenticated && chats.length === 0) loadChats();
  }, [isAuthenticated, chats.length, loadChats]);

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
