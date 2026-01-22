import React from "react";
import InputField from "../../common/InputField";
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate()
  return (
    <div className="global-bg-color lg:w-[65%] h-auto rounded-[20px] md:p-10 p-5 box-shadow">
      <h1 className="text-[20px] font-[500] font-vivita">Change Password</h1>
      <p className="text-[#337FBA] text-[15px]">
        A verification code will be sent to your email address to verify your
        identity before changing password
      </p>
      <div className="my-[3rem]">
        <InputField
          id="email"
          label="Email Address"
          type="email"
          placeholder=""
          rounded
        />
        <InputField
          id="password"
          label="Password"
          type="password"
          placeholder=""
          rounded
        />
      </div>
      <div className="flex justify-end mt-[4rem]">
        <button onClick={()=>navigate("/create-password")} className="custom-shadow-button font-vivita  !py-3">
          Verify
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
