import React, { useEffect } from "react";
import { ChatProvider, useChat } from "../../context/ChatContext";
import ChatSideBar from "./ChatSideBar";
import ChatDetails from "./ChatDetail";

const ChatContent = () => {
  const { activeChatId, setActiveChatId, loadChats } = useChat();

  useEffect(() => {
    loadChats();
  }, [loadChats]);

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

const Chat = () => {
  return (
    <ChatProvider>
      <ChatContent />
    </ChatProvider>
  );
};

export default Chat;
