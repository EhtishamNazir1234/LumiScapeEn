import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import InputField from "../../common/InputField";
import SelectField from "../../common/SelectField";
import { deviceService } from "../../services/device.service";
import { userService } from "../../services/user.service";

const CATEGORY_OPTIONS = [
  { value: "Switch", label: "Switch" },
  { value: "Sensor", label: "Sensor" },
  { value: "Energy", label: "Energy" },
  { value: "Lighting", label: "Lighting" },
  { value: "Other", label: "Other" },
];

const AddDevice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const location = useLocation();
  const deviceFromState = location.state?.device;

  const [name, setName] = useState("");
  const [serial, setSerial] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [variant, setVariant] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");
  const [zone, setZone] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await userService.getAll({});
        const list = res.users || res || [];
        setUserOptions(
          list.map((u) => ({ value: u._id, label: u.name || u.email || u._id }))
        );
      } catch {
        setUserOptions([]);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    let cancelled = false;

    const populateFromData = (data) => {
      setName(data.name || "");
      setSerial(data.serial || "");
      setCategory(data.category || "");
      setType(data.type || "");
      setVariant(data.variant || "");
      const loc = data.location || {};
      setBuilding(loc.building || "");
      setFloor(loc.floor || "");
      setRoom(loc.room || "");
      setZone(loc.zone || "");
      setAssignedTo(data.assignedTo?._id || data.assignedTo || "");
    };

    // Prefer navigation state to avoid extra API call when coming from list
    if (deviceFromState) {
      setFormLoading(false);
      setError("");
      populateFromData(deviceFromState);
      return () => {
        cancelled = true;
      };
    }

    const load = async () => {
      try {
        setFormLoading(true);
        setError("");
        const data = await deviceService.getById(id);
        if (cancelled) return;
        populateFromData(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || err.message || "Failed to load device."
          );
        }
      } finally {
        if (!cancelled) setFormLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id, isEdit, deviceFromState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name?.trim()) {
      setError("Device name is required.");
      return;
    }
    if (!serial?.trim()) {
      setError("Serial number is required.");
      return;
    }
    if (!category) {
      setError("Category is required.");
      return;
    }
    if (!type?.trim()) {
      setError("Type is required.");
      return;
    }
    setLoading(true);
    const payload = {
      name: name.trim(),
      serial: serial.trim(),
      category,
      type: type.trim(),
      variant: (variant || "").trim(),
      location: {
        building: (building || "").trim(),
        floor: (floor || "").trim(),
        room: (room || "").trim(),
        zone: (zone || "").trim(),
      },
      assignedTo: assignedTo || null,
    };
    try {
      if (isEdit) {
        await deviceService.update(id, payload);
      } else {
        await deviceService.create(payload);
      }
      navigate("/device-management", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        err.message ||
        (isEdit ? "Failed to update device." : "Failed to add device.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (formLoading) {
    return (
      <div className="global-bg-color md:w-[75%] h-auto rounded-[20px] md:p-7 p-5 box-shadow">
        <h1 className="text-[20px] font-vivita">
          {isEdit ? "Edit Device" : "Add New Device"}
        </h1>
        <div className="my-[3rem] text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="global-bg-color md:w-[75%] h-auto rounded-[20px] md:p-7 p-5 box-shadow">
      <h1 className="text-[20px] font-vivita">
        {isEdit ? "Edit Device" : "Add New Device"}
      </h1>
      <form onSubmit={handleSubmit} className="my-[3rem] space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="name"
            label="Device Name"
            type="text"
            placeholder=""
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputField
            id="serial"
            label="Serial Number"
            type="text"
            placeholder=""
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            disabled={isEdit}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            id="category"
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={CATEGORY_OPTIONS}
          />
          <InputField
            id="type"
            label="Type"
            type="text"
            placeholder=""
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>
        <InputField
          id="variant"
          label="Variant (optional)"
          type="text"
          placeholder=""
          value={variant}
          onChange={(e) => setVariant(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <InputField
            id="building"
            label="Building"
            type="text"
            placeholder=""
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
          />
          <InputField
            id="floor"
            label="Floor"
            type="text"
            placeholder=""
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
          />
          <InputField
            id="room"
            label="Room"
            type="text"
            placeholder=""
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <InputField
            id="zone"
            label="Zone"
            type="text"
            placeholder=""
            value={zone}
            onChange={(e) => setZone(e.target.value)}
          />
        </div>
        <SelectField
          id="assignedTo"
          label="Assigned To (optional)"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          options={userOptions}
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/device-management")}
            className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="custom-shadow-button font-vivita md:!w-[30%] !py-3 disabled:opacity-60"
          >
            {loading
              ? isEdit
                ? "Updating…"
                : "Adding…"
              : isEdit
                ? "Update Device"
                : "Add Device"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDevice;
