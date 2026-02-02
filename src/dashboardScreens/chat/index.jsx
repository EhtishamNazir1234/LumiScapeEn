import React, { useEffect } from "react";
import { useChat } from "../../context/ChatContext";
import ChatSideBar from "./ChatSideBar";
import ChatDetails from "./ChatDetail";

const Chat = () => {
  const { activeChatId, setActiveChatId, loadChats, chats } = useChat();

  // Load chats only when list is empty so switching tabs doesn't refetch
  useEffect(() => {
    if (chats.length === 0) loadChats();
  }, [chats.length, loadChats]);

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
