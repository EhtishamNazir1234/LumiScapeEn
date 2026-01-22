import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ label = "Date", id, color, placeholder }) => {
  const [date, setDate] = useState(null);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-light ${
            color ? `text-[${color}]` : ""
          } mb-2`}
        >
          {label}
        </label>
      )}
      <DatePicker
        selected={date}
        onChange={(d) => setDate(d)}
        placeholderText={placeholder}
        dateFormat="MM/dd/yyyy"
        popperPlacement="bottom-end"
        wrapperClassName="w-full"
        className={`w-full rounded-lg bg-white ]  px-4 py-2 text-gray-700`}
      />
    </div>
  );
};

export default CustomDatePicker;
