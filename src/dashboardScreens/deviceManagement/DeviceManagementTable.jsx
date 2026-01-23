import { useState, useEffect } from "react";
import { IoEyeOutline } from "react-icons/io5";
import SearchField from "../../common/SearchField";
import Filters from "../../common/Filters";
import Pagination from "../../common/Pagination";
import { DEVICE_MANAGEMENT_TABLE_HEADERS } from "../../constant";
import ViewModal from "../../common/ViewModal";
import { deviceService } from "../../services/device.service";

const DeviceManagementTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDevices();
  }, [searchQuery, currentPage]);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 10 };
      if (searchQuery) params.search = searchQuery;
      
      const response = await deviceService.getAll(params);
      setDevices(response.devices || response || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Error fetching devices:", error);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = async (device) => {
    try {
      const deviceDetails = await deviceService.getById(device._id);
      const formattedDevice = {
        modalTitle: "Device Details",
        "Device name": deviceDetails.name,
        "Serial No.": deviceDetails.serial,
        Category: deviceDetails.category,
        Type: deviceDetails.type,
        Variant: deviceDetails.variant || "N/A",
        "Installation date": deviceDetails.installationDate 
          ? new Date(deviceDetails.installationDate).toLocaleDateString() 
          : deviceDetails.createdAt 
          ? new Date(deviceDetails.createdAt).toLocaleDateString() 
          : "N/A",
        "Status": deviceDetails.status || "N/A",
        "Assigned To": deviceDetails.assignedTo?.name || "Not assigned",
        "Location": deviceDetails.location?.name || "N/A",
      };
      setSelectedDevice(formattedDevice);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching device details:", error);
      // Fallback to basic device info
      const formattedDevice = {
        modalTitle: "Device Details",
        "Device name": device.name,
        "Serial No.": device.serial,
        Category: device.category,
        Type: device.type,
        Variant: device.variant || "N/A",
        "Installation date": device.date || "N/A",
        "Status": device.status || "N/A",
      };
      setSelectedDevice(formattedDevice);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="p-4 w-full box-shadow md:p-8 global-bg-color rounded-2xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-xl font-Geom font-light">Recent login activity</h2>
        <div className="flex items-center gap-2 w-[65%]">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:mt-0">
            <SearchField 
              placeholder={"Search Devices"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Filters onClick={() => setIsFilterBarOpen(!isFilterBarOpen)} />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl global-bg-color">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : devices.length === 0 ? (
          <div className="text-center py-8">No devices found</div>
        ) : (
          <>
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
                {devices.map((row, idx) => (
                  <tr
                    key={row._id || idx}
                    className="border-b-[1px] border-[#DEDFE0] last:border-0"
                  >
                    <td className="py-4 px-4 text-sm font-light">{row.name}</td>
                    <td className="py-4 px-4 text-sm font-light">{row.serial}</td>
                    <td className="py-4 px-4 text-sm font-light">{row.category}</td>
                    <td className="py-4 px-4 text-sm font-light">{row.type}</td>
                    <td className="py-4 px-4 text-sm font-light">{row.variant || "N/A"}</td>
                    <td className="py-4 px-4 text-sm font-light">
                      {row.installationDate 
                        ? new Date(row.installationDate).toLocaleDateString() 
                        : row.createdAt 
                        ? new Date(row.createdAt).toLocaleDateString() 
                        : "N/A"}
                    </td>
                    <td className="py-4 px-4 text-sm font-light text-[#337FBA] text-xl cursor-pointer">
                      <IoEyeOutline onClick={() => handleViewClick(row)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
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
