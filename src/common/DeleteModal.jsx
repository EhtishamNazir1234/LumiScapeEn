import React from "react";

const DeleteModal = ({ isOpen, onClose, module, handleDelete }) => {
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
          className="bg-white rounded-2xl p-10 max-w-xl w-full shadow-lg text-center py-[4rem] space-y-[2.5rem] "
        >
          <div className="space-y-[1rem] w-[80%] mx-auto">

      
          <h1 className="font-medium text-[24px] font-vivita">Are you sure? </h1>
          <p className="font-light text-[20px] text-[#0060A9]">Are you sure you want to remove this {module}?</p>
          </div>
          <div className="flex justify-evenly mx-auto">
            <button className="w-[200px] text-[#0060A9] py-3 border rounded-4xl cursor-pointer" onClick={()=>onClose()}>Cancel</button>
            <button className=" w-[200px] py-3 bg-red-600 text-white rounded-4xl cursor-pointer" onClick={()=>handleDelete()}>Remove</button>
          </div>
         
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
