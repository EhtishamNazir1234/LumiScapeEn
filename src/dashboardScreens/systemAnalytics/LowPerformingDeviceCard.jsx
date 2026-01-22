const LowPerformingDeviceCard = ({data}) => (
  <div className="global-bg-color box-shadow rounded-2xl p-6 mb-6 ">
    <div className="font-vivita font-medium text-sm mb-6">
      Low Performing Device
    </div>
    <div className="flex items-center">
      <span className="font-vivita font-medium text-sm text-[#2A7BB6] whitespace-nowrap mr-2">
        {data.deviceName}
      </span>
      <span className="h-0.5 rounded w-[100%] rounded bg-gradient-to-r from-[#96F6AE] to-[#2A7BB6]" />
      <span className="text-sm whitespace-nowrap text-[#DB1C1C] ml-2">
        {data.userCount} {data.message}
      </span>
    </div>
  </div>
);

export default LowPerformingDeviceCard;
