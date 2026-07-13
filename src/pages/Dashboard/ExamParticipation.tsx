import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ✅ Data with validation
const rawData = [
  { month: "Sep", exams: 40, participants: 1100 },
  { month: "Oct", exams: 55, participants: 1400 },
  { month: "Nov", exams: 50, participants: 1350 },
  { month: "Dec", exams: 45, participants: 1000 },
  { month: "Jan", exams: 60, participants: 1500 },
  { month: "Feb", exams: 70, participants: 1700 },
  { month: "Mar", exams: 65, participants: 1450 },
];

// ✅ Validation function
const validateData = (data: typeof rawData) => {
  return data.map((item) => ({
    month: item.month || "N/A",
    exams: item.exams >= 0 ? item.exams : 0,
    participants: item.participants >= 0 ? item.participants : 0,
  }));
};

const data = validateData(rawData);

const ExamParticipation = () => {
  return (
    <div className="rounded-2xl bg-white shadow-sm-2 p-4 sm:p-5 laptop:p-4 xl:p-4">
      {/* Card */}
      <div className="">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 ">
            Exam Participation
          </h2>
          <p className="text-sm text-gray-500">Monthly exam statistics</p>
        </div>

        {/* Chart */}
        <div className="w-full h-[250px] sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={8}>
              <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: "14px",
                  paddingTop: "10px",
                }}
              />

              {/* Exams */}
              <Bar
                dataKey="exams"
                fill="#4F46E5"
                radius={[6, 6, 0, 0]}
                barSize={20}
              />

              {/* Participants */}
              <Bar
                dataKey="participants"
                fill="#06B6D4"
                radius={[6, 6, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExamParticipation;
