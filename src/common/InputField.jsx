import React, { useState } from 'react';
import { EyeIcon } from '../assets/icon.jsx';

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
            <EyeIcon show={showPassword} fill={color} />
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
