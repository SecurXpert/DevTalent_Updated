import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type SuccessRateChartProps = {
  apiData?: any[];
};

const SuccessRateChart: React.FC<SuccessRateChartProps> = ({ apiData }) => {
  const { chartData, totals } = useMemo(() => {
    if (!apiData || apiData.length === 0) {
      return {
        chartData: [
          { name: "Pass", value: 0, label: "Pass: 0 (0%)" },
          { name: "Fail", value: 0, label: "Fail: 0 (0%)" },
        ],
        totals: { pass: 0, fail: 0, passPercent: 0, failPercent: 0 }
      };
    }
    
    const totalPassed = apiData.reduce((sum: number, item: any) => sum + (Number(item.total_exams_passed) || 0), 0);
    const totalAttempted = apiData.reduce((sum: number, item: any) => sum + (Number(item.total_exams_attempted) || 0), 0);
    const totalFailed = Math.max(0, totalAttempted - totalPassed);
    
    const passPercent = totalAttempted > 0 ? Math.round((totalPassed / totalAttempted) * 100) : 0;
    const failPercent = totalAttempted > 0 ? Math.round((totalFailed / totalAttempted) * 100) : 0;

    return {
      chartData: [
        { name: "Pass", value: totalPassed, label: `Pass: ${totalPassed} (${passPercent}%)` },
        { name: "Fail", value: totalFailed, label: `Fail: ${totalFailed} (${failPercent}%)` },
      ],
      totals: { pass: totalPassed, fail: totalFailed, passPercent, failPercent }
    };
  }, [apiData]);

  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] p-3 sm:p-4 md:p-5 shadow-sm">
      <h2 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[18px] font-semibold text-[#111827] text-[10px] mb-4">
        Student Success Rate
      </h2>

      <div className="w-full h-[240px] sm:h-[300px] md:h-[340px] lg:h-[360px] xl:h-[380px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={95}
              dataKey="value"
              stroke="white"
              strokeWidth={2}
            >
              <Cell fill="#10B981" />
              <Cell fill="#EF4444" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Left Label */}
        <div className="absolute left-0 sm:left-2 top-1/3 -translate-y-1/6 text-[#19B985] text-[8px] sm:text-[10px] md:text-[12px] font-medium">
          Pass: {totals.pass} ({totals.passPercent}%)
        </div>

        {/* Right Label */}
        <div className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/6 text-[#F44343] text-[8px] sm:text-[10px] md:text-[12px] font-medium">
          Fail: {totals.fail} ({totals.failPercent}%)
        </div>
      </div>
    </div>
  );
};

export default SuccessRateChart;
