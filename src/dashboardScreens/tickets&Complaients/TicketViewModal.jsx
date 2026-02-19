import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";

const TicketViewModal = ({ isOpen, onClose, viewData, onAssignClick, onResolve }) => {
  const [notes, setNotes] = useState("");
  useEffect(() => {
    setNotes(viewData?.ticketNotes || "");
  }, [viewData?.ticketNotes]);
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black h-full z-40"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-lg text-center space-y-3"
        >
          <div className="flex justify-end">
            <RxCross2
              onClick={onClose}
              className="text-red-600 cursor-pointer"
              size={30}
            />
          </div>
          <h1 className="font-medium text-[24px] font-vivita">
            {viewData?.modalTitle || "Ticket Details"}
          </h1>
          <div className="space-y-[1rem] w-[80%] mx-auto py-10">
            {viewData && Object.keys(viewData).map((key, index) => {
              if (key === "modalTitle" || key === "ticketNotes" || key === "_id") return null;
              const value = viewData[key];
              if (value === undefined || value === null) return null;

              return (
                <div key={index} className="flex justify-between">
                  <h1>{key}</h1>
                  <h1
                    className={`px-2 text-sm ${
                      value === "New"
                        ? "text-[#0060A9]"
                        : value === "Resolved"
                        ? "text-[#00C41F]"
                        : value === "In Progress"
                        ? "text-[#E8B410]"
                        : value === "Unresolved"
                        ? "text-[#DB1C1C]"
                        : ""
                    }`}
                  >
                    {String(value)}
                  </h1>
                </div>
              );
            })}
            <div className="text-left  w-full mx-auto">
              <h2 className="space-y-[1rem] mb-4 font-vivita ">Ticket Notes</h2>
              <textarea
                className="bg-[#F1F7FB] box-shadow rounded-2xl px-6 py-3 text-[#1976B2] font-light text-xs w-full resize-none outline-none"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-center gap-4 w-[80%] mx-auto">
            {viewData?.status === "New" ? (
              <>
                <button
                  className="w-full text-red-500 py-3 border border-red-500 rounded-4xl cursor-pointer"
                  onClick={onClose}
                >
                  Back
                </button>
                <div className="flex w-full items-center">
                  <button
                    onClick={onAssignClick}
                    className="custom-shadow-button !py-3"
                  >
                    Assign
                  </button>
                </div>
              </>
            ) : viewData?.status === "Resolved" ? (
              <button
                className="text-red-500 w-full py-3 border border-red-500 rounded-4xl cursor-pointer"
                onClick={onClose}
              >
                Back
              </button>
            ) : (
              <button
                className="custom-shadow-button !py-3"
                onClick={() => {
                  onResolve?.();
                  onClose();
                }}
              >
                Mark As Resolved
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketViewModal;
