import { SessionCardProps } from "./types";

const SessionCard = ({
  icon,
  iconBg,
  device,
  location,
  time,
  badgeText,
  badgeClass,
}: SessionCardProps) => {
  return (
    <div className="flex flex-col gap-3 xs:gap-4 rounded-2xl border border-[#e5e7eb] bg-[#fbfbfd] p-3 xs:p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3 xs:gap-4">
        <div
          className={`flex h-8 w-8 xs:h-10 xs:w-10 items-center justify-center rounded-xl flex-shrink-0 ${iconBg}`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] xs:text-[16px] font-medium text-slate-800 break-words">
            {device}
          </p>
          <p className="text-slate-500 text-[11px] xs:text-[13px] mt-1">
            {location} • {time}
          </p>
        </div>
      </div>

      <div
        className={`text-[10px] xs:text-xs font-medium ${badgeClass} rounded-full px-2 xs:px-3 py-1 self-start sm:self-auto whitespace-nowrap`}
      >
        {badgeText}
      </div>
    </div>
  );
};

export default SessionCard;
