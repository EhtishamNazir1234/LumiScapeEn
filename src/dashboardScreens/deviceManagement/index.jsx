import DeviceManagementTable from "./DeviceManagementTable";
import Analytics from "./Analytics";

const DeviceManagement = () => {
  return (
    <>
      <div className="flex flex-col w-40 md:w-full sm:flex-row justify-between whitespace-nowrap mb-5">
        <h1 className="font-vivita text-2xl font-medium">Device Management</h1>
        <div>
          <button className="custom-shadow-button md:mt-0 mt-3">
            Add New Device
          </button>
        </div>
      </div>
      <div className="flex gap-x-6">
        <Analytics />
      </div>
      <DeviceManagementTable />
    </>
  );
};

export default DeviceManagement;
