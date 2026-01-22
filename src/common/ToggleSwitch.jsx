import React from "react";

const ToggleSwitch = ({
  label = "",
  checked = false,
  onChange = () => {},
}) => {
  return (
    <label
      className="inline-flex items-center justify-between w-full cursor-pointer"
    >
      <span className="text-sm font-medium text-gray-900 dark:text-black-300">
        {label}
      </span>
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => {
            onChange(e.target.checked); 
          }}
      />
      <div
        className="relative w-11 h-6 bg-gray-400 rounded-full dark:peer-focus:ring-[#CDDFEE] dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full  after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-[linear-gradient(270deg,_#2A7BB6_0%,_#96F6AE_100%)]
      after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-[#CDDFEE] peer-checked:bg-[#CDDFEE] dark:peer-checked:bg-[#CDDFEE]"
      ></div>
    </label>
   
  );
};

export default ToggleSwitch;
