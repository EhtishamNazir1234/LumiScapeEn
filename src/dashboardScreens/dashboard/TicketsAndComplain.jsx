import React from "react";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineAssignment } from "react-icons/md";
import { ticketsData1 } from "../../../dummyData";

const TicketsAndComplain = () => {
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
          {ticketsData1?.map((item, index) => (
            <tr
              key={item.id}
              className="border-b-[1px] border-[#DEDFE0] last:border-0"
            >
              <td className="py-3 px-4 text-sm font-light ">{item.userName}</td>
              <td className="py-3 font-light text-sm">{item.issueTitle}</td>
              <td className="py-3 px-4 text-sm font-light">{item.status}</td>
              <td className="py-3 px-4 text-sm font-light">
                {item.submittedOn}
              </td>
              <td className="py-3 px-4 text-sm font-light">
                {item.assignedTo}
              </td>
              <td className="py-3 px-4 font-light flex justify-center gap-3">
                {item.assignedTo == "Not assigned" ? (
                  <MdOutlineAssignment size={22} className="text-[#0061A9]" />
                ) : (
                  <IoEyeOutline
                    onClick={() => setIsViewModalOpen(true)}
                    size={22}
                    className="text-[#0061A9]"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketsAndComplain;
