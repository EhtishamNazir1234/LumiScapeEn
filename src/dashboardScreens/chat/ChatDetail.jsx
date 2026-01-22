import { messages } from "../../../dummyData";
import profilePic from "../../assets/profile.svg";
import emogiIcon from "../../assets/emogiIcon.svg";
import gallaryIcon from "../../assets/gallaryIcon.svg";

const ChatDetails = () => {
  return (
    <div className="global-bg-color w-full box-shadow rounded-2xl h-full flex-col font-vivita overflow-hidden">
      <div className="flex items-center justify-between border-b-[1px] p-3 xl:p-6 border-[#C5DCEB] last:border-0 pb-2 mb-3">
        <div className="flex items-center gap-2 md:gap-4">
          <img
            src={profilePic}
            alt="User"
            className="w-12 h-12 xl:w-20 xl:h-20 rounded-full"
          />
          <div className="flex flex-col">
            <div className="text-xs xl:text-base">Brume Djbah</div>
            <div className="flex items-center p-0 space-x-1 text-xs md:text-sm">
              <span className="text-[#86efac] text-lg md:text-xl">•</span>
              <span className="text-gray-500 text-[10px] md:text-xs">
                Active now
              </span>
            </div>
          </div>
        </div>
        <div className="mr-3 md:mr-5 text-xs md:text-base">Ticket # 124546</div>
      </div>
      <div className="overflow-auto h-[45vh]">
        <div className="flex items-center gap-x-2 md:gap-x-10 justify-center my-2">
          <hr className="w-24 md:w-60 border-[#0060A9]" />
          <span className="text-gray-400 text-[10px] md:text-xs">
            28 Feb,2025
          </span>
          <hr className="w-24 md:w-60 border-[#0060A9]" />
        </div>
        <div className="border-b-[1px] border-[#C5DCEB] last:border-0 p-3 md:p-6">
          {messages.map((msg, idx) => (
            <div key={idx} className="flex pb-2 md:pb-3">
              <img
                src={profilePic}
                alt={msg.sender}
                className="w-8 h-8 xl:w-14 xl:h-14 rounded-full"
              />
              <div className="rounded-xl px-3 xl:px-5 py-1">
                <div
                  className={`text-sm xl:text-base mb-1 ${
                    msg.sender === "Ifeoma" ? "text-[#0060A9]" : ""
                  }`}
                >
                  {msg.sender}
                  <span className="text-[10px] xl:text-xs text-gray-400 ml-2">
                    <span className="text-sm align-middle text-[#86efac]">
                      •
                    </span>
                    {msg.time}
                  </span>
                </div>
                <div className="text-gray-400 text-xs xl:text-base">
                  {msg.text}dwd
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 md:p-6">
        <textarea
          id="message"
          name="message"
          rows="3"
          cols="50"
          className="border border-[#AFCDE2] rounded-xl p-3 w-full text-xs md:text-[14px] text-[#9AC0DC]"
        >
          Enter your text here...
        </textarea>
        <div className="flex">
          <div className="flex py-3 md:py-5 justify-between items-center w-full">
            <div className="flex gap-2">
              <img src={gallaryIcon} width={24} height={24} />
              <img src={emogiIcon} width={24} height={24} />
            </div>
            <div className="flex w-32 md:w-40">
              <button className="custom-shadow-button">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDetails;
