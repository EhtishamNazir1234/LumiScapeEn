import React from 'react'
import { IoIosArrowForward } from "react-icons/io";

const Contact = () => {
  return (
    <div className="lg:w-3/4  box-shadow flex-1  global-bg-color rounded-3xl pr-3">
         <div className="p-7 lg:w-3/4">
           <h1 className="font-vivita text-[26px]">Contact</h1>
           <div className="my-10 space-y-5">
             <div
               onClick={() => navigate("/personal-detail")}
               className="flex justify-between items-center  cursor-pointer"
             >
               <h1 className="text-base  font-light">Generate Ticket</h1>
               <IoIosArrowForward className="text-[#0060A9]" size={20} />
             </div>
             <div
               onClick={() => navigate("/change-password")}
               className="flex justify-between items-center cursor-pointer"
             >
               <h1 className="text-base font-light">Email</h1>
               <IoIosArrowForward className="text-[#0060A9]" size={20} />
             </div>
             <div
               onClick={() => navigate("/notification-settings")}
               className="flex justify-between items-center cursor-pointer"
             >
               <h1 className="text-base  font-light">Chat</h1>
               <IoIosArrowForward className="text-[#0060A9]" size={20} />
             </div>
           </div>
         </div>
       </div>
  )
}

export default Contact