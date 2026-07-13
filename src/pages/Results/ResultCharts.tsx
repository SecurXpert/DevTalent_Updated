import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { ResultData } from "../../data/resultsData";

interface ResultChartsProps {
  results: ResultData[];
}

const COLORS = ["#10B981", "#EF4444"];

function ResultCharts({ results }: ResultChartsProps) {
  const total = results.length;
  
  // Calculate pass/fail counts
  const passCount = results.filter((r) => r.status === "Pass").length;
  const failCount = total - passCount;
  
  const passPercent = total > 0 ? Math.round((passCount / total) * 100) : 0;
  const failPercent = total > 0 ? 100 - passPercent : 0;

  const pieData = [
    { name: "Pass", value: passCount },
    { name: "Fail", value: failCount },
  ];

  // Calculate grade distribution counts
  const g90_100 = results.filter((r) => r.percent >= 90).length;
  const g80_89 = results.filter((r) => r.percent >= 80 && r.percent < 90).length;
  const g70_79 = results.filter((r) => r.percent >= 70 && r.percent < 80).length;
  const g60_69 = results.filter((r) => r.percent >= 60 && r.percent < 70).length;
  const gBelow60 = results.filter((r) => r.percent < 60).length;

  const barData = [
    { name: "90-100", value: g90_100 },
    { name: "80-89", value: g80_89 },
    { name: "70-79", value: g70_79 },
    { name: "60-69", value: g60_69 },
    { name: "Below 60", value: gBelow60 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Grade Distribution */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-gray-700 font-semibold mb-4">Grade Distribution</h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                <Cell fill="#10B981" />
                <Cell fill="#3B82F6" />
                <Cell fill="#8B5CF6" />
                <Cell fill="#E5E7EB" />
                <Cell fill="#EF4444" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pass/Fail Ratio */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Pass/Fail Ratio
        </h2>

        <div className="flex items-center justify-center relative h-64">
          <PieChart width={260} height={260}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>

          {/* Labels positioned like UI */}
          <div className="absolute top-6 left-10 text-green-600 text-sm font-medium">
            Pass: {passPercent}%
          </div>
          <div className="absolute bottom-6 right-10 text-red-500 text-sm font-medium">
            Fail: {failPercent}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultCharts;
