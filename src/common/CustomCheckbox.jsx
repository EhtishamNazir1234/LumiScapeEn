import React from "react";

const CustomCheckbox = ({
  id,
  checked,
  onChange,
  className = "",
  ...props
}) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      className="peer hidden"
      id={id}
      checked={checked}
      onChange={onChange}
      {...props}
    />
    <label
      htmlFor={id}
      className={`w-6 h-6 box-shadow inline-flex items-center justify-center rounded-md cursor-pointer
        bg-white shadow-inner transition-all duration-200
        peer-checked:bg-gradient-to-br peer-checked:from-[#d4e0f0] peer-checked:to-[#bcd6ef]
        peer-checked:ring-1 peer-checked:ring-blue-600
        relative ${className}`}
    >
      {checked && (
        <span className="absolute">
          <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
            <path d="M16.7919 4.1873C16.7183 4.1131 16.6307 4.0542 16.5343 4.01401C16.4378 3.97382 16.3343 3.95312 16.2298 3.95312C16.1253 3.95312 16.0218 3.97382 15.9253 4.01401C15.8289 4.0542 15.7413 4.1131 15.6677 4.1873L6.7298 13.1331L3.33355 9.72897C3.18448 9.57989 2.98229 9.49614 2.77147 9.49614C2.56065 9.49614 2.35846 9.57989 2.20938 9.72897C2.06031 9.87804 1.97656 10.0802 1.97656 10.291C1.97656 10.5019 2.06031 10.7041 2.20938 10.8531L6.16772 14.8115C6.24131 14.8857 6.32887 14.9446 6.42534 14.9848C6.52182 15.0249 6.62529 15.0456 6.7298 15.0456C6.83431 15.0456 6.93779 15.0249 7.03426 14.9848C7.13073 14.9446 7.21829 14.8857 7.29188 14.8115L16.7919 5.31147C16.8661 5.23787 16.925 5.15031 16.9652 5.05384C17.0054 4.95737 17.0261 4.85389 17.0261 4.74938C17.0261 4.64487 17.0054 4.5414 16.9652 4.44493C16.925 4.34845 16.8661 4.26089 16.7919 4.1873Z" fill="#0060A9"/>
          </svg>
        </span>
      )}
    </label>
  </div>
);

export default CustomCheckbox; 