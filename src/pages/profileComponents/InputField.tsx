import { InputFieldProps } from "./types";

const InputField = ({
  label,
  value,
  placeholder,
  icon,
  readOnly,
  onChange,
}: InputFieldProps) => {
  return (
    <div className="w-full">
      <label className="mb-2 block text-[12px] xs:text-[13px] font-medium text-slate-700">
        {label}
      </label>
      <div
        className={`flex h-[44px] xs:h-[48px] items-center gap-2 xs:gap-3 rounded-xl border border-[#d6d9e0] bg-[#fbfbfd] px-3 xs:px-4 ${readOnly ? "opacity-75" : ""}`}
      >
        {icon && (
          <span className="text-slate-400 text-[14px] xs:text-[16px] flex-shrink-0">
            {icon}
          </span>
        )}
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          readOnly={readOnly}
          className="w-full bg-transparent text-[12px] xs:text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  );
};

export default InputField;
