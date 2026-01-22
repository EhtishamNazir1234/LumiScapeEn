import React, { useState } from "react";
import Chips from "../../common/Chips";
import { suppliedItems } from "../../../dummyData";
import InputField from "../../common/InputField";
import SelectField from "../../common/SelectField";

const options = [
  { id: "1", label: "Admin" },
  { id: "2", label: "Manager" },
  { id: "3", label: "Super Admin" },
];

const AddAdmin = () => {
  const [selectedChips, setSelectedChips] = useState([]);
  return (
    <div className="global-bg-color md:w-[75%] h-auto rounded-[20px] md:p-7 p-4 box-shadow">
      <h1 className="text-[20px]">Add New Admin</h1>
      <div className="md:mt-[3rem] mt-[1rem] space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <InputField
            id="firstName"
            label="First Name"
            type="text"
            placeholder=""
          />
          <InputField
            id="lastName"
            label="Last Name"
            type="text"
            placeholder=""
          />
          <InputField
            id="phone"
            label="Phone number"
            type="number"
            placeholder=""
          />
        </div>
        <div>
          <SelectField
            label="Select an option"
            id="mySelect"
            options={options}
          />
        </div>
        <div>
          <InputField id="email" label="Email" type="email" placeholder="" />
        </div>
      </div>
      <div className="flex justify-end my-5">
        <button className="custom-shadow-button font-vivita md:!w-[30%] !py-3">
          Add Admin
        </button>
      </div>
    </div>
  );
};

export default AddAdmin;
