import React from "react";
import { RxCross2 } from "react-icons/rx";

const Chips = ({
  label,
  id,
  list = [],
  value = null,
  onChange,
  placeholder,
}) => {
  const handleChange = (e) => {
    const selectedId = e.target.value;
    const selectedItem = list.find((item) => String(item.id) === selectedId);
    const isAlreadySelected = value.some((item) => item.id === selectedItem.id);
    if (!isAlreadySelected) {
      onChange([...value, selectedItem]);
    }
  };

  const removeChip = (id) => {
    const newValue = value.filter((item) => item.id !== id);
    onChange(newValue);
  };

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-light text-[#0060A9] mb-2"
        >
          {label}
        </label>
      )}

      <select
        id={id}
        className="w-full rounded-lg bg-white border-b-[0.3px] border-gray-300 px-4 py-2 pr-16 text-gray-700"
        style={{
          boxShadow: "inset 0px 3px 5px rgba(0, 0, 0, 0.15)",
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="gray" height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg"><polygon points="10,14 16,20 22,14"/></svg>')`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 24px center",
          backgroundSize: "24px 24px",
        }}
        onChange={handleChange}
      >
        <option value="" disabled>
          {placeholder || "Select an option"}
        </option>
        {list.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>

      <div className="my-5 flex gap-2 flex-wrap items-center">
        {value.length > 0 &&
          value.map((item) => {
            return (
              <div
                className="w-[25%] flex items-center cursor-pointer justify-between rounded-4xl bg-[#E4EDF6] border-b-[0.3px] border-gray-300  px-4 py-2 text-gray-700"
                style={{ boxShadow: "inset 0px 3px 5px rgba(0, 0, 0, 0.15)" }}
              >
                <h3 className="text-[#9AC0DC] text-base whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {item.label}
                </h3>

                <RxCross2
                  className="text-red-600"
                  onClick={() => removeChip(item.id)}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Chips;
