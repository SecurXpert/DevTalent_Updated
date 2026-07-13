import React from "react";
import { ChevronDown } from "lucide-react";
import { SelectFieldProps } from "../types";

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  error,
}) => {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-medium text-[#374151]">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-[48px] w-full appearance-none rounded-[14px] border bg-white px-4 pr-10 text-[14px] text-[#111827] outline-none ${
            error ? "border-red-400" : "border-[#d9dde5]"
          }`}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#111827]"
        />
      </div>
      {error ? <p className="mt-1 text-[12px] text-red-500">{error}</p> : null}
    </div>
  );
};

export default SelectField;
