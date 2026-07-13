import React from "react";

type CourseRow = {
  course: string;
  students: number;
  exams: number;
  avgScore: number;
  passRate: number;
};

type DetailedStatsTableProps = {
  filteredRows: CourseRow[];
};

const DetailedStatsTable: React.FC<DetailedStatsTableProps> = ({ filteredRows }) => {
  return (
    <div className="hidden md:block bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
      <div className="px-3 sm:px-5 md:px-7 py-3 sm:py-4 md:py-5 border-b border-[#e5e7eb]">
        <h2 className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-semibold text-[#111827]">
          Detailed Statistics
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] sm:min-w-[700px] md:min-w-[800px] lg:min-w-[900px]">
          <thead className="bg-[#f8fafc]">
            <tr>
              <th className="text-left px-7 py-4 text-[#6b7280] text-sm font-semibold">
                COURSE
              </th>
              <th className="text-left px-7 py-4 text-[#6b7280] text-sm font-semibold">
                TOTAL STUDENTS
              </th>
              <th className="text-left px-7 py-4 text-[#6b7280] text-sm font-semibold">
                EXAMS CONDUCTED
              </th>
              <th className="text-left px-7 py-4 text-[#6b7280] text-sm font-semibold">
                AVG. SCORE
              </th>
              <th className="text-left px-7 py-4 text-[#6b7280] text-sm font-semibold">
                PASS RATE
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row, index) => (
                <tr
                  key={index}
                  className="border-t border-[#eef2f7] hover:bg-[#fafafa] transition"
                >
                  <td className="px-2 sm:px-3 md:px-4 lg:px-5 py-1 sm:py-2 md:py-3 text-[9px] sm:text-[10px] md:text-[11px] lg:text-[12px] text-[#1f2937] font-semibold">
                    {row.course}
                  </td>
                  <td className="px-3 py-2 text-[11px] sm:text-[12px] text-[#374151]">
                    {row.students}
                  </td>
                  <td className="px-3 py-2 text-[11px] sm:text-[12px] text-[#374151]">
                    {row.exams}
                  </td>
                  <td className="px-3 py-2 text-[11px] sm:text-[12px] text-[#374151]">
                    {row.avgScore}%
                  </td>
                  <td className="px-3 py-2">
                    <span className="bg-[#DCFCE7] text-[#16A34A] px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-semibold">
                      {row.passRate}%
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-2 sm:px-3 md:px-4 lg:px-5 py-2 sm:py-3 md:py-4 text-center text-[#6b7280] text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-medium"
                >
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailedStatsTable;
