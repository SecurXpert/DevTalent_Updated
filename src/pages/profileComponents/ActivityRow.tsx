import { HiOutlineClock, HiOutlineGlobeAlt } from "react-icons/hi2";
import { ActivityRowProps } from "./types";

const ActivityRow = ({ icon, iconBg, title, time, ip }: ActivityRowProps) => {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-[#fbfbfd] p-3 xs:p-4">
      <div className="flex items-start gap-3 xs:gap-4">
        <div
          className={`flex h-8 w-8 xs:h-10 xs:w-10 items-center justify-center rounded-full flex-shrink-0 ${iconBg}`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[16px] xs:text-[18px] font-medium text-slate-800 break-words">
            {title}
          </p>

          <div className="mt-2 flex flex-col gap-2 text-slate-500 text-[11px] xs:text-[13px] sm:flex-row sm:items-center sm:gap-5">
            <div className="flex items-center gap-2">
              <HiOutlineClock className="text-[12px] xs:text-[14px] flex-shrink-0" />
              <span className="break-words">{time}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineGlobeAlt className="text-[12px] xs:text-[14px] flex-shrink-0" />
              <span className="break-words">IP: {ip}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityRow;
