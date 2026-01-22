import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import ToggleSwitch from "../../common/ToggleSwitch";

const NotificationSetting = [
  {
    category: "General",
    items: [
      {
        label: "Enable All Notifications",
        description: "Enable all types of notifications",
        toggle: true,
      },
      {
        label: "Receive Email Alerts",
        description: "Get alerts via registered email",
        toggle: true,
      },
    ],
  },
  {
    category: "Security Alerts",
    items: [
      {
        label: "Suspicious Login Alerts",
        description: "Login from unknown device or location",
        toggle: true,
      },
    ],
  },
  {
    category: "Energy Alerts",
    items: [
      {
        label: "Unusual Energy Consumption",
        description: "Detect spikes or abnormal usage",
        toggle: true,
      },
      {
        label: "Group Energy Limit Breached",
        description: "Group exceeds predefined consumption limit",
        toggle: true,
      },
    ],
  },
  {
    category: "User Activity",
    items: [
      {
        label: "User Joined or removed from a Group",
        description:
          "Notify when new user is added to a group or when someone is removed",
        toggle: true,
      },
      {
        label: "Request for Manual Device Addition",
        description: "Approval needed from admin side",
        toggle: true,
      },
    ],
  },
  {
    category: "System Notifications",
    items: [
      {
        label: "System Maintenance Notices",
        description: "Scheduled downtime or fixes",
        toggle: true,
      },
      {
        label: "App Version Update",
        description: "Notify on latest version release",
        toggle: true,
      },
    ],
  },
];

const NotificationSettings = () => {
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  const toggleCategory = (category) => {
    const updatedSet = new Set(expandedCategories);
    if (updatedSet.has(category)) {
      updatedSet.delete(category);
    } else {
      updatedSet.add(category);
    }
    setExpandedCategories(updatedSet);
  };
  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[20px] font-[500] font-vivita">
          Notification Settings
        </h1>
        <p className="text-[#337FBA] text-[15px]">
          Customise your experience on Lumiscape.
        </p>
      </div>
      <div className="global-bg-color  h-auto rounded-[20px] p-6 box-shadow">
        {NotificationSetting.map(({ category, items }) => (
          <div key={category} className="my-[2.5rem]">
            <div
              onClick={() => toggleCategory(category)}
              className="flex justify-between items-center  lg:w-[46%] cursor-pointer"
            >
              <h1 className="text-[18px] font-[500">{category}</h1>
              <MdKeyboardArrowDown
                size={22}
                className={`text-[#0060A9] transition-transform ${
                  expandedCategories.has(category) ? "rotate-180" : ""
                }`}
              />
            </div>
            {expandedCategories.has(category) && (
              <div className="my-7">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[4rem]">
                  {items.map((item, index) => (
                    <div key={index} className="">
                      <ToggleSwitch
                        label={item.label}
                        checked={item.toggle}
                        //    onChange={(newState) =>
                        //      handleToggle(plan.id, featureIndex, newState)
                        //    }
                      />
                      <p className="text-[12px] text-[#337FBA]">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;
