import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";

const FilterCanvasBar = ({
  setFiltersCities,
  filtersCities,
  setFilterSupplieditems,
  filterSupplieditems,
  onClose,
}) => {
  const [city, setCity] = useState("");
  const [item, setItem] = useState("");

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleItemChange = (e) => {
    setItem(e.target.value);
  };

  const addCity = () => {
    if (city && !filtersCities.includes(city)) {
      setFiltersCities([...filtersCities, city]);
      setCity("");
    }
  };

  const addItem = () => {
    if (item && !filterSupplieditems.includes(item)) {
      setFilterSupplieditems([...filterSupplieditems, item]);
      setItem("");
    }
  };

  const handleCityKeyPress = (e) => {
    if (e.key === "Enter") {
      addCity();
    }
  };

  const handleItemKeyPress = (e) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  const removeCity = (cityToRemove) => {
    setFiltersCities(filtersCities.filter((city) => city !== cityToRemove));
  };

  const removeItem = (itemToRemove) => {
    setFilterSupplieditems(
      filterSupplieditems.filter((item) => item !== itemToRemove)
    );
  };

  return (
    <div className="bg-[#EFF5F9] top-0 right-0 absolute w-[60%] md:w-[15%] min-h-screen md:min-h-screen z-50 box-shadow">
      <div className="flex justify-end my-5 mx-3">
        <button
          className="text-2xl cursor-pointer text-gray-600"
          onClick={onClose}
        >
          <RxCross2 />
        </button>
      </div>
      <div className="my-5 lg:px-7 p-3 px-4`">
        <h1 className="font-vivita font-medium text-[20px]">Filters</h1>
        <div className="my-10">
          <div className="mb-4">
            <label className="block font-medium font-vivita text-sm text-[#0060A9] mb-2">
              Filter by City
            </label>
            <input
              id="filter-input-city"
              type="text"
              value={city}
              placeholder="Enter City"
              onChange={handleCityChange}
              onKeyDown={handleCityKeyPress}
              className="w-full rounded-4xl bg-[#E4EDF6] border-b-[0.3px] border-gray-300 px-4 py-2 text-gray-700"
              style={{ boxShadow: "inset 0px 3px 5px rgba(0, 0, 0, 0.15)" }}
            />
            <ul className="space-y-3 my-5">
              {filtersCities.length > 0 &&
                filtersCities.map((city, index) => (
                  <li key={index} className="flex items-center justify-between">
                    {city}
                    <RxCross2
                      className="text-red-600 cursor-pointer"
                      onClick={() => removeCity(city)}
                    />
                  </li>
                ))}
            </ul>
          </div>
          <div className="mb-4">
            <label className="block font-medium font-vivita text-sm text-[#0060A9] mb-2">
              Filter by Items
            </label>
            <input
              id="filter-input-item"
              type="text"
              value={item}
              placeholder="Enter Supplied Items"
              onChange={handleItemChange}
              onKeyDown={handleItemKeyPress} 
              className="w-full rounded-4xl bg-[#E4EDF6] border-b-[0.3px] border-gray-300 px-4 py-2 text-gray-700"
              style={{ boxShadow: "inset 0px 3px 5px rgba(0, 0, 0, 0.15)" }}
            />
            <ul className="space-y-3 my-5">
              {filterSupplieditems.length > 0 &&
                filterSupplieditems.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    {item}
                    <RxCross2
                      className="text-red-600 cursor-pointer"
                      onClick={() => removeItem(item)}
                    />
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterCanvasBar;
