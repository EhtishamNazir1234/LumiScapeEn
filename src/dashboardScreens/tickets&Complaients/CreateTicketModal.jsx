import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";

const TYPES = ["Complaint", "Bug Report", "Info Request", "Feature Request", "Other"];
const SEVERITIES = ["Low", "Medium", "High", "Critical"];

const CreateTicketModal = ({ isOpen, onClose, onSubmit, assignableUsers = [] }) => {
  const [type, setType] = useState("Complaint");
  const [issueTitle, setIssueTitle] = useState("");
  const [ticketNotes, setTicketNotes] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setType("Complaint");
    setIssueTitle("");
    setTicketNotes("");
    setSeverity("Medium");
    setAssignedTo("");
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const notes = ticketNotes.trim();
    if (!notes) {
      setError("Ticket notes are required.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        type,
        ticketNotes: notes,
        issueTitle: issueTitle.trim() || undefined,
        severity,
        ...(assignedTo ? { assignedTo } : {}),
      });
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black h-full z-40"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-lg text-center space-y-3"
        >
          <div className="flex justify-end">
            <RxCross2 onClick={handleClose} className="text-red-600 cursor-pointer" size={30} />
          </div>
          <h1 className="font-medium text-[24px] font-vivita">Create Ticket</h1>

          <form onSubmit={handleSubmit} className="space-y-4 w-[80%] mx-auto py-4 text-left">
            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div>
              <label className="block font-medium mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#0060A9]"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Issue Title (optional)</label>
              <input
                type="text"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                placeholder="Short title"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#0060A9]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Ticket Notes (required)</label>
              <textarea
                value={ticketNotes}
                onChange={(e) => setTicketNotes(e.target.value)}
                placeholder="Describe the issue..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#0060A9] resize-none"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#0060A9]"
              >
                {SEVERITIES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {assignableUsers?.length > 0 && (
              <div>
                <label className="block font-medium mb-1">Assign to (optional)</label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#0060A9]"
                >
                  <option value="">Not assigned</option>
                  {assignableUsers.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-center gap-4 pt-4">
              <button
                type="button"
                className="text-red-500 py-3 px-6 border border-red-500 rounded-4xl cursor-pointer"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="custom-shadow-button !py-3 px-6 disabled:opacity-60"
              >
                {submitting ? "Creating..." : "Create Ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateTicketModal;
