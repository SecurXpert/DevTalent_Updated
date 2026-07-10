import React from "react";
import { Award, TrendingUp, Users } from "lucide-react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, SectionTitle } from "./SharedUI";

export function PerformanceOverview({ 
  performanceData, 
  children 
}: { 
  performanceData: any[];
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="mt-3 sm:mt-4 laptop:mt-5 grid grid-cols-2 gap-3 sm:gap-4 laptop:grid-cols-2 xl:grid-cols-4">
        <Card className="p-1 sm:p-2 laptop:p-3 xl:p-4">
          <div className="mb-1 sm:mb-2 laptop:mb-3 flex items-center justify-between">
            <div
              className="flex h-6 w-6 sm:h-8 sm:w-8 laptop:h-10 laptop:w-10 items-center justify-center rounded-lg sm:rounded-xl laptop:rounded-xl text-white shadow-md"
              style={{
                background: "linear-gradient(135deg, #00C950 0%, #009966 100%)",
              }}
            >
              <Award size={20} />
            </div>
            <span className="text-[10px] sm:text-[11px] laptop:text-[13px] font-semibold text-[#09a64b] flex items-center gap-1">
              <TrendingUp size={12} /> 2.3%
            </span>
          </div>
          <p className="font-Inter-regular text-[12px] sm:text-[10px] laptop:text-[14px] text-[12px]">
            Pass Rate
          </p>
          <h3 className="mt-1 text-[12px] sm:text-[14px] laptop:text-[10px] xl:text-[18px] font-bold text-[#172033]">
            87.5%
          </h3>
        </Card>

        <Card className="p-1 sm:p-2 laptop:p-3 xl:p-4">
          <div className="mb-1 sm:mb-2 laptop:mb-3 flex items-center justify-between">
            <div
              className="flex h-6 w-6 sm:h-8 sm:w-8 laptop:h-10 laptop:w-10 items-center justify-center rounded-lg sm:rounded-xl laptop:rounded-xl text-white shadow-md"
              style={{
                background: "linear-gradient(135deg, #615FFF 0%, #9810FA 100%)",
              }}
            >
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] sm:text-[11px] laptop:text-[13px] font-semibold text-[#4f46e5] flex items-center gap-1">
              <TrendingUp size={12} /> 1.8%
            </span>
          </div>
          <p className="  font-Inter-regular text-[12px] sm:text-[10px] laptop:text-[14px] text-[12px]">
            Avg. Score
          </p>
          <h3 className="mt-1 text-[12px] sm:text-[14px] laptop:text-[10px] xl:text-[18px] font-bold text-[#172033]">
            81.2%
          </h3>
        </Card>

        <Card className="p-1 sm:p-2 laptop:p-3 xl:p-4">
          <div className="mb-1 sm:mb-2 laptop:mb-3 flex items-center justify-between">
            <div
              className="flex h-6 w-6 sm:h-8 sm:w-8 laptop:h-10 laptop:w-10 items-center justify-center rounded-lg sm:rounded-xl laptop:rounded-xl text-white shadow-md"
              style={{
                background: "linear-gradient(135deg, #2B7FFF 0%, #0092B8 100%)",
              }}
            >
              <Users size={20} />
            </div>
            <span className="text-[10px] sm:text-[11px] laptop:text-[13px] font-semibold text-[#2563eb] flex items-center gap-1">
              <TrendingUp size={12} /> 3.1%
            </span>
          </div>
          <p className="font-Inter-regular text-[12px] sm:text-[10px] laptop:text-[14px] text-[12px]">
            Participation
          </p>
          <h3 className="mt-1 text-[12px] sm:text-[14px] laptop:text-[10px] xl:text-[18px] font-bold text-[#172033]">
            92.3%
          </h3>
        </Card>

        <Card className="p-1 sm:p-2 laptop:p-3 xl:p-4">
          <div className="mb-1 sm:mb-2 laptop:mb-3 flex items-center justify-between">
            <div
              className="flex h-6 w-6 sm:h-8 sm:w-8 laptop:h-10 laptop:w-10 items-center justify-center rounded-lg sm:rounded-xl laptop:rounded-xl text-white shadow-md"
              style={{
                background: "linear-gradient(135deg, #AD46FF 0%, #E60076 100%)",
              }}
            >
              <IoMdCheckmarkCircleOutline size={20} />
            </div>
            <span className="text-[10px] sm:text-[11px] laptop:text-[13px] font-semibold text-[#a21caf] flex items-center gap-1">
              <TrendingUp size={12} /> 0.9%
            </span>
          </div>
          <p className="font-Inter-regular text-[12px] sm:text-[10px] laptop:text-[14px] text-[12px]">
            Completion Rate
          </p>
          <h3 className="mt-1 text-[12px] sm:text-[14px] laptop:text-[10px] xl:text-[18px] font-bold text-[#172033]">
            94.8%
          </h3>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 laptop:grid-cols-2 xl:grid-cols-[2fr_1fr]">
        <Card className="p-2 sm:p-5 laptop:p-2 xl:p-6">
          <SectionTitle
            title="Student Registrations & Performance "
            subtitle="Monthly trends with pass rate overlay"
            action={
              <TrendingUp
                className="text-xl font-bold text-[#12b553]"
                size={20}
              />
            }
          />

          <div className="w-full h-[250px] sm:h-[300px] laptop:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px" }}
                />

                {/* Avg Score */}
                <Area
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="url(#colorScore)"
                  name="Avg Score"
                />

                {/* Pass Rate */}
                <Area
                  type="monotone"
                  dataKey="passRate"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorPass)"
                  name="Pass Rate"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 sm:mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-[14px] sm:text-[16px]">
            <div className="flex items-center gap-2 text-[#4f46e5]">
            </div>
            <div className="flex items-center gap-2 text-[#10b981]">
            </div>
          </div>
        </Card>

        {children}
      </div>
    </>
  );
}
