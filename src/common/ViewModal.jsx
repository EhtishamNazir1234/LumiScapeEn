import React from "react";
import { RxCross2 } from "react-icons/rx";

const ViewModal = ({ isOpen, onClose, viewData, onRemove }) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black h-full z-40"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 border">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl md:p-7 p-3 md:max-w-xl max-w-[90%] w-full shadow-lg text-center space-y-3"
        >
          <div className="flex justify-end">
            <RxCross2 onClick={onClose} className="text-red-600 cursor-pointer" size={30} />
          </div>
          <h1 className="font-medium text-[24px] font-vivita">{viewData?.modalTitle || "Details"}</h1>

          <div className="space-y-[1rem] w-[80%] mx-auto py-10">
            {Object.keys(viewData).map((key, index) => {
              if (key === "modalTitle") return null;

              return (
                <div key={index} className="flex justify-between">
                  <h1>{key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</h1>
                  <h1 className="text-[#0060A9]">
                    {Array.isArray(viewData[key]) ? (
                      <span className="pl-5">
                      {viewData[key].map((item, i) => (
                        <span key={i}>
                          {item}
                          {i < viewData[key].length - 1 && ", "} 
                        </span>
                      ))}
                    </span>
                    ) : (
                      viewData[key]
                    )}
                  </h1>
                </div>
              );
            })}
          </div>
          <div className="flex justify-evenly mx-auto ">
            <button
              className="w-[200px] text-[#0060A9] py-3 border rounded-4xl cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            {onRemove && (
              <button
                className="w-[200px] py-3 bg-red-600 text-white rounded-4xl cursor-pointer"
                onClick={onRemove}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewModal;
