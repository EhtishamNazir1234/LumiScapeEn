const TopUsedDevices = ({ devicesData }) => {
  const SemiCircleGraph = ({ color1, color2, value, maxValue, label }) => {
    const fillAmount = (value / maxValue) * 100;
    const strokeDashArray = 251.2;

    return (
      <div className="relative flex flex-col items-center">
        <svg
          viewBox="0 0 180 90"
          className="h-[70px] "
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient
              id={`gradient-${value}`}
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor={color1} />
              <stop offset="100%" stopColor={color2} />
            </linearGradient>
          </defs>
          <circle
            cx="90"
            cy="90"
            r="80"
            fill="none"
            stroke="#E5E5E5"
            strokeWidth="20"
            transform="rotate(-180 90 90)"
          />
          <circle
            cx="90"
            cy="90"
            r="80"
            fill="none"
            stroke={`url(#gradient-${value})`}
            strokeWidth="20"
            strokeDasharray={strokeDashArray}
            strokeDashoffset={
              strokeDashArray - (strokeDashArray * fillAmount) / 100
            }
            transform="rotate(-180 90 90)"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
          <circle
            cx="90"
            cy="90"
            r="80"
            fill="none"
            stroke="#FFFFFF33"
            strokeWidth="3"
            transform="rotate(-180 90 90)"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>

        <div className="absolute bottom-0 text-center">
          <div className="text-lg font-medium font-vivita text-[#0060A9]">
            {value}
          </div>
          <div className="text-sm text-[#0060A9]">{label}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="global-bg-color mb-4 rounded-2xl p-4 box-shadow md:w-full">
      <h2 className="font-vivita font-medium text-sm mb-4">Top Used Devices</h2>
      <div className="space-y-4">
        {devicesData.map((device, index) => (
          <div
            key={index}
            className="bg-[#FAFBFC] px-8 box-shadow rounded-2xl p-4"
          >
            <div className="text-[#669FCB] text-sm -ml-4 mb-4">
              {device.name}
            </div>
            <SemiCircleGraph
              color1={device.colors[0]}
              color2={device.colors[1]}
              value={device.users}
              maxValue={device.maxUsers}
              label="Users"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopUsedDevices;
