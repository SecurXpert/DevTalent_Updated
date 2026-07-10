import React from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border-2 border-gray-200 bg-white  ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
      <div>
        <h2 className="text-[14px] sm:text-[15px] laptop:text-[17px] font-bold text-[#1c2434]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-[11px] sm:text-[12px] laptop:text-[12px] text-[#5d677a]">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function MiniProgress({
  label,
  students,
  percent,
  color,
  width,
}: {
  label: string;
  students: string;
  percent: string;
  color: string;
  width: string;
}) {
  return (
    <div className="mb-3 sm:mb-4 laptop:mb-5">
      <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
        <span className="text-[12px] sm:text-[14px] laptop:text-[16px] font-medium text-[10px]">
          {label}
        </span>
        <div className="text-right">
          <span className="mr-2 text-[11px] sm:text-[13px] laptop:text-[15px] text-[12px]">
            {students}
          </span>
          <span className="text-[12px] sm:text-[14px] laptop:text-[16px] font-semibold text-[#1c2434]">
            {percent}
          </span>
        </div>
      </div>
      <div className="h-2 sm:h-3 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
        <div className={`h-full rounded-full ${color} ${width}`}></div>
      </div>
    </div>
  );
}
