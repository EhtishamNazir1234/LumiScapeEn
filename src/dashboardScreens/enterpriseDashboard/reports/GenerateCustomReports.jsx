import SelectField from "../../../common/SelectField";
import InputField from "../../../common/InputField";
import { PlusIcon } from "../../../assets/icon";
import CustomDatePicker from "../../../common/DatePicker";
const GenerateCustomReport = ({ selectedOption }) => {
  const options = [
    { id: "1", label: "admin" },
    { id: "2", label: "superadmin" },
    { id: "3", label: "enterprise" },
  ];
  const handleGenerate = () => {
    alert("Report Generated");
  };

  return (
    <div className="max-w-4xl py-7">
      {selectedOption === "Generate Custom Report" && (
        <div className="sm:block pb-10 hidden leading-8">
          <h1 className="font-[500px] xl:text-2xl text-lg  font-vivita">
            Generate Custom Report
          </h1>
          <p className="text-[#337FBA] xl:text-base font-Geom">
            Manage users, devices, and system performance effortlessly.
          </p>
        </div>
      )}
      {selectedOption === "Schedule Report" && (
        <div className="sm:block pb-10 hidden leading-8">
          <h1 className="font-[500px] xl:text-2xl text-lg  font-vivita">
            Schedule Report
          </h1>
          <p className="text-[#337FBA] xl:text-base font-Geom">
            Manage users, devices, and system performance effortlessly.
          </p>
        </div>
      )}
      <div className="global-bg-color box-shadow rounded-2xl p-8">
        <h1 className="text-xl font-Geom font-light text-black mb-5">
          Enter Report Details
        </h1>
        <div className="space-y-6">
          <div>
            <InputField
              id="reportName"
              label="Report Name"
              type="text"
              placeholder="Enter Report Name"
              color={`#2a7bb6`}
            />
          </div>
          {selectedOption === "Schedule Report" && (
            <div>
              <InputField
                id="reportName"
                label="Report Basis"
                type="text"
                placeholder="Select Report Basis"
                color={`#2a7bb6`}
              />
            </div>
          )}
          <div>
            <SelectField
              color={`#2a7bb6`}
              label={"Report Type"}
              options={options}
            />
          </div>
          <div>
            <SelectField
              color={`#2a7bb6`}
              label={"Select Entity"}
              options={options}
            />
          </div>
          {selectedOption === "Generate Custom Report" && (
            <div>
              <SelectField
                color={`#2a7bb6`}
                label={" Select Entity(Item)"}
                options={options}
              />
            </div>
          )}
          {selectedOption === "Schedule Report" && (
            <div>
              <SelectField
                color={`#2a7bb6`}
                label="Schedule"
                options={options}
              />
            </div>
          )}
          {selectedOption === "Generate Custom Report" && (
            <div>
              <CustomDatePicker
                id="date"
                label="Date"
                type="text"
                placeholder="mm/dd/yyyy"
                color="#2a7bb6"
              />
            </div>
          )}
          {selectedOption === "Schedule Report" && (
            <div className="w-full gap-x-7 flex">
              <CustomDatePicker
                id="startDate"
                label="Start Date"
                placeholder="Select Date"
                color="#2a7bb6"
              />
              <CustomDatePicker
                id="endDate"
                label="End Date"
                placeholder="Select Date"
                color="#2a7bb6"
              />
            </div>
          )}
          {selectedOption === "Generate Custom Report" && (
            <div>
              <SelectField
                color={`#2a7bb6`}
                label={`Delivery Method`}
                options={options}
              />
            </div>
          )}
          <div>
            <SelectField color={`#2a7bb6`} label={`Format`} options={options} />
          </div>
          <div>
            <SelectField
              color={`#2a7bb6`}
              label={`Recipient Type`}
              options={options}
            />
          </div>
          <div className="flex items-center ">
            <div className="w-[90%]">
              <InputField
                id="date"
                label="Add Custom Recipient"
                type="text"
                placeholder=""
                color={`#2a7bb6`}
              />
            </div>
            <div className="mt-8 ">
              <button className="cursor-pointer">
                <PlusIcon className="ml-13" size={22} color={`#2a7bb6`} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex justify-end">
          <div className="md:w-[25%]">
            <button onClick={handleGenerate} className=" font-vivita custom-shadow-button h-[140%]">
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateCustomReport;
