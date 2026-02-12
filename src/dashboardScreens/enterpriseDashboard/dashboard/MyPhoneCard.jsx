import React, { useEffect, useState } from "react";
import ToggleSwitch from "../../../common/ToggleSwitch";
import { deviceService } from "../../../services/device.service";

// Simple helper to format watt-hours / kWh nicely
const formatEnergy = (wh) => {
  if (!wh || wh <= 0) return "0 Wh";
  if (wh < 1000) return `${wh.toFixed(0)} Wh`;
  const kwh = wh / 1000;
  return `${kwh.toFixed(2)} kWh`;
};

const MyPhoneCard = () => {
  const [phone, setPhone] = useState(null);
  const [liveConsumption, setLiveConsumption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadPhone = async (showErrors = false) => {
    try {
      setLoading(true);
      const data = await deviceService.getMyPhone();
      setPhone(data);
      setLiveConsumption(data.liveConsumption || null);
      setError("");
    } catch (err) {
      // 404 means not registered yet – handled by UI
      const status = err?.response?.status;
      if (status === 404) {
        setPhone(null);
        setLiveConsumption(null);
        if (showErrors) {
          setError("Phone is not registered yet. Use the button below to register.");
        } else {
          setError("");
        }
      } else if (showErrors) {
        const text =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load phone details.";
        setError(text);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhone(false);
    const interval = setInterval(() => {
      // Poll for near real-time consumption updates
      loadPhone(false);
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRegister = async () => {
    try {
      setSaving(true);
      setError("");
      const data = await deviceService.registerPhone();
      setPhone(data);
      setLiveConsumption(data.liveConsumption || null);
    } catch (err) {
      const text =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to register phone device.";
      setError(text);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (nextState) => {
    if (!phone?._id) return;
    try {
      setSaving(true);
      setError("");
      const updated = await deviceService.togglePhonePower(phone._id, nextState);
      setPhone(updated);
      setLiveConsumption(updated.liveConsumption || null);
    } catch (err) {
      const text =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update phone power state.";
      setError(text);
    } finally {
      setSaving(false);
    }
  };

  const isOn = phone?.isOn || false;
  const watts = liveConsumption?.currentWatts || 0;
  const totalWh = liveConsumption?.totalWh || 0;
  const cost = liveConsumption?.cost || 0;

  return (
    <div className="p-6 py-8 w-full global-bg-color rounded-lg box-shadow space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-vivita font-medium text-black">
          My Phone
        </h2>
        {phone && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              isOn ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
            }`}
          >
            {isOn ? "ON" : "OFF"}
          </span>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-[#669FCB]">Loading phone information…</p>
      ) : !phone ? (
        <div className="space-y-3">
          <p className="text-sm text-[#337FBA]">
            Register this device as your phone to monitor its energy usage and
            control it directly from your dashboard.
          </p>
          <button
            type="button"
            className="custom-shadow-button font-vivita !py-2 !px-4 text-sm"
            onClick={handleRegister}
            disabled={saving}
          >
            {saving ? "Registering…" : "Register My Phone"}
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-[#337FBA]">
                Track this phone’s virtual charging usage in real time.
              </p>
              <p className="text-sm">
                <span className="text-[#0060A9] font-medium">
                  {formatEnergy(totalWh)}
                </span>{" "}
                used so far ·{" "}
                <span className="text-[#0060A9] font-medium">
                  {watts.toFixed(0)} W
                </span>{" "}
                currently
              </p>
              <p className="text-xs text-[#337FBA]">
                Estimated cost: {cost.toFixed(3)} (flat rate demo)
              </p>
            </div>
            <div className="ml-4">
              <ToggleSwitch
                label="Power"
                checked={isOn}
                onChange={(checked) => handleToggle(checked)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyPhoneCard;

