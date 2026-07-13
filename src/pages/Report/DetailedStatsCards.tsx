import React from "react";

type CourseRow = {
  course: string;
  students: number;
  exams: number;
  avgScore: number;
  passRate: number;
};

type DetailedStatsCardsProps = {
  filteredRows: CourseRow[];
};

const DetailedStatsCards: React.FC<DetailedStatsCardsProps> = ({ filteredRows }) => {
  return (
    <div className="md:hidden space-y-4">
      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-3 sm:p-4 md:p-5">
        <h2 className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-semibold text-[#111827 mb-3 sm:mb-4">
          Detailed Statistics
        </h2>
        {filteredRows.length > 0 ? (
          <div className="space-y-4">
            {filteredRows.map((row, index) => (
              <div
                key={index}
                className="border border-[#e5e7eb] rounded-2xl p-3 sm:p-4 md:p-5 bg-[#fafafa]"
              >
                <h3 className="font-semibold text-[#111827] text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] mb-2 sm:mb-3">
                  {row.course}
                </h3>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div>
                    <p className="text-[10px] sm:text-[12px] text-[#6b7280]">
                      Students
                    </p>
                    <p className="font-medium text-[#111827] text-[10px] sm:text-[12px]">
                      {row.students}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] sm:text-[12px] text-[#6b7280]">
                      Exams
                    </p>
                    <p className="font-medium text-[#111827] text-[10px] sm:text-[12px]">
                      {row.exams}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] sm:text-[12px] text-[#6b7280]">
                      Avg Score
                    </p>
                    <p className="font-medium text-[#111827] text-[10px] sm:text-[12px]">
                      {row.avgScore}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] sm:text-[12px] text-[#6b7280]">
                      Pass Rate
                    </p>
                    <span className="inline-block bg-[#DCFCE7] text-[#16A34A] px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-semibold mt-1">
                      {row.passRate}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[#6b7280] py-4 sm:py-6 md:py-8 text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px]">
            No matching records found.
          </p>
        )}
      </div>
    </div>
  );
};

export default DetailedStatsCards;
