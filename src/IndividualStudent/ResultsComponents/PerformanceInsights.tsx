import React from "react";
import { TrendingUp, Target, Award, LineChart as LineChartIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";

interface Summary {
  totalExams: number;
  passedExams: number;
  failedExams: number;
  averageScore: number;
}

interface PerformanceInsightsProps {
  summary: Summary;
  coursePerformanceData: any[];
  recentActivityData: any[];
}

export const PerformanceInsights: React.FC<PerformanceInsightsProps> = ({
  summary,
  coursePerformanceData,
  recentActivityData,
}) => {
  return (
    <>
      <div className="mb-6 flex items-center gap-3 mt-12">
        <div className="w-10 h-10 rounded-full bg-[#523de1] flex items-center justify-center shadow-md shadow-blue-200">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            Performance Insights
          </h2>
          <p className="text-sm text-gray-500">
            Your learning analytics at a glance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pass Rate Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border hover:border-purple-500 transition-all duration-300 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="text-purple-600">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-gray-700">Pass Rate</h3>
          </div>

          <div className="flex items-center justify-center gap-8 mb-6 flex-1">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 transform -rotate-90">
                <defs>
                  <linearGradient
                    id="passGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <circle
                  cx="56"
                  cy="56"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-gray-50"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="44"
                  stroke="url(#passGradient)"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="276"
                  strokeDashoffset={
                    276 -
                    (276 *
                      (summary.totalExams > 0
                        ? Math.round(
                            (summary.passedExams / summary.totalExams) * 100
                          )
                        : 0)) /
                      100
                  }
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#523de1] mb-1">
                {summary.totalExams > 0
                  ? Math.round((summary.passedExams / summary.totalExams) * 100)
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-500">Pass Rate</div>
              <div className="text-xs text-gray-400">
                {summary.passedExams} of {summary.totalExams} exams
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
            <span className="text-sm text-gray-500">Avg Score</span>
            <span className="font-bold text-gray-900">
              {summary.averageScore}%
            </span>
          </div>
        </div>

        {/* Course Performance Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border hover:border-purple-500 transition-all duration-300 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="text-purple-600">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-gray-700">Course Performance</h3>
          </div>
          <div className="flex-1 w-full min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={coursePerformanceData}
                layout="vertical"
                margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={true}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  domain={[0, 100]}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={true}
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  width={110}
                />
                <Tooltip
                  cursor={{ fill: "#f9fafb" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
                  {coursePerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="url(#barGradient)" />
                  ))}
                </Bar>
                <defs>
                  <linearGradient
                    id="barGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border hover:border-purple-500 transition-all duration-300 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="text-purple-600">
              <LineChartIcon className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-gray-700">Recent Activity</h3>
          </div>
          <div className="flex-1 w-full min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={recentActivityData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={true}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickMargin={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={true}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    strokeWidth: 2,
                    fill: "#fff",
                    stroke: "#6366f1",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#6366f1",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};
