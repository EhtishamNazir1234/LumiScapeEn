import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Chips from "../../common/Chips";
import InputField from "../../common/InputField";
import { suppliedItems } from "../../../dummyData";
import { supplierService } from "../../services/supplier.service";

const AddSupplier = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const location = useLocation();
  const supplierFromState = location.state?.supplier;

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [selectedChips, setSelectedChips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit || !id) return;
    let cancelled = false;

    const populateFromData = (data) => {
      const nameStr = (data.name || "").trim();
      const parts = nameStr ? nameStr.split(/\s+/) : [];
      if (parts.length >= 2) {
        setFirstName(parts[0] || "");
        setLastName(parts[parts.length - 1] || "");
        setMiddleName(parts.slice(1, -1).join(" ") || "");
      } else if (parts.length === 1) {
        setFirstName(parts[0] || "");
      }
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setCity(data.city || "");
      setCountry(data.country || "");
      const supplied = data.itemsSupplied || [];
      const chips = supplied
        .map((s) => {
          const item = suppliedItems.find(
            (i) => i.label === s || String(i.id) === s
          );
          return item || (s ? { id: s, label: s } : null);
        })
        .filter(Boolean);
      setSelectedChips(chips);
    };

    // Prefer using data passed via navigation state to avoid refetch
    if (supplierFromState) {
      setFormLoading(false);
      setError("");
      populateFromData(supplierFromState);
      return () => {
        cancelled = true;
      };
    }

    const load = async () => {
      try {
        setFormLoading(true);
        setError("");
        const data = await supplierService.getById(id);
        if (cancelled) return;
        populateFromData(data);
      } catch (err) {
        if (!cancelled) {
          const msg =
            err.response?.data?.message ||
            err.message ||
            "Failed to load supplier.";
          setError(msg);
        }
      } finally {
        if (!cancelled) setFormLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id, isEdit, supplierFromState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const name = [firstName, middleName, lastName].filter(Boolean).join(" ").trim();
    if (!name) {
      setError("Name is required.");
      return;
    }
    if (!email?.trim()) {
      setError("Email is required.");
      return;
    }
    if (!phone?.trim()) {
      setError("Phone is required.");
      return;
    }
    setLoading(true);
    const payload = {
      name,
      email: email.trim(),
      phone: phone.trim(),
      city: (city || "").trim(),
      country: (country || "").trim() || "Not assigned",
      itemsSupplied: (selectedChips || []).map((c) => c.label || String(c.id)),
    };
    try {
      if (isEdit) {
        await supplierService.update(id, payload);
      } else {
        await supplierService.create(payload);
      }
      navigate("/supplier-management", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        err.message ||
        (isEdit ? "Failed to update supplier." : "Failed to add supplier.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (formLoading) {
    return (
      <div className="global-bg-color md:w-[75%] h-auto rounded-[20px] md:p-7 p-5 box-shadow">
        <h1 className="text-[20px] font-vivita">{isEdit ? "Edit Supplier" : "Add New Supplier"}</h1>
        <div className="my-[3rem] text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="global-bg-color md:w-[75%] h-auto rounded-[20px] md:p-7 p-5 box-shadow">
      <h1 className="text-[20px] font-vivita">{isEdit ? "Edit Supplier" : "Add New Supplier"}</h1>
      <form onSubmit={handleSubmit} className="my-[3rem] space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <InputField
            id="firstName"
            label="First Name"
            type="text"
            placeholder=""
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <InputField
            id="middleName"
            label="Middle Name"
            type="text"
            placeholder=""
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
          <InputField
            id="lastName"
            label="Last Name"
            type="text"
            placeholder=""
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <InputField
              id="email"
              label="Email"
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full">
            <InputField
              id="phone"
              label="Phone number"
              type="tel"
              placeholder=""
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Chips
            id="itemsSupplied"
            label="Items Supplied"
            list={suppliedItems}
            value={selectedChips}
            onChange={setSelectedChips}
            placeholder="Select items supplied"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <InputField
            id="country"
            label="Country"
            type="text"
            placeholder=""
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <InputField
            id="city"
            label="City"
            type="text"
            placeholder=""
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/supplier-management")}
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
                ? "Update Supplier"
                : "Add Supplier"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSupplier;
