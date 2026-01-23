import React, { useState, useEffect } from "react";
import { IoEyeOutline } from "react-icons/io5";
import TicketViewModal from "./TicketViewModal";
import SearchField from "../../common/SearchField";
import Filters from "../../common/Filters";
import UserListModal from "../../common/UserListModal";
import TicketOverView from "./TicketOverView";
import { ticketService } from "../../services/ticket.service";
import { userService } from "../../services/user.service";

const TicketsAndComplaints = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      
      const response = await ticketService.getAll(params);
      setTickets(response.tickets || response || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll({ role: "admin" });
      const users = response.users || response || [];
      setUserList(users.map(user => ({
        id: user._id,
        name: user.name,
        avatar: null
      })));
    } catch (error) {
      console.error("Error fetching users:", error);
      setUserList([]);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, [searchQuery]);

  const handleAssign = async (userId) => {
    if (!selectedTicket || !userId) return;
    try {
      await ticketService.assign(selectedTicket._id, userId);
      setIsAssignModalOpen(false);
      setIsViewModalOpen(false);
      setSelectedTicket(null);
      fetchTickets();
    } catch (error) {
      console.error("Error assigning ticket:", error);
      alert("Failed to assign ticket. Please try again.");
    }
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
                <SearchField 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Filters onClick={() => setIsFilterBarOpen(!isFilterBarOpen)} />
              </div>
            </div>

            <div className="overflow-x-auto my-7">
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-8">No tickets found</div>
              ) : (
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
                    {tickets.map((ticket, index) => (
                      <tr
                        key={ticket._id || index}
                        className="border-b-[1px] border-[#DEDFE0] last:border-0"
                      >
                        <td className="py-4 px-4 text-sm font-light ">
                          {ticket.ticketNumber || `#${ticket._id.slice(-6)}`}
                        </td>
                        <td className="py-4 px-4 text-sm font-light">
                          {ticket.userName}
                        </td>
                        <td className="py-4 px-4 text-sm font-light">
                          <span>{ticket.type}</span>
                        </td>
                        <td className="py-4 px-4 text-sm font-light">
                          {ticket.assignedToName || ticket.assignedTo?.name || "Not assigned"}
                        </td>
                        <td className="py-4 px-4 text-sm font-light">
                          {ticket.reportedOn ? new Date(ticket.reportedOn).toLocaleDateString() : 
                           ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "N/A"}
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
                          <span className={ticket.status}>{ticket.status || "New"}</span>
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
              )}
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
            title="Assign Ticket"
            buttontext="Assign"
            onBack={() => {
              setIsAssignModalOpen(false);
              setIsViewModalOpen(true);
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
