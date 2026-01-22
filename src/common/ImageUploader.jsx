import React, { useState } from "react";
import { PiCameraLight } from "react-icons/pi";

const ImageUploader = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center">
      <div className="relative rounded-full overflow-hidden cursor-pointer hover:border-gray-500 transition duration-300 ease-in-out">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt="Profile Photo"
            className="w-32 h-32 object-cover rounded-full"
          />
        ) : (
          <div
            className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-inner"
            style={{ boxShadow: "inset 2px 2px 5px rgba(0, 0, 0, 0.15)" }}
          >
            <PiCameraLight size={70} className="text-[#D3D3D3]" />
          </div>
        )}
        <input
          id="profile-photo"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <label
          htmlFor="profile-photo"
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        ></label>
      </div>
      <div className="ml-4 text-sm font-light">Profile Photo</div>
    </div>
  );
};

export default ImageUploader;
