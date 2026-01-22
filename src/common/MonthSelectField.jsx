import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { options } from "../../dummyData";

const MonthSelectField = ({ selectedOption, setSelectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const dropdownRef = useRef(null);
  const selectRef = useRef(null);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        selectRef.current && !selectRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      {selectedOption === "Date Range" ? (
        <div className="relative">
          <div className="flex justify-between items-center whitespace-nowrap gap-4 w-full box-shadow border global-bg-color border-gray-300 py-1 px-4 cursor-pointer">
          <div className="flex items-center gap-1" >
           <h1 className="font-vivita font-medium">Date Range</h1>
            <div className="flex justify-end items-center bg-white px-2 box-shadow py-2 w-[100px] rounded-[10px]">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="MM/dd/yyyy"
                className="w-full border-none focus:outline-none cursor-pointer"
                customInput={
                  <div className="flex items-center text-xs text-gray-800">
                    <svg width="20" height="22" fill="none" stroke="#7CB4E2" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="4"/>
                      <path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                    <span>{startDate ? formatDate(startDate) : ""}</span>
                  </div>
                }
              />
            </div>

            <span className="font-vivita font-medium text-md">To</span>
            <div className="flex justify-end items-center px-2 bg-white box-shadow w-[100px] py-2 rounded-[10px]">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="MM/dd/yyyy"
                className="w-full border-none focus:outline-none cursor-pointer"
                minDate={startDate}
                customInput={
                  <div className="flex items-center text-xs text-gray-800">
                    <svg width="20" height="22" fill="none" stroke="#7CB4E2" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="4"/>
                      <path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                    <span>{endDate ? formatDate(endDate) : ""}</span>
                  </div>
                }
              />
            </div>
            </div>

            <IoIosArrowDown
              className={`text-blue-500 ml-2 text-2xl transition-transform ${isOpen ? 'rotate-180' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>

          {isOpen && (
            <div className="absolute right-0 min-w-[20%] font-light bg-white border border-gray-300 rounded-lg shadow-lg z-50">
              {options.map((option) => (
                <div
                  key={option}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                  onClick={() => {
                    setSelectedOption(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          ref={selectRef}
          className="relative flex items-center justify-between rounded-[10px] box-shadow border global-bg-color border-gray-300 font-medium font-vivita py-4 px-4 cursor-pointer overflow-hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-vivita font-[500]">{selectedOption}</span>
          <IoIosArrowDown
            className={`text-blue-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      )}

      {isOpen && selectedOption !== "Date Range" && (
        <div
          ref={dropdownRef}
          className="absolute right-0 font-light bg-white border border-gray-300 rounded-lg shadow-lg z-50"
        >
          {options.map((option) => (
            <div
              key={option}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
              onClick={() => {
                setSelectedOption(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default MonthSelectField;
