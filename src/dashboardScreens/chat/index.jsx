import React, { useState } from "react";
import ChatSideBar from "./ChatSideBar";
import ChatDetails from "./ChatDetail";

const Chat = () => {
  const [activeChatId, setActiveChatId] = useState(null);

  return (
    <div className="w-full h-[calc(100%-20px)]">
      <div className="hidden md:flex gap-4 w-full h-full">
        <ChatSideBar />
        <ChatDetails />
      </div>
      <div className="flex md:hidden w-full h-full">
        {activeChatId ? (
          <ChatDetails />
        ) : (
          <ChatSideBar setActiveChatId={setActiveChatId} />
        )}
      </div>
    </div>
  );
};

export default Chat;
