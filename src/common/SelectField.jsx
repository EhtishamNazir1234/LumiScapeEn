import React from "react";
import { ChevronDown } from "lucide-react";
const SelectField = ({
  label,
  id,
  value,
  onChange,
  options,
  rounded,
  color,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm ${
            color ? `text-[${color}]` : "text-black"
          } font-light mb-2`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value ?? ""}
          onChange={onChange}
          className={`w-full ${
            rounded ? "rounded-4xl" : "rounded-lg"
          } bg-white px-4 py-2 text-gray-700 appearance-none`}
          style={{
            boxShadow: "inset 2px 3px 5px rgba(0, 0, 0, 0.15)",
          }}
        >
          <option value="">-- Select Option --</option>
          {options.map((option, index) => (
            <option key={index} value={option.value !== undefined ? option.value : option.label}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#0060A9]" />
      </div>
    </div>
  );
};

export default SelectField;
