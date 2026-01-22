import React, { useState } from "react";

const Tooltip = ({ children, tooltipContent }) => {
  const [isVisible, setIsVisible] = useState(false);
  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);

  return (
    <div className="relative inline-block">
      <button
        className=""
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </button>
      {isVisible && (
        <div
          role="tooltip"
          className="absolute max-w-[100px] whitespace-nowrap z-10 inline-block px-2 py-1 text-sm font-medium text-white bg-[#0360A9] rounded-md shadow-xs opacity-100 transition-opacity duration-300 dark:bg-gray-700"
          style={{ bottom: "110%", left: "50%", transform: "translateX(-50%)" }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
