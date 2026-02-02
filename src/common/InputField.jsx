import React, { useState } from 'react';

const EyeIcon = ({ show, color = '#0060A9', className = '' }) => (
  <span className={className} aria-hidden>
    {show ? (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )}
  </span>
);

const InputField = ({ label, id, type = 'text', placeholder, value, onChange, rounded, color = '#0060A9' }) => {
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="">
      {label && (
        <label htmlFor={id} className={`block text-sm font-light mb-2`} style={color ? { color } : {}}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full ${rounded ? "rounded-4xl" : "rounded-lg"} bg-white px-4 py-2 text-gray-700 ${isPassword ? "pr-10" : ""}`}
          style={{ boxShadow: 'inset 2px 3px 5px rgba(0, 0, 0, 0.15)' }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors"
            style={{ color }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            <EyeIcon show={showPassword} color={color} />
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
