import React, { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import TicketViewModal from "./TicketViewModal";
import SearchField from "../../common/SearchField";
import Filters from "../../common/Filters";
import { ticketsData } from "../../../dummyData";
import { userList } from "../../../dummyData";
import UserListModal from "../../common/UserListModal";
import TicketOverView from "./TicketOverView";

const viewData = {
  id: "#1024",
  userName: "Sarah M.",
  type: "Complaint",
  assignedTo: "Not assigned",
  reportedOn: "Apr 8, 2025",
  status: "Resolved",
};

const TicketsAndComplaints = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const handleCloseModal = () => setIsModalOpen(false);

  const handleAssign = () => {
    alert("ok");
  };

  return (
    <div className="sapce-y-4">
        <TicketOverView />
      <div className="flex mt-4">
        <div className="w-full">
          <div className="global-bg-color h-auto rounded-[20px] md:p-7 p-3 box-shadow ">
            <div className="flex flex-col md:flex-row justify-between items-start w-full gap-4 mt-4">
              <h1 className="font-Geom text-lg md:text-xl">Tickets</h1>

              <div className="flex w-full md:w-[70%] gap-3">
                <SearchField />
                <Filters onClick={() => setIsFilterBarOpen(!isFilterBarOpen)} />
              </div>
            </div>

            <div className="overflow-x-auto my-7">
              <table className="w-full">
                <thead>
                  <tr className="table-header whitespace-nowrap">
                    <th>Ticket ID</th>
                    <th>User Name</th>
                    <th>Type</th>
                    <th>Assigned To</th>
                    <th>Reported On</th>
                    <th>Status</th>
                    <th className="!text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsData.map((ticket, index) => (
                    <tr
                      key={index}
                      className="border-b-[1px] border-[#DEDFE0] last:border-0"
                    >
                      <td className="py-4 px-4 text-sm font-light ">
                        {ticket.id}
                      </td>
                      <td className="py-4 px-4 text-sm font-light">
                        {ticket.userName}
                      </td>
                      <td className="py-4 px-4 text-sm font-light">
                        <span>{ticket.type}</span>
                      </td>
                      <td className="py-4 px-4 text-sm font-light">
                        {ticket.assignedTo}
                      </td>
                      <td className="py-4 px-4 text-sm font-lightt">
                        {ticket.reportedOn}
                      </td>
                      <td
                        className={`px-2 text-sm ${
                          ticket.status === "New"
                            ? "text-[#0060A9]"
                            : ticket.status === "Resolved"
                            ? "text-[#00C41F]"
                            : ticket.status === "In Progress"
                            ? "text-[#E8B410]"
                            : ticket.status === "Unresolved"
                            ? "text-[#DB1C1C]"
                            : ""
                        }`}
                      >
                        <span className={ticket.status}>{ticket.status}</span>
                      </td>
                      <td className="md:pl-10 pl-3">
                        <IoEyeOutline
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setIsViewModalOpen(true);
                          }}
                          size={20}
                          className="text-[#0061A9] cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <TicketViewModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            viewData={selectedTicket}
            onAssignClick={() => {
              setIsViewModalOpen(false);
              setIsAssignModalOpen(true);
            }}
          />
          <UserListModal
            isOpen={isAssignModalOpen}
            onClose={() => setIsAssignModalOpen(false)}
            title="Start Chatting"
            buttontext="Start Chat"
            onBack={() => {
              setIsAssignModalOpen(false), setIsViewModalOpen(true);
            }}
            onAssign={handleAssign}
            listData={userList}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketsAndComplaints;
