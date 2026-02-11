import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import SearchField from "../../common/SearchField";
import Filters from "../../common/Filters";
import Pagination from "../../common/Pagination";
import { DEVICE_MANAGEMENT_TABLE_HEADERS } from "../../constant";
import ViewModal from "../../common/ViewModal";
import DeleteModal from "../../common/DeleteModal";
import { deviceService } from "../../services/device.service";

const POLL_INTERVAL_MS = 10000; // 10 seconds realtime refresh

const DeviceManagementTable = ({
  isFilterBarOpen,
  setIsFilterBarOpen,
  filterCategory,
  filterStatus,
}) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pollIntervalRef = useRef(null);
  const fetchDevicesRef = useRef(() => {});

  const highlightMatch = (value) => {
    const text = String(value ?? "");
    const query = searchQuery.trim();
    if (!query) return text;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const result = [];
    let start = 0;
    while (true) {
      const index = lowerText.indexOf(lowerQuery, start);
      if (index === -1) {
        if (start === 0) return text;
        result.push(text.slice(start));
        break;
      }
      if (index > start) result.push(text.slice(start, index));
      result.push(
        <span key={index} className="bg-yellow-200">
          {text.slice(index, index + query.length)}
        </span>
      );
      start = index + query.length;
    }
    return result;
  };

  const formatLocation = (location) => {
    if (!location || typeof location !== "object") return "N/A";
    const parts = [
      location.building,
      location.floor,
      location.room,
      location.zone,
    ].filter(Boolean);
    return parts.length ? parts.join(", ") : "N/A";
  };

  const fetchDevices = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const params = { page: currentPage, limit: 10 };
      if (searchQuery?.trim()) params.search = searchQuery.trim();
      if (filterCategory) params.category = filterCategory;
      if (filterStatus) params.status = filterStatus;

      const response = await deviceService.getAll(params);
      setDevices(response.devices || response || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Error fetching devices:", error);
      setDevices([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  fetchDevicesRef.current = fetchDevices;

  // Initial load and when search/filters/page change
  useEffect(() => {
    fetchDevices();
  }, [searchQuery, currentPage, filterCategory, filterStatus]);

  // Realtime polling: refresh list in background without disturbing UI
  useEffect(() => {
    pollIntervalRef.current = setInterval(() => {
      fetchDevicesRef.current(true);
    }, POLL_INTERVAL_MS);
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const handleDelete = async () => {
    if (!deviceToDelete) return;
    try {
      await deviceService.delete(deviceToDelete._id);
      setIsDeleteModalOpen(false);
      setDeviceToDelete(null);
      fetchDevices();
    } catch (error) {
      console.error("Error deleting device:", error);
      alert("Failed to delete device. Please try again.");
    }
  };

  const handleViewClick = (device) => {
    // Use data already loaded in the list to avoid an extra API call
    const d = device || {};
    setSelectedDevice({
      modalTitle: "Device Details",
      _id: d._id,
      "Device ID": d.deviceId || d._id,
      "Device name": d.name,
      "Serial No.": d.serial,
      Category: d.category,
      Type: d.type,
      Variant: d.variant || "N/A",
      "Installation date": d.createdAt
        ? new Date(d.createdAt).toLocaleDateString()
        : "N/A",
      Status: d.status || "N/A",
      "Assigned To": d.assignedTo?.name || "Not assigned",
      Location: formatLocation(d.location),
    });
    setIsModalOpen(true);
  };

  const handleRemoveFromView = async () => {
    if (!selectedDevice?._id) return;
    try {
      await deviceService.delete(selectedDevice._id);
      setIsModalOpen(false);
      setSelectedDevice(null);
      fetchDevices();
    } catch (error) {
      console.error("Error deleting device from view modal:", error);
      alert("Failed to delete device. Please try again.");
    }
  };

  return (
    <div className="global-bg-color h-auto rounded-[20px] md:p-7 p-3 box-shadow">
      <div className="flex flex-row justify-between items-center w-full gap-4 flex-wrap mb-6">
        <h2 className="font-Geom text-lg md:text-xl">Devices List</h2>
        <div className="flex w-full md:w-[70%] gap-3">
          <SearchField
            placeholder="Search Devices"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Filters onClick={() => setIsFilterBarOpen(!isFilterBarOpen)} />
        </div>
      </div>
      <div className="overflow-x-auto whitespace-nowrap">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : devices.length === 0 ? (
          <div className="text-center py-8">No devices found</div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  {DEVICE_MANAGEMENT_TABLE_HEADERS.map((header, index) => (
                    <th
                      key={index}
                      className={`py-4 px-4 text-sm font-light ${header === "Actions" ? "!text-center" : ""}`}
                    >
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
                    <td className="py-4 px-4 text-sm font-light">
                      {highlightMatch(row.name)}
                    </td>
                    <td className="py-4 px-4 text-sm font-light">
                      {highlightMatch(row.serial)}
                    </td>
                    <td className="py-4 px-4 text-sm font-light">
                      {highlightMatch(row.category)}
                    </td>
                    <td className="py-4 px-4 text-sm font-light">
                      {highlightMatch(row.type)}
                    </td>
                    <td className="py-4 px-4 text-sm font-light">
                      {highlightMatch(row.variant || "N/A")}
                    </td>
                    <td className="py-4 px-4 text-sm font-light">
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="py-4 px-4 font-light flex justify-center gap-3">
                    <MdOutlineEdit
                        onClick={() =>
                          navigate(`/update-device/${row._id}`, {
                            state: { device: row },
                          })
                        }
                        size={20}
                        className="text-[#0061A9] cursor-pointer"
                      />
                      <IoEyeOutline
                        onClick={() => handleViewClick(row)}
                        size={20}
                        className="text-[#0061A9] cursor-pointer"
                      />
                      <RiDeleteBin6Line
                        onClick={() => {
                          setDeviceToDelete(row);
                          setIsDeleteModalOpen(true);
                        }}
                        size={20}
                        className="text-red-600 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="my-4">
              <Pagination
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
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
        onRemove={handleRemoveFromView}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeviceToDelete(null);
        }}
        module="Device"
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default DeviceManagementTable;
