import React from 'react';
import { IoSearch } from "react-icons/io5";

const SearchField = ({ id, type = 'text', placeholder, value, onChange }) => {
  return (
    <div
      className="w-[270px] md:w-full flex items-center rounded-4xl bg-[#E4EDF6] border-b-[0.3px] border-gray-300 px-4 py-2 text-gray-700 box-shadow"
    >
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ outline: 'none' }}
        className='w-full'
      />
      <IoSearch size={23} className='text-[#9AC0DC]'/>
    </div>
  );
};

export default SearchField;
