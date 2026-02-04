import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import CustomCheckbox from "../common/CustomCheckbox"

const AssignTicketModal = ({
  isOpen,
  onClose,
  title,
  buttontext,
  listData,
  onBack,
  onAssign
}) => {
  const [checkedUsers, setCheckedUsers] = useState({});

  useEffect(() => {
    // Reset selection whenever the modal is closed,
    // so reopening starts with all checkboxes unchecked.
    if (!isOpen) {
      setCheckedUsers({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckboxChange = (id) => {
    setCheckedUsers((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const selectedIds = Object.keys(checkedUsers).filter((id) => checkedUsers[id]);
  const handleAssign = () => {
    if (onAssign) onAssign(selectedIds);
  };

  return (
    <>
      <div
      onClick={onClose}
      className="fixed inset-0 bg-black h-full z-40"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    />
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl md:p-7 p-3 md:max-w-xl max-w-[80%] w-full shadow-lg text-center space-y-3"
        >
          <div className="flex justify-end">
            <RxCross2
              onClick={onClose}
              className="text-red-600 cursor-pointer"
              size={30}
            />
          </div>
          <h1 className="font-medium md:text-[26px] text-[20px] font-vivita">{title}</h1>
          <div className="md:space-y-4 md:my-8 md:h-[300px] h-[250px] overflow-y-auto min-h-0 rounded-lg border border-gray-100 p-1">
            {listData.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between p-2 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 shrink-0 aspect-square rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={admin.avatar}
                      alt={admin.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <span className="text-[#0060A9] font-vivita">
                    {admin.name}
                  </span>
                </div>
                <CustomCheckbox
                  id={`user-checkbox-${admin.id}`}
                  checked={!!checkedUsers[admin.id]}
                  onChange={() => handleCheckboxChange(admin.id)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-7 md:mt-8">
            <div className="md:w-[30%] w-full">
              <button
                className="w-full py-3 border border-red-400  text-red-500 rounded-4xl cursor-pointer"
                onClick={onBack}
              >
                Back
              </button>
            </div>
            <div className="md:w-[30%] w-full">
              <button className="custom-shadow-button !py-3" onClick={handleAssign} disabled={selectedIds.length === 0}>
                {buttontext}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignTicketModal;
