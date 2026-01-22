import total from "../../assets/total.svg";
import standardColor from "../../assets/standardColor.svg";
import basicColor from "../../assets/basicColor.svg";

const ActiveInactiveCard = ({
  title,
  data,
  totalLabel,
  activeLabel,
  inactiveLabel,
}) => {
  const totalDevices = data.active + data.inactive;
  const activePercentage = (data.active / totalDevices) * 100;
  const inactivePercentage = (data.inactive / totalDevices) * 100;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 7;
  const gapPercentage = 5;
  const gap = (gapPercentage / 550) * circumference;
  const adjustedActive = (activePercentage / 100) * circumference - gap;
  const adjustedInactive = (inactivePercentage / 100) * circumference - gap;

  return (
    <div className="global-bg-color flex flex-col md:flex-row font-vivita p-4 px-10 box-shadow rounded-3xl w-full max-w-[100%]">
      <div className="flex-1">
        <div className="mb-2">
          <h3 className="text-sm font-medium">
            <span className="whitespace-nowrap">Active/ Inactive </span>
            <span className="text-[#0360A9]">{title}</span>
          </h3>
        </div>
        <div className="space-y-1 md:mr-0 mr-20 whitespace-nowrap">
          <div className="flex md:mb-26  items-center">
            <img src={total} alt={totalLabel} />
            <span className="font-light text-[#669FCB] ml-2">{totalLabel}</span>
            <div className="w-12 h-0.5 bg-[#0360A9] mx-4" />
            <span className="text-[#0360A9] text-sm">{totalDevices}</span>
          </div>
          <div className="flex items-center">
            <img src={basicColor} alt={activeLabel} />
            <span className="text-[#669FCB] font-light ml-2">
              {activeLabel}
            </span>
            <div className="w-12 h-0.5 bg-[#0360A9] mx-3" />
            <span className="text-sm text-[#0360A9]">{data.active}</span>
          </div>
          <div className="flex items-center">
            <img src={standardColor} alt={inactiveLabel} />
            <span className="ml-2 text-[#669FCB] font-light">
              {inactiveLabel}
            </span>
            <div className="w-12 h-0.5 bg-[#9FFFAE] mx-2" />
            <span className="text-sm text-[#0360A9]">{data.inactive}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-[144px] h-[144px] flex justify-center items-center">
          <div className="relative w-[144px] h-[144px]">
            <svg
              width="144"
              height="144"
              viewBox="0 0 144 144"
              className="-rotate-90"
            >
              <circle
                cx="72"
                cy="72"
                r={radius}
                fill="none"
                stroke="#f3f4f6"
                strokeWidth={strokeWidth}
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                fill="none"
                stroke="#0360A9"
                strokeWidth={strokeWidth}
                strokeDasharray={`${adjustedActive} ${circumference}`}
                strokeDashoffset="0"
                strokeLinecap="butt"
                className="transition-all duration-1000 ease-out"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                fill="none"
                stroke="#9FFFAE"
                strokeWidth={strokeWidth}
                strokeDasharray={`${adjustedInactive} ${circumference}`}
                strokeDashoffset={-(adjustedActive + gap)}
                strokeLinecap="butt"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[90px] h-[90px] rounded-full bg-gradient-to-br from-[#9FFFAE] to-[#0360A9] flex items-center justify-center">
                <span className="text-xl font-vivita text-white">
                  {totalDevices}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveInactiveCard;
