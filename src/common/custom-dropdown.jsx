import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"
import DatePicker from "react-datepicker"

const CustomcDropdown = ({
  options = [],
  placeholder = "Choose Option",
  value,
  onChange,
  className = "",
  disabled = false,
  rounded
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || "")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const dropdownRef = useRef(null)
  const selectRef = useRef(null)

  // Check if options include Date Range
  const hasDateRange = options.some(
    (option) =>
      (typeof option === "string" && option === "Date Range") ||
      (typeof option === "object" && (option.value === "Date Range" || option.label === "Date Range")),
  )

  const formatDate = (date) => {
    if (!date) return ""
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        selectRef.current &&
        !selectRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  // Update selected value when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  const handleSelect = (optionValue) => {
    setSelectedValue(optionValue)
    setIsOpen(false)
    if (onChange) {
      // For date range, pass both dates
      if (optionValue === "Date Range") {
        onChange(optionValue, { startDate, endDate })
      } else {
        onChange(optionValue)
      }
    }
  }

  // Handle date changes
  const handleStartDateChange = (date) => {
    setStartDate(date)
    if (onChange && selectedValue === "Date Range") {
      onChange("Date Range", { startDate: date, endDate })
    }
  }

  const handleEndDateChange = (date) => {
    setEndDate(date)
    if (onChange && selectedValue === "Date Range") {
      onChange("Date Range", { startDate, endDate: date })
    }
  }

  // Normalize options to handle both string and object formats
  const normalizedOptions = options.map((option) => {
    if (typeof option === "string") {
      return { value: option, label: option }
    }
    return option
  })

  const selectedOption = normalizedOptions.find((option) => option.value === selectedValue)
  const displayText = selectedOption ? selectedOption.label : placeholder

  const CalendarIcon = () => (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="#7CB4E2"
      strokeWidth="2"
      viewBox="0 0 24 24"
      className="flex-shrink-0"
    >
      <rect x="3" y="4" width="18" height="18" rx="4" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )

  return (
    <div className={`relative w-full ${className}`}>
      {selectedValue === "Date Range" && hasDateRange ? (
        <div className="relative">
          {/* Date Range Container */}
          <div className="w-full px-3 sm:px-4 sm:py-[7px] md:px-6 global-bg-color box-shadow   bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-between transition-all duration-200">
            <div className="flex items-center gap-3  min-w-0 flex-1">
              {/* <span className="font-medium text-gray-900 text-xs sm:text-sm md:text-base whitespace-nowrap">
                Date Range
              </span> */}

              {/* Start Date Picker */}
              <div className="flex items-center bg-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg shadow-sm border border-gray-200 min-w-[80px] sm:min-w-[100px] ">
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  dateFormat="MM/dd/yyyy"
                  className="w-full border-none focus:outline-none cursor-pointer text-xs sm:text-sm bg-transparent"
                  placeholderText="Start"
                  customInput={
                    <div className="flex items-center gap-1 sm:gap-2 cursor-pointer">
                      <CalendarIcon />
                      <span className="text-gray-800 text-xs sm:text-sm truncate">
                        {startDate ? formatDate(startDate) : "Start"}
                      </span>
                    </div>
                  }
                />
              </div>

              <span className="font-medium text-gray-600 text-xs sm:text-sm hidden sm:inline">To</span>

              {/* End Date Picker */}
              <div className="flex items-center bg-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg shadow-sm border border-gray-200 min-w-[80px] sm:min-w-[100px]">
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  dateFormat="MM/dd/yyyy"
                  className="w-full border-none focus:outline-none cursor-pointer text-xs sm:text-sm bg-transparent"
                  minDate={startDate}
                  placeholderText="End"
                  customInput={
                    <div className="flex items-center gap-1 sm:gap-2 cursor-pointer">
                      <CalendarIcon />
                      <span className="text-gray-800 text-xs sm:text-sm truncate">
                        {endDate ? formatDate(endDate) : "End"}
                      </span>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Dropdown Arrow */}
            <ChevronDown
              className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-500 transition-transform duration-200 cursor-pointer flex-shrink-0 ml-1 sm:ml-2 ${
                isOpen ? "rotate-180" : ""
              }`}
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>

          {/* Dropdown Menu for Date Range */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-100">
              {normalizedOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 text-left text-xs sm:text-sm md:text-base hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl ${
                    selectedValue === option.value ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-900"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Regular Dropdown */
        <div className="relative">
          <button
            ref={selectRef}
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={`w-full global-bg-color box-shadow  px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-between text-left text-gray-900 font-medium text-xs sm:text-sm md:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            } ${isOpen ? "ring-2 ring-blue-500 border-blue-500" : ""}
            ${rounded ? "rounded-full" : "rounded-xl"}`
          }
          >
            <span className={`truncate ${selectedOption ? "text-gray-900" : "text-gray-500"}`}>{displayText}</span>
            <ChevronDown
              className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-500 transition-transform duration-200 flex-shrink-0 ml-2 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu for Regular Options */}
          {isOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-100"
            >
              {normalizedOptions.length === 0 ? (
                <div className="px-3 py-2 sm:px-4 sm:py-3 text-gray-500 text-xs sm:text-sm">No options available</div>
              ) : (
                normalizedOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 text-left text-xs sm:text-sm md:text-base hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl ${
                      selectedValue === option.value ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-900"
                    }`}
                  >
                    {option.label}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CustomcDropdown
