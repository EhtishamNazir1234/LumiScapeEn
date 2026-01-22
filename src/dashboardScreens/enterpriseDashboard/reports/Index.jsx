import React, { useState } from "react";
import SearchField from "../../../common/SearchField";
import Filters from "../../../common/Filters";
import { ReportData, ReportsHeaderData } from "../../../../dummyData";
import Tooltip from "../../../common/Toltip";
import { FiDownload } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../../../common/custom-dropdown";
import { timeOptions } from "../../../../dummyData";
const Index = () => {
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState("This Month");

  const handleTimeChange = (value, dateData) => {
    setSelectedTime(value);
    if (value === "Date Range" && dateData) {
      console.log("Date Range Selected:", dateData);
    }
  };

  return (
    <div className="">
      <div className="flex gap-4 items-center justify-between">
        <h1 className="font-vivita my-10 text-lg md:text-xl">Reports</h1>
        <div className="whitespace-nowrap gap-4">
          <div className="flex gap-x-4">
            <div>
              <CustomDropdown
                options={timeOptions}
                placeholder="Select Time Period"
                value={selectedTime}
                onChange={handleTimeChange}
                rounded
                
              />
            </div>
            <div className="py-0">
              <button
                className="custom-shadow-button h-full whitespace-nowrap font-vivita md:mt-0 mt-3"
                onClick={() => navigate("/generate-report")}
              >
                Create New Report
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-5">
        <div className="global-bg-color rounded-[20px] md:p-7 p-3 box-shadow">
          <div className="md:flex  justify-between items-center gap-4">
            <h1 className="text-lg md:text-xl">Reports</h1>
            <div className="flex gap-3 sm:w-[70%] w-full">
              <SearchField placeholder="Search" />
              <Filters />
            </div>
          </div>

          <div className="overflow-x-auto my-7">
            <table className="w-full">
              <thead className="table-header">
                {ReportsHeaderData.map((heading, index) => (
                  <th key={heading._id}>{heading.heading}</th>
                ))}
              </thead>
              <tbody>
                {ReportData?.map((report, index) => (
                  <tr
                    key={report._id}
                    className="border-b-[1px] border-[#DEDFE0] last:border-0"
                  >
                    <td className="py-3 px-4 text-sm font-light ">
                      {report.reportName}
                    </td>
                    <td className="py-3 font-light text-sm">{report.type}</td>
                    <td className="py-3 px-4 text-sm font-light">
                      {report.format}
                    </td>
                    <td className="py-3 px-4 text-sm font-light">
                      {report.exportedOn}
                    </td>
                    <td className="py-3 px-4 text-sm font-light">
                      {report.exportedBy}
                    </td>
                    <td className="py-3 px-4 text-sm font-light">
                      {report.deliveredTo}
                    </td>
                    <td className="py-3 px-4 text-sm font-light">
                      {report.status}
                    </td>

                    <td className="py-3 mr-4 font-light flex justify-center gap-4">
                      <div className="flex mr-4 gap-4">
                        <FiDownload size={20} className="text-[#0061A9]" />
                        <Tooltip tooltipContent="View User">
                          <IoEyeOutline size={22} className="text-[#0061A9]" />
                        </Tooltip>

                        <RiDeleteBin6Line size={22} className="text-red-600" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
