import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import SearchField from "../../common/SearchField";
import Filters from "../../common/Filters";
import { deviceData } from "../../../dummyData";
import Pagination from "../../common/Pagination";
import { DEVICE_MANAGEMENT_TABLE_HEADERS } from "../../constant";
import ViewModal from "../../common/ViewModal";

const DeviceManagementTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const handleViewClick = (device) => {
    const formattedDevice = {
      modalTitle: "Device Details",
      "Device name": device.name,
      "Serial No.": device.serial,
      Category: device.category,
      Type: device.type,
      Variant: device.variant,
      "Installation date": device.date,
      "Notes by user":
        "lorem ipsum is a dummy text, lorem ipsum is a dummy text",
      "Energy consumption": "lorem ipsum",
    };
    setSelectedDevice(formattedDevice);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 w-full box-shadow md:p-8 global-bg-color rounded-2xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-xl font-Geom font-light">Recent login activity</h2>
        <div className="flex items-center gap-2 w-[65%]">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:mt-0">
            <SearchField placeholder={"Search Devices"} />
            <Filters onClick={() => setIsFilterBarOpen(!isFilterBarOpen)} />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl global-bg-color">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="table-header">
              {DEVICE_MANAGEMENT_TABLE_HEADERS.map((header, index) => (
                <th key={index} className="py-4 px-4 text-sm font-light">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deviceData.map((row, idx) => (
              <tr
                key={row.name}
                className="border-b-[1px] border-[#DEDFE0] last:border-0"
              >
                <td className="py-4 px-4 text-sm font-light">{row.name}</td>
                <td className="py-4 px-4 text-sm font-light">{row.serial}</td>
                <td className="py-4 px-4 text-sm font-light">{row.category}</td>
                <td className="py-4 px-4 text-sm font-light">{row.type}</td>
                <td className="py-4 px-4 text-sm font-light">{row.variant}</td>
                <td className="py-4 px-4 text-sm font-light">{row.date}</td>
                <td className="py-4 px-4 text-sm font-light text-[#337FBA] text-xl cursor-pointer">
                  <IoEyeOutline onClick={() => handleViewClick(row)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          totalPages={4}
          onPageChange={(page) => console.log("Selected page:", page)}
        />
      </div>
      <ViewModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDevice(null);
        }}
        viewData={selectedDevice}
      />
    </div>
  );
};
export default DeviceManagementTable;
