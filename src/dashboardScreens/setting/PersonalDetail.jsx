import React from "react";
import InputField from "../../common/InputField";
import ImageUploader from "../../common/ImageUploader";

const PersonalDetail = () => {
  return (
    <div className="global-bg-color lg:w-[65%] h-auto rounded-[20px] md:p-10 p-5 box-shadow">
      <div className="mb-[3rem]">
        <div className="mb-10">
          <ImageUploader />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <InputField
            id="firstName"
            label="First Name"
            type="text"
            placeholder=""
            rounded
          />
          <InputField
            id="lastName"
            label="Last Name"
            type="text"
            placeholder=""
            rounded
          />
        </div>
        <InputField
          id="email"
          label="Email"
          type="email"
          placeholder=""
          rounded
        />
        <InputField
          id="phone"
          label="Phone Number"
          type="number"
          placeholder=""
          rounded
        />
      </div>
      <div className="flex justify-end">
        <button className="custom-shadow-button font-vivita  !py-3">
          Update Details
        </button>
      </div>
    </div>
  );
};

export default PersonalDetail;
