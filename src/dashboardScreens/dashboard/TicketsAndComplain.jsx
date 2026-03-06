import React, { useEffect, useMemo, useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineAssignment } from "react-icons/md";
import TicketViewModal from "../tickets&Complaients/TicketViewModal";
import { ticketService } from "../../services/ticket.service";

const TicketsAndComplain = ({ searchQuery = "", statusFilters = [] }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");
      const params = { page: 1, limit: 5 };
      if (searchQuery) {
        params.search = searchQuery;
      }
      const response = await ticketService.getAll(params);
      setTickets(response.tickets || response || []);
    } catch (err) {
      console.error("Error fetching dashboard tickets:", err);
      setError("Failed to load tickets.");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [searchQuery]);

  const buildViewData = (ticket) => {
    if (!ticket) return null;
    return {
      "Ticket ID": ticket.ticketNumber || `#${(ticket._id || "").slice(-6)}`,
      "User Name": ticket.userName ?? "—",
      "User Email": ticket.userEmail ?? "—",
      "Type": ticket.type ?? "—",
      "Status": ticket.status ?? "New",
      "Assigned To":
        ticket.assignedToName ||
        ticket.assignedTo?.name ||
        "Not assigned",
      "Reported On": ticket.reportedOn
        ? new Date(ticket.reportedOn).toLocaleDateString()
        : ticket.createdAt
        ? new Date(ticket.createdAt).toLocaleDateString()
        : "N/A",
      Severity: ticket.severity ?? "—",
      "Issue Title": ticket.issueTitle ?? "—",
      ticketNotes: ticket.ticketNotes ?? "",
      _id: ticket._id,
    };
  };

  const filteredTickets = useMemo(() => {
    if (!tickets) return [];

    // If no status filters selected, show all
    if (!statusFilters || statusFilters.length === 0) {
      return tickets;
    }

    return tickets.filter((ticket) => {
      const status = ticket.status || "New";
      return statusFilters.includes(status);
    });
  }, [tickets, statusFilters]);

  return (
    <div className="overflow-x-auto my-7">
      <table className="w-full whitespace-nowrap">
        <thead>
          <tr className="table-header">
            <th>User Name</th>
            <th>Issue Title</th>
            <th>Status</th>
            <th>Submitted On</th>
            <th>Assigned To</th>
            <th className="!text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="py-4 text-center text-sm text-gray-500">
                Loading tickets...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={6} className="py-4 text-center text-sm text-red-500">
                {error}
              </td>
            </tr>
          ) : filteredTickets.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-4 text-center text-sm text-gray-500">
                No tickets found.
              </td>
            </tr>
          ) : (
            filteredTickets.map((ticket) => {
              const assignedToText =
                ticket.assignedToName ||
                ticket.assignedTo?.name ||
                "Not assigned";
              const submittedOn = ticket.reportedOn
                ? new Date(ticket.reportedOn).toLocaleDateString()
                : ticket.createdAt
                ? new Date(ticket.createdAt).toLocaleDateString()
                : "N/A";

              return (
                <tr
                  key={ticket._id}
                  className="border-b-[1px] border-[#DEDFE0] last:border-0"
                >
                  <td className="py-3 px-4 text-sm font-light ">
                    {ticket.userName || "N/A"}
                  </td>
                  <td className="py-3 font-light text-sm">
                    {ticket.issueTitle || ticket.type || "Ticket"}
                  </td>
                  <td className="py-3 px-4 text-sm font-light">
                    {ticket.status || "New"}
                  </td>
                  <td className="py-3 px-4 text-sm font-light">
                    {submittedOn}
                  </td>
                  <td className="py-3 px-4 text-sm font-light">
                    {assignedToText}
                  </td>
                  <td className="py-3 px-4 font-light flex justify-center gap-3">
                    {assignedToText === "Not assigned" ? (
                      <MdOutlineAssignment
                        size={22}
                        className="text-[#0061A9]"
                      />
                    ) : (
                      <IoEyeOutline
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setIsViewModalOpen(true);
                        }}
                        size={22}
                        className="text-[#0061A9] cursor-pointer"
                      />
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <TicketViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        viewData={buildViewData(selectedTicket)}
        onAssignClick={null}
      />
    </div>
  );
};

export default TicketsAndComplain;
