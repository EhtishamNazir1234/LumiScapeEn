import React, { useState } from "react";
import Chips from "../../common/Chips";
import { suppliedItems } from "../../../dummyData";
import InputField from "../../common/InputField";

const AddSupplier = () => {
  const [selectedChips, setSelectedChips] = useState([]);
  return (
    <div className="global-bg-color md:w-[75%] h-auto rounded-[20px] md:p-7 p-5 box-shadow">
      <h1 className="text-[20px]">Add New Supplier</h1>
      <div className="my-[3rem] space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <InputField
            id="firstName"
            label="First Name"
            type="text"
            placeholder=""
          />
          <InputField
            id="middleName"
            label="Middle Name"
            type="text"
            placeholder=""
          />
          <InputField
            id="lastName"
            label="Last Name"
            type="text"
            placeholder=""
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <InputField id="email" label="Email" type="email" placeholder="" />
          </div>
          <div className="w-full">
            <InputField
              id="phone"
              label="Phone number"
              type="number"
              placeholder=""
            />
          </div>
        </div>
        <div className="">
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
          <InputField id="country" label="Country" type="text" placeholder="" />
          <InputField id="city" label="City" type="text" placeholder="" />
        </div>
      </div>
      <div className="flex justify-end">
        <button className="custom-shadow-button font-vivita md:!w-[30%] !py-3">
          Add Supplier
        </button>
      </div>
    </div>
  );
};

export default AddSupplier;
