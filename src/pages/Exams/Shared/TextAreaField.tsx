import React from "react";
import { TextAreaFieldProps } from "../types";

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  rows = 4,
}) => {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-medium text-[#374151]">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-[14px] border bg-white px-4 py-3 text-[14px] text-[#111827] outline-none ${
          error ? "border-red-400" : "border-[#d9dde5]"
        }`}
      />
      {error ? <p className="mt-1 text-[12px] text-red-500">{error}</p> : null}
    </div>
  );
};

export default TextAreaField;
