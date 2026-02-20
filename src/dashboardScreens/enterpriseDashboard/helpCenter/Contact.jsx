import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ticketService } from "../../../services/ticket.service";
import CreateTicketModal from "../../tickets&Complaients/CreateTicketModal.jsx";

const Contact = () => {
  const navigate = useNavigate();
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await ticketService.getAll();
      setTickets(data.tickets || data || []);
    } catch (err) {
      console.error("Error fetching tickets for contact help center:", err);
      setError("Unable to load your tickets at the moment.");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (payload) => {
    // For end-user/enterprise, backend will auto-assign to an admin/super-admin if available.
    await ticketService.create({
      ...payload,
      userName: undefined, // backend uses req.user.name
    });
    await fetchTickets();
  };

  const handleEmailClick = () => {
    const supportEmail = "support@lumiscape.app";
    const subject = encodeURIComponent("Support request");
    const body = encodeURIComponent("Describe your issue here...");
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  };

  const handleChatClick = () => {
    navigate("/chat");
  };

  const renderStatus = (status) => {
    const value = status || "New";
    const color =
      value === "New"
        ? "text-[#0060A9]"
        : value === "Resolved"
        ? "text-[#00C41F]"
        : value === "In Progress"
        ? "text-[#E8B410]"
        : value === "Unresolved"
        ? "text-[#DB1C1C]"
        : "";
    return <span className={color}>{value}</span>;
  };

  return (
    <div className="lg:w-3/4 box-shadow flex-1 global-bg-color rounded-3xl pr-3">
      <div className="p-7 lg:w-3/4">
        <h1 className="font-vivita text-[26px]">Contact</h1>

        <div className="my-10 space-y-5">
          <div
            onClick={() => setIsTicketModalOpen(true)}
            className="flex justify-between items-center cursor-pointer"
          >
            <h1 className="text-base font-light">Generate Ticket</h1>
            <IoIosArrowForward className="text-[#0060A9]" size={20} />
          </div>
          <div
            onClick={handleEmailClick}
            className="flex justify-between items-center cursor-pointer"
          >
            <h1 className="text-base font-light">Email</h1>
            <IoIosArrowForward className="text-[#0060A9]" size={20} />
          </div>
          <div
            onClick={handleChatClick}
            className="flex justify-between items-center cursor-pointer"
          >
            <h1 className="text-base font-light">Chat</h1>
            <IoIosArrowForward className="text-[#0060A9]" size={20} />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-vivita text-lg mb-3">Your Tickets</h2>
          {loading ? (
            <div className="text-sm text-gray-600">Loading tickets...</div>
          ) : error ? (
            <div className="text-sm text-red-500">{error}</div>
          ) : tickets.length === 0 ? (
            <div className="text-sm text-gray-600">
              You have not generated any tickets yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="table-header">
                    <th>Ticket ID</th>
                    <th>Issue</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Reported On</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket._id}
                      className="border-b-[1px] border-[#DEDFE0] last:border-0"
                    >
                      <td className="py-2 px-2">
                        {ticket.ticketNumber || `#${ticket._id?.slice(-6)}`}
                      </td>
                      <td className="py-2 px-2">
                        {ticket.issueTitle || ticket.type || "Ticket"}
                      </td>
                      <td className="py-2 px-2">
                        {ticket.assignedToName ||
                          ticket.assignedTo?.name ||
                          "Not assigned"}
                      </td>
                      <td className="py-2 px-2">
                        {renderStatus(ticket.status)}
                      </td>
                      <td className="py-2 px-2">
                        {ticket.reportedOn
                          ? new Date(ticket.reportedOn).toLocaleDateString()
                          : ticket.createdAt
                          ? new Date(ticket.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CreateTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onSubmit={handleCreateTicket}
        assignableUsers={[]}
      />
    </div>
  );
};

export default Contact;