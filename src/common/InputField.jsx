import React from 'react';

const InputField = ({ label, id, type = 'text', placeholder, value, onChange, rounded , color }) => {
  return (
    <div className="">
      {label && (
        <label htmlFor={id} className={`block text-sm font-light ${color ? `text-[${color}]` : ""} mb-2`}
       >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full ${rounded ? "rounded-4xl" : "rounded-lg"}  bg-white ]  px-4 py-2 text-gray-700`}
        style={{ boxShadow: 'inset 2px 3px 5px rgba(0, 0, 0, 0.15)' }}
      />
    </div>
  );
};

export default InputField;
