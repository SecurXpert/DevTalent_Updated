import React from "react";

type PerformanceItem = {
  label: string;
  range: string;
  students: number;
  percentage: number;
  color: string;
};

const data: PerformanceItem[] = [
  {
    label: "Excellent",
    range: "90-100%",
    students: 156,
    percentage: 18,
    color: "bg-green-500",
  },
  {
    label: "Good",
    range: "80-89%",
    students: 342,
    percentage: 40,
    color: "bg-blue-500",
  },
  {
    label: "Average",
    range: "70-79%",
    students: 268,
    percentage: 31,
    color: "bg-yellow-500",
  },
  {
    label: "Below Average",
    range: "<70%",
    students: 95,
    percentage: 11,
    color: "bg-red-500",
  },
];

const PerformanceDistribution: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800">
        Performance Distribution
      </h2>
      <p className="text-gray-500 mt-1">Students by performance level</p>

      {/* Items */}
      <div className="mt-6 space-y-6">
        {data.map((item, index) => (
          <div key={index}>
            {/* Top row */}
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-700 font-medium">
                {item.label} ({item.range})
              </p>

              <p className="text-gray-600">
                {item.students} students{" "}
                <span className="font-semibold text-gray-800 ml-1">
                  {item.percentage}%
                </span>
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceDistribution;
