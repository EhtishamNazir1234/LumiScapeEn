import React from "react";
import { RecentDeviceData } from "../../../dummyData";
const RecentDeviceAlerts = () => {
  return (
    <div className="overflow-x-auto my-7">
      <table className="w-full whitespace-nowrap">
        <thead>
          <tr className="table-header">
            <th>Device ID</th>
            <th>Alert Type</th>
            <th>Severity</th>
            <th>Reported On</th>
            <th>AssignedTo</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {RecentDeviceData?.map((item, index) => (
            <tr
              key={item.id}
              className="border-b-[1px] border-[#DEDFE0] last:border-0"
            >
              <td className="py-3 px-4 text-sm font-light ">{item.deviceID}</td>
              <td className="py-3 px-4 font-light text-sm">{item.issue}</td>
              <td className="py-3 px-4 text-sm font-light">{item.severity}</td>
              <td className="py-3 px-4 text-sm font-light">
                {item.occurredOn}
              </td>
              <td className="py-3 px-4 text-sm font-light">
                {item.assignedTo}
              </td>
              <td className="py-3 px-4 text-sm font-light">
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentDeviceAlerts;
