import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type MonthlyActivityChartProps = {
  apiData?: any[];
};

const MonthlyActivityChart: React.FC<MonthlyActivityChartProps> = ({ apiData }) => {
  const chartData = useMemo(() => {
    if (!apiData || apiData.length === 0) return [];
    
    const monthMap: Record<string, number> = {};
    
    apiData.forEach((item: any) => {
       const dateStr = item.updated_at || item.date || item.created_at;
       if (dateStr) {
         const date = new Date(dateStr);
         const month = date.toLocaleString('default', { month: 'short' }); 
         if (!monthMap[month]) {
           monthMap[month] = 0;
         }
         monthMap[month] += (Number(item.total_exams_attempted) || 0);
       }
    });

    const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return Object.keys(monthMap)
      .sort((a, b) => monthsOrder.indexOf(a) - monthsOrder.indexOf(b))
      .map(month => ({
        month,
        exams: monthMap[month]
      }));
  }, [apiData]);

  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] p-3 sm:p-4 md:p-5 shadow-sm">
      <h2 className="text-base sm:text-lg font-semibold text-[15px] mb-4">
        Monthly Exam Activity
      </h2>

      <div className="w-full h-[260px] sm:h-[320px] md:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="exams" fill="#6366F1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyActivityChart;
