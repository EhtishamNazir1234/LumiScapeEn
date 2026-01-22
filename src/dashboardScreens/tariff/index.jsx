import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { initialBands } from "../../../dummyData";

const TariffRates = () => {
  const navigate = useNavigate();
  const [bands, setBands] = useState(initialBands);
  const handleInputChange = (index, newValue) => {
    setBands((prev) =>
      prev.map((band, i) => (i === index ? { ...band, value: newValue } : band))
    );
  };

  return (
    <div className="lg:w-[60%] space-y-5 mt-7">
      <h1 className="font-vivita text-[24px] font-medium">
        Disco Tariff Rates
      </h1>
      <div className="global-bg-color box-shadow rounded-2xl p-8 shadow flex flex-col">
        {bands.map((band, index) => (
          <div
            key={band.name}
            className="flex items-center justify-between mb-6 "
          >
            <span className="text-md font-Geom">{band.name}</span>
            <input
              type="text"
              className="sm:w-48 sm:h-16 w-32 h-10 font-Geom rounded-lg bg-white border border-gray-200 text-center box-shadow "
              placeholder="123456"
              value={band.value}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className=" flex justify-end">
        <button className="custom-shadow-button sm:h-15 !w-[130px] sm:!w-[190px]">
          Update Rates
        </button>
      </div>
    </div>
  );
};

export default TariffRates;
