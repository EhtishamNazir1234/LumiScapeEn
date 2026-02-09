import React, { useState, useEffect } from "react";
import InputField from "../../common/InputField";
import ImageUploader from "../../common/ImageUploader";
import { useAuth } from "../../store/hooks";
import { compressImage } from "../../utils/imageCompress";

const splitName = (name) => {
  if (!name || typeof name !== "string") return { first: "", last: "" };
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
};

const PersonalDetail = () => {
  const { user, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pendingProfileImage, setPendingProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      const { first, last } = splitName(user.name);
      setFirstName(first);
      setLastName(last);
      setEmail(user.email || "");
      setPhone(user.phone || "");
      // When user data changes (e.g. after successful update), clear local draft image
      setPendingProfileImage(null);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);
    try {
      const name = [firstName, lastName].filter(Boolean).join(" ").trim();
      if (!name) {
        setMessage({ type: "error", text: "Name is required." });
        setLoading(false);
        return;
      }
      if (!(email && email.trim())) {
        setMessage({ type: "error", text: "Email is required." });
        setLoading(false);
        return;
      }
      const payload = {
        name,
        email: email.trim(),
        phone: (phone || "").trim(),
      };
      if (pendingProfileImage) {
        payload.profileImage = pendingProfileImage;
      }
      await updateProfile(payload);
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      const text = err.response?.data?.message || err.message || "Failed to update profile.";
      setMessage({ type: "error", text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="global-bg-color lg:w-[65%] h-auto rounded-[20px] md:p-10 p-5 box-shadow">
      <form onSubmit={handleSubmit}>
        <div className="mb-[3rem]">
          <div className="mb-10">
            <ImageUploader
              value={pendingProfileImage || user?.profileImage}
              onChange={async (dataUrl) => {
                try {
                  // Prepare a lightweight, compressed preview; only saved when user presses "Update Details"
                  const compressed = await compressImage(dataUrl, 400, 0.82);
                  setPendingProfileImage(compressed);
                } catch {
                  setMessage({ type: "error", text: "Failed to process profile photo." });
                }
              }}
            />
          </div>
          {message.text && (
            <div
              className={`mb-4 px-4 py-2 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <InputField
              id="firstName"
              label="First Name"
              type="text"
              placeholder=""
              rounded
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <InputField
              id="lastName"
              label="Last Name"
              type="text"
              placeholder=""
              rounded
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder=""
            rounded
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            id="phone"
            label="Phone Number"
            type="tel"
            placeholder=""
            rounded
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="custom-shadow-button font-vivita  !py-3"
            disabled={loading}
          >
            {loading ? "Updating…" : "Update Details"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalDetail;
