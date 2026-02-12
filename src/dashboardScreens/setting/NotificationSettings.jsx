import React, { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import ToggleSwitch from "../../common/ToggleSwitch";
import { useAuth } from "../../store/hooks";

const NotificationSetting = [
  {
    category: "General",
    items: [
      {
        key: "enableAll",
        label: "Enable All Notifications",
        description: "Enable all types of notifications",
        toggle: true,
      },
      {
        key: "emailAlerts",
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
        key: "suspiciousLoginAlerts",
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
        key: "unusualEnergyConsumption",
        label: "Unusual Energy Consumption",
        description: "Detect spikes or abnormal usage",
        toggle: true,
      },
      {
        key: "groupEnergyLimitBreached",
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
        key: "userGroupMembershipChanges",
        label: "User Joined or removed from a Group",
        description:
          "Notify when new user is added to a group or when someone is removed",
        toggle: true,
      },
      {
        key: "manualDeviceAdditionRequests",
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
        key: "systemMaintenanceNotices",
        label: "System Maintenance Notices",
        description: "Scheduled downtime or fixes",
        toggle: true,
      },
      {
        key: "appVersionUpdates",
        label: "App Version Update",
        description: "Notify on latest version release",
        toggle: true,
      },
    ],
  },
];

const NotificationSettings = () => {
  const { user, updateProfile } = useAuth();
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [preferences, setPreferences] = useState({
    enableAll: true,
    emailAlerts: true,
    suspiciousLoginAlerts: true,
    unusualEnergyConsumption: true,
    groupEnergyLimitBreached: true,
    userGroupMembershipChanges: true,
    manualDeviceAdditionRequests: true,
    systemMaintenanceNotices: true,
    appVersionUpdates: true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const toggleCategory = (category) => {
    const updatedSet = new Set(expandedCategories);
    if (updatedSet.has(category)) {
      updatedSet.delete(category);
    } else {
      updatedSet.add(category);
    }
    setExpandedCategories(updatedSet);
  };

  useEffect(() => {
    if (user?.notificationPreferences) {
      setPreferences((prev) => ({
        ...prev,
        ...user.notificationPreferences,
      }));
    }
  }, [user]);

  const handleTogglePreference = (key, value) => {
    setPreferences((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "enableAll") {
        // Master toggle: turn all others on/off together
        Object.keys(next).forEach((k) => {
          if (k !== "enableAll") next[k] = value;
        });
      } else if (!value) {
        // Turning any individual setting off disables Enable All
        next.enableAll = false;
      }
      return next;
    });
  };

  const handleSave = async () => {
    setMessage({ type: "", text: "" });
    setSaving(true);
    try {
      await updateProfile({ notificationPreferences: preferences });
      setMessage({ type: "success", text: "Notification settings saved." });
    } catch (err) {
      const text =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save notification settings.";
      setMessage({ type: "error", text });
    } finally {
      setSaving(false);
    }
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
      {message.text && (
        <div
          className={`mb-2 px-4 py-2 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}
      <div className="global-bg-color h-auto rounded-[20px] p-6 box-shadow">
        {NotificationSetting.map(({ category, items }) => (
          <div key={category} className="my-[2.5rem]">
            <div
              onClick={() => toggleCategory(category)}
              className="flex justify-between items-center lg:w-[46%] cursor-pointer"
            >
              <h1 className="text-[18px] font-[500]">{category}</h1>
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
                        checked={preferences[item.key]}
                        onChange={(newValue) =>
                          handleTogglePreference(item.key, newValue)
                        }
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
      <div className="flex justify-end">
        <button
          type="button"
          className="custom-shadow-button font-vivita !py-3"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Notification Settings"}
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
