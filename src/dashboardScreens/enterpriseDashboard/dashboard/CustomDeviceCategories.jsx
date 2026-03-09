import React, { useState, useEffect, useCallback } from "react";
import { PlusIcon } from "../../../assets/icon";
import CustomDevices from "../../../common/CustomDevices";
import { deviceService } from "../../../services/device.service";
import { useAuth } from "../../../store/hooks";
import { RxCross2 } from "react-icons/rx";

const CustomDeviceCategories = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchCustomDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await deviceService.getAll({
        category: "Other",
        page: 1,
        limit: 100,
      });
      const list = res?.devices || res || [];
      setDevices(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error fetching custom devices:", err);
      setError("Failed to load custom devices.");
      setDevices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomDevices();
  }, [fetchCustomDevices]);

  const openAddModal = () => {
    setName("");
    setType("");
    setSubmitError("");
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setName("");
    setType("");
    setSubmitError("");
  };

  const handleAddDevice = async (e) => {
    e.preventDefault();
    const trimmedName = name?.trim();
    const trimmedType = type?.trim();
    if (!trimmedName) {
      setSubmitError("Device name is required.");
      return;
    }
    if (!trimmedType) {
      setSubmitError("Device type is required.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const serial = `CUSTOM-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      await deviceService.create({
        name: trimmedName,
        type: trimmedType,
        category: "Other",
        serial,
        variant: "Custom",
        ...(user?._id && { assignedTo: user._id }),
      });
      closeAddModal();
      fetchCustomDevices();
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.msg ||
          "Failed to add device. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const dataForList = devices.map((d) => ({
    id: d._id,
    device: d.name || d.type || "Custom Device",
  }));

  return (
    <div className="p-7 global-bg-color box-shadow rounded-xl">
      <div className="flex mb-8 justify-between items-center">
        <h1 className="font-vivita font-medium">Custom Device Categories</h1>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center text-[#0060A9] hover:opacity-80 cursor-pointer"
          aria-label="Add custom device"
        >
          <PlusIcon color="#0060A9" />
        </button>
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-4">{error}</p>
      )}
      {loading ? (
        <div className="py-8 text-center text-gray-500 text-sm">Loading...</div>
      ) : (
        <div className="gap-y-6 gap-4 grid grid-cols-2">
          <CustomDevices data={dataForList} />
        </div>
      )}

      {isAddModalOpen && (
        <>
          <div
            onClick={closeAddModal}
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
                  onClick={closeAddModal}
                  className="text-red-600 cursor-pointer"
                  size={30}
                />
              </div>
              <h1 className="font-medium text-[24px] font-vivita">
                Add Custom Device
              </h1>

              <form
                onSubmit={handleAddDevice}
                className="space-y-4 w-[80%] mx-auto py-4 text-left"
              >
                {submitError && (
                  <p className="text-red-600 text-sm font-vivita">{submitError}</p>
                )}

                <div>
                  <label className="block font-medium font-vivita mb-1">Device Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Living Room Fan"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#0060A9] font-vivita"
                  />
                </div>

                <div>
                  <label className="block font-medium font-vivita mb-1">Device Type</label>
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="e.g. Fan, Heater, Custom"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#0060A9] font-vivita"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-vivita"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-[#0060A9] text-white rounded-lg hover:opacity-90 disabled:opacity-50 font-vivita"
                  >
                    {submitting ? "Adding…" : "Add Device"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomDeviceCategories;
