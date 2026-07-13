import React from "react";
import { InputFieldProps } from "../types";

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  icon,
}) => {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-medium text-[#374151]">
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-[48px] w-full rounded-[14px] border bg-white px-4 text-[14px] text-[#111827] outline-none ${
          error ? "border-red-400" : "border-[#d9dde5]"
        }`}
      />
      {error ? <p className="mt-1 text-[12px] text-red-500">{error}</p> : null}
    </div>
  );
};

export default InputField;
