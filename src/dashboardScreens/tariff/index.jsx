import { useState, useEffect, useCallback } from "react";
import { tariffService } from "../../services/tariff.service";
import { initialBands } from "../../../dummyData";

const TariffRates = () => {
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchTariffs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tariffService.getAll();
      setTariffs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching tariffs:", err);
      setError(err?.response?.data?.message || "Failed to load tariff rates");
      setTariffs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTariffs();
  }, [fetchTariffs]);

  const handleInputChange = (id, newValue) => {
    const parsed = newValue === "" ? "" : parseFloat(String(newValue).replace(/[^0-9.-]/g, ""));
    setTariffs((prev) =>
      prev.map((t) =>
        t._id === id
          ? { ...t, value: parsed === "" ? "" : Number(parsed), _dirty: true }
          : t
      )
    );
  };

  const handleInitializeDefaults = async () => {
    setError(null);
    setSaving(true);
    try {
      await Promise.all(
        initialBands.map((band) =>
          tariffService.create({
            name: band.name,
            value: Number(band.value) || 0,
          })
        )
      );
      await fetchTariffs();
      setSuccessMessage("Default bands initialized.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        "Failed to initialize bands.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRates = async () => {
    const toUpdate = tariffs.filter((t) => t._dirty && t._id);
    if (toUpdate.length === 0) {
      setSuccessMessage("No changes to save.");
      setTimeout(() => setSuccessMessage(null), 2000);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await Promise.all(
        toUpdate.map((t) =>
          tariffService.update(t._id, {
            name: t.name,
            value: typeof t.value === "number" ? t.value : Number(t.value) || 0,
          })
        )
      );
      setTariffs((prev) =>
        prev.map((t) => ({ ...t, _dirty: false }))
      );
      setSuccessMessage("Rates updated successfully.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        "Failed to update rates.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const hasDirty = tariffs.some((t) => t._dirty);
  const displayValue = (t) =>
    t.value === "" || t.value == null ? "" : String(t.value);

  return (
    <div className="lg:w-[60%] space-y-5 mt-7">
      <h1 className="font-vivita text-[24px] font-medium">
        DISCO Tariff Rates
      </h1>

      {error && (
        <div className="text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="text-green-700 bg-green-50 px-4 py-2 rounded-lg text-sm">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="global-bg-color box-shadow rounded-2xl p-8 text-center text-gray-500">
          Loading tariff rates...
        </div>
      ) : tariffs.length === 0 ? (
        <div className="global-bg-color box-shadow rounded-2xl p-8 flex flex-col items-center justify-center gap-4">
          <p className="font-Geom text-gray-600">No tariff rates yet.</p>
          <button
            type="button"
            onClick={handleInitializeDefaults}
            disabled={saving}
            className="custom-shadow-button font-vivita !w-auto shrink-0 !py-3 !px-6 disabled:opacity-50"
          >
            {saving ? "Initializing..." : "Initialize default bands"}
          </button>
        </div>
      ) : (
        <>
          <div className="global-bg-color box-shadow rounded-2xl p-8 shadow flex flex-col">
            {tariffs.map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between mb-6 last:mb-0"
              >
                <span className="text-md font-Geom">{t.name}</span>
                <input
                  type="text"
                  inputMode="decimal"
                  className="sm:w-48 sm:h-16 w-32 h-10 font-Geom rounded-lg bg-white border border-gray-200 text-center box-shadow focus:outline-none focus:ring-2 focus:ring-[#2A7BB6]"
                  placeholder="0"
                  value={displayValue(t)}
                  onChange={(e) => handleInputChange(t._id, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUpdateRates}
              disabled={saving || !hasDirty}
              className="custom-shadow-button font-vivita !w-auto shrink-0 !py-3 !px-6 disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update Rates"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TariffRates;
