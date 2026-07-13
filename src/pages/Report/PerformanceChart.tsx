import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type PerformanceChartProps = {
  apiData?: any[];
};

const PerformanceChart: React.FC<PerformanceChartProps> = ({ apiData }) => {
  const chartData = useMemo(() => {
    if (!apiData || apiData.length === 0) return [];
    
    const monthMap: Record<string, { totalScore: number; count: number; passed: number; attempted: number }> = {};
    
    apiData.forEach((item: any) => {
       const dateStr = item.updated_at || item.date || item.created_at;
       if (dateStr) {
         const date = new Date(dateStr);
         const month = date.toLocaleString('default', { month: 'short' }); 
         if (!monthMap[month]) {
           monthMap[month] = { totalScore: 0, count: 0, passed: 0, attempted: 0 };
         }
         monthMap[month].totalScore += (Number(item.average_percentage) || 0);
         monthMap[month].count += 1;
         monthMap[month].passed += (Number(item.total_exams_passed) || 0);
         monthMap[month].attempted += (Number(item.total_exams_attempted) || 0);
       }
    });

    const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return Object.keys(monthMap)
      .sort((a, b) => monthsOrder.indexOf(a) - monthsOrder.indexOf(b))
      .map(month => {
        const monthData = monthMap[month];
        return {
          month,
          avgScore: monthData.count > 0 ? Number((monthData.totalScore / monthData.count).toFixed(1)) : 0,
          passRate: monthData.attempted > 0 ? Number(((monthData.passed / monthData.attempted) * 100).toFixed(1)) : 0
        };
      });
  }, [apiData]);

  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] p-3 sm:p-4 md:p-5 shadow-sm">
      <h2 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[18px] font-semibold text-[#111827] mb-4">
        Average Exam Performance
      </h2>

      <div className="w-full h-[260px] sm:h-[320px] md:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="avgScore"
              name="Avg Score"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="passRate"
              name="Pass Rate"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
