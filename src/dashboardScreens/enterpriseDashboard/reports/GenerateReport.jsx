import React,{useState} from "react";
import SelectField from "../../../common/SelectField";
import GenerateCustomReport from "./GenerateCustomReports";
const GenerateReport = () => {
  const [showCustomReport, setShowCustomReport] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Schedule Report');

  const options = [
    { id: "1", label: "Schedule Report" },
    { id: "2", label: "Generate Custom Report" },
   
  ];
  if (showCustomReport) {
    return <GenerateCustomReport selectedOption={selectedOption}/>;
  }
  return (
    <div className="max-w-4xl py-7">
      <div className="sm:block pb-10 hidden leading-8">
        <h1 className="font-[500px] xl:text-2xl text-lg  font-vivita">
          Generate Report
        </h1>
        <p className="text-[#337FBA] xl:text-base font-Geom">
          Manage users, devices, and system performance effortlessly.
        </p>
      </div>
      <div className="global-bg-color box-shadow rounded-2xl p-8">
        <h1 className="text-xl font-Geom font-light text-black mb-5">
          Generate Reports
        </h1>
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-[#2a7bb6] mb-1">
              Report Mode
            </label>

            <SelectField
              options={options}
              selectedOption={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
          </div>

          <div className="pt-8 flex justify-end">
            <div className="md:w-[25%]">
              <button
                className=" font-vivita custom-shadow-button h-[140%]"
                onClick={() => setShowCustomReport(true)}
                disabled={!selectedOption}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;
