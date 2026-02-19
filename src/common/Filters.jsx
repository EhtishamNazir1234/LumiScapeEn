import React from 'react';
import { IoSearch } from "react-icons/io5";
import filterIcon from "../assets/filterIcon.svg"

const Filters = ({ onClick }) => {
  return (
    <div onClick={onClick} className="sm:w-[30%] w-[20%] flex items-center cursor-pointer justify-between rounded-4xl bg-[#E4EDF6] border-b-[0.3px] border-gray-300  px-4 py-2 text-gray-700"
    style={{ boxShadow: 'inset 0px 3px 5px rgba(0, 0, 0, 0.15)' }}>
      <h3 className='text-[#9AC0DC] sm:block hidden'>Filters</h3>
      <img src={filterIcon} />
    </div>
  );
};

export default Filters;
