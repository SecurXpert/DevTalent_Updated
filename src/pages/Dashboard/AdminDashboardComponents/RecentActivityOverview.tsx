import React from "react";
import { FileText, Users } from "lucide-react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Card, SectionTitle } from "./SharedUI";
import { Registration, ExamActivity } from "./types";

export function RecentActivityOverview({
  registrations,
  examActivity,
}: {
  registrations: Registration[];
  examActivity: ExamActivity[];
}) {
  const navigate = useNavigate();
  return (
    <div className="mt-6 mb-8 grid grid-cols-1 gap-4 laptop:grid-cols-1 xl:grid-cols-[1fr_2fr]">
      <Card className="p-3 sm:p-4 laptop:p-5 xl:p-6">
        <SectionTitle
          title="Recent Registrations"
          action={
            <button
              onClick={() => navigate('/students')}
              className="text-[14px] sm:text-[16px] font-medium text-[#4f46e5]"
            >
              View All
            </button>
          }
        />

        <div className="space-y-3 sm:space-y-4 laptop:space-y-6">
          {registrations.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-2 sm:gap-3"
            >
              <div className="flex items-center gap-2 sm:gap-3 laptop:gap-4">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 laptop:h-11 laptop:w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#9333ea] text-xs sm:text-sm font-semibold text-white shadow-md flex-shrink-0">
                  {item.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[12px] sm:text-[14px] laptop:text-[16px] font-semibold text-[#1c2434] break-words whitespace-normal">
                    {item.name}
                  </h4>
                  <p className="text-[11px] sm:text-[13px] laptop:text-[15px] text-[#6b7280] break-words whitespace-normal mt-0.5">
                    {item.course}
                  </p>
                </div>
              </div>
              <span className="text-[11px] sm:text-[13px] laptop:text-[15px] text-[#9ca3af] flex-shrink-0">
                {item.date}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-3 sm:p-4 laptop:p-5 xl:p-6">
        <SectionTitle
          title="Recent Exam Activity"
          action={
            <button
              onClick={() => navigate('/results')}
              className="text-[14px] sm:text-[16px]  font-medium text-[#4f46e5]"
            >
              View All
            </button>
          }
        />

        <div className="space-y-3 sm:space-y-4 laptop:space-y-5">
          {examActivity.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-3 sm:gap-4 rounded-[12px] sm:rounded-[18px] border border-[#e9ddfb] p-3 sm:p-4 laptop:p-5"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 laptop:h-14 laptop:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#a21caf] text-white shadow-md flex-shrink-0">
                  <FileText size={18} className="sm:size-15 laptop:size-26" />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-[13px] sm:text-[15px] laptop:text-[17px] font-semibold text-[#1c2434] break-words whitespace-normal">
                    {item.title}
                  </h4>
                  <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-[12px] sm:text-[13px] laptop:text-[15px] text-[#5d677a]">
                    <span className="flex items-center gap-1">
                      <Users size={12} className="sm:size-5 laptop:size-5" />
                      {item.enrolled} enrolled
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <IoMdCheckmarkCircleOutline
                        size={12}
                        className="sm:size-5 laptop:size-5"
                      />
                      {item.completed} completed
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] sm:text-[11px] laptop:text-[13px] font-medium text-[#6b7280]">
                  Avg. Score
                </span>
                <span className="text-[14px] sm:text-[16px] laptop:text-[18px] font-bold text-[#10b981]">
                  {item.avg}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
