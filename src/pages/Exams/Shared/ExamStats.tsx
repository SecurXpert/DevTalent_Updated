import React from "react";

interface ExamStatsProps {
  summary: {
    total: number;
    active: number;
    inactive: number;
    closed: number;
  };
}

const ExamStats: React.FC<ExamStatsProps> = ({ summary }) => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
      <div className="rounded-[12px] border border-[#e1e3ea] bg-white p-4">
        <p className="text-[15px] text-[#6b7280]">Total Exams</p>
        <h3 className="mt-2 text-[25px] font-semibold leading-none text-[#1f2937]">
          {summary.total}
        </h3>
      </div>
      <div className="rounded-[12px] border border-[#e1e3ea] bg-white p-4">
        <p className="text-[15px] text-[#6b7280]">Active Exams</p>
        <h3 className="mt-2 text-[25px] font-semibold leading-none text-[#16a34a]">
          {summary.active}
        </h3>
      </div>
      <div className="rounded-[12px] border border-[#e1e3ea] bg-white p-4">
        <p className="text-[15px] text-[#6b7280]">Inactive Exams</p>
        <h3 className="mt-2 text-[25px] font-semibold leading-none text-[#d97706]">
          {summary.inactive}
        </h3>
      </div>
      <div className="rounded-[12px] border border-[#e1e3ea] bg-white p-4">
        <p className="text-[15px] text-[#6b7280]">Closed Exams</p>
        <h3 className="mt-2 text-[25px] font-semibold leading-none text-[#4b5563]">
          {summary.closed}
        </h3>
      </div>
    </div>
  );
};

export default ExamStats;
