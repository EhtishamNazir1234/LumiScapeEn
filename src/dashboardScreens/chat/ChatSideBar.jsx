import { chats } from "../../../dummyData";
import profilePic from "../../assets/profile.svg";
import { truncateText } from "../../hepers";
import UserListModal from "../../common/UserListModal";
import React, { useState } from "react";
import { userList } from "../../../dummyData";

const ChatSideBar = ({ setActiveChatId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleAssign = () => {
    alert("ok");
  };
  const handleChatClick = (id) => {
    setActiveChatId(id);
  };

  return (
    <div className="global-bg-color box-shadow w-full xl:h-full xl:w-[40%] md:w-[35%]   rounded-2xl py-4 md:py-6 flex-col font-vivita">
      <div className="px-3 md:px-6">
        <h1 className="text-lg md:text-2xl font-medium mb-4 md:mb-6">Chats</h1>
        <button
          className="custom-shadow-button w-full md:w-auto text-sm md:text-base"
          onClick={() => setIsModalOpen(true)}
        >
          Start New Chat
        </button>
      </div>
      <div className="space-y-2 overflow-auto max-h-[60vh] xl:max-h-[85%]">
        {chats.map((chat, idx) => (
          <div
            className="px-2 md:px-3 border-b-[0.5px] border-[#C5DCEB] last:border-0 "
            key={idx}
          >
            <div
              className="flex space-x-3 md:space-x-4 p-2 md:p-3"
              onClick={() => handleChatClick(chat.id)}
            >
              <div>
                <img
                  src={profilePic}
                  alt={chat.name}
                  className="w-9 h-9 md:w-12 md:h-12 rounded-full min-w-[2.5rem] min-h-[2.5rem]"
                />
              </div>
              <div className="w-full b space-y-1 md:space-y-[6px]">
                <div className="flex xl:justify-between gap-2 items-center w-full">
                  <h2 className="font-medium text-xs md:text-sm">
                    {chat.name}
                  </h2>
                  <span className="text-[#0060A9] text-[10px] md:text-xs">
                    {chat.time}
                  </span>
                </div>
                <p className="text-gray-500 w-full text-xs md:text-sm truncate">
                  {truncateText(chat.message, 30)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <UserListModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Start Chatting"
        buttontext="Start Chat"
        onAssign={handleAssign}
        listData={userList}
      />
    </div>
  );
};

export default ChatSideBar;
