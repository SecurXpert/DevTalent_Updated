import { HiOutlineBell } from "react-icons/hi2";
import { NotificationRowProps } from "./types";

const NotificationRow = ({
  title,
  subtitle,
  checked,
  onToggle,
}: NotificationRowProps) => {
  return (
    <div className="flex items-center justify-between gap-3 xs:gap-4 rounded-2xl border border-[#e5e7eb] bg-[#fbfbfd] p-3 xs:p-4">
      <div className="flex items-start gap-3 xs:gap-4 min-w-0 flex-1">
        <HiOutlineBell className="text-slate-400 text-[16px] xs:text-[18px] mt-1 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-[16px] xs:text-[18px] font-medium text-slate-800 break-words">
            {title}
          </p>
          <p className="text-slate-500 text-[11px] xs:text-[13px] mt-1 break-words">
            {subtitle}
          </p>
        </div>
      </div>

      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 xs:h-7 xs:w-13 shrink-0 items-center rounded-full transition ${
          checked ? "bg-[#4f46e5]" : "bg-[#d1d5db]"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 xs:h-5 xs:w-5 transform rounded-full bg-white shadow transition ${
            checked ? "translate-x-5 xs:translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default NotificationRow;
