import React, { useState, useEffect } from "react";
import profilePic from "../../assets/profile.svg";
import { truncateText } from "../../helpers";
import UserListModal from "../../common/UserListModal";
import { useChat } from "../../store/hooks";
import { useAuth } from "../../store/hooks";

const formatChatTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" });
};

const ChatSideBar = () => {
  const { user } = useAuth();
  const {
    chats,
    activeChatId,
    selectChat,
    createChat,
    loadAvailableUsers,
    availableUsers,
    loadingChats,
    error,
    isUserOnline,
  } = useChat();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) loadAvailableUsers();
  }, [isModalOpen, loadAvailableUsers]);

  const handleCloseModal = () => setIsModalOpen(false);

  const handleAssign = async (selectedIds) => {
    if (!selectedIds?.length) return;
    try {
      await createChat(selectedIds[0]);
      handleCloseModal();
    } catch (err) {
      // error already set in store
    }
  };

  const handleChatClick = (id) => selectChat(id);

  const getOtherParticipant = (chat) => {
    if (!chat.participants?.length || !user?._id) return { _id: null, name: "Unknown", profileImage: null };
    const other = chat.participants.find((p) => p._id !== user._id);
    return other ? { _id: other._id, name: other.name || other.email, profileImage: other.profileImage } : { _id: null, name: "Unknown", profileImage: null };
  };

  const listDataForModal = availableUsers.map((u) => ({
    id: u._id,
    name: u.name || u.email || "User",
    avatar: u.profileImage || profilePic,
  }));

  return (
    <div className="global-bg-color box-shadow w-full xl:h-full xl:w-[40%] md:w-[35%] rounded-2xl py-4 md:py-6 flex-col font-vivita">
      <div className="px-3 md:px-6">
        <h1 className="text-lg md:text-2xl font-medium mb-4 md:mb-6">Chats</h1>
        <button
          className="custom-shadow-button w-full md:w-auto text-sm md:text-base"
          onClick={() => setIsModalOpen(true)}
        >
          Start New Chat
        </button>
      </div>
      {error && (
        <div className="mx-3 md:mx-6 mt-2 p-2 rounded bg-red-100 text-red-700 text-sm">{error}</div>
      )}
      <div className="space-y-2 overflow-auto max-h-[60vh] xl:max-h-[85%]">
        {loadingChats ? (
          <div className="px-4 py-6 text-center text-gray-500">Loading chats...</div>
        ) : chats.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-500">No chats yet. Start a new chat.</div>
        ) : (
          chats.map((chat) => {
            const other = getOtherParticipant(chat);
            const isOnline = other._id && isUserOnline(other._id);
            return (
              <div
                className="px-2 md:px-3 border-b-[0.5px] border-[#C5DCEB] last:border-0"
                key={chat._id}
              >
                <div
                  className={`flex space-x-3 md:space-x-4 p-2 md:p-3 cursor-pointer rounded-lg ${activeChatId === chat._id ? "bg-[#C5DCEB]/30" : ""}`}
                  onClick={() => handleChatClick(chat._id)}
                >
                  <div className="relative shrink-0 w-9 h-9 md:w-12 md:h-12 aspect-square rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={other.profileImage || profilePic}
                      alt={other.name}
                      className="w-full h-full object-cover object-center"
                    />
                    {other._id && (
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${isOnline ? "bg-[#86efac]" : "bg-gray-400"}`}
                        aria-hidden
                      />
                    )}
                  </div>
                  <div className="w-full space-y-1 md:space-y-[6px] min-w-0">
                    <div className="flex xl:justify-between gap-2 items-center w-full">
                      <h2 className="font-medium text-xs md:text-sm truncate flex items-center gap-1.5">
                        {other.name}
                        <span className={`text-[10px] font-normal ${isOnline ? "text-[#0060A9]" : "text-gray-500"}`}>
                          {isOnline ? "• Active" : "• Inactive"}
                        </span>
                      </h2>
                      <span className="text-[#0060A9] text-[10px] md:text-xs shrink-0">
                        {formatChatTime(chat.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-gray-500 w-full text-xs md:text-sm truncate">
                      {truncateText(chat.lastMessage || "No messages yet", 30)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <UserListModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBack={handleCloseModal}
        title="Start Chatting"
        buttontext="Start Chat"
        onAssign={handleAssign}
        listData={listDataForModal}
      />
    </div>
  );
};

export default ChatSideBar;
