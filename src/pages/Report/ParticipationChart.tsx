import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ParticipationChartProps = {
  apiData?: any[];
};

const ParticipationChart: React.FC<ParticipationChartProps> = ({ apiData }) => {
  const chartData = useMemo(() => {
    if (!apiData || apiData.length === 0) return [];
    
    const monthMap: Record<string, { attempted: number; mapped: number }> = {};
    
    apiData.forEach((item: any) => {
       const dateStr = item.updated_at || item.date || item.created_at;
       if (dateStr) {
         const date = new Date(dateStr);
         const month = date.toLocaleString('default', { month: 'short' }); 
         if (!monthMap[month]) {
           monthMap[month] = { attempted: 0, mapped: 0 };
         }
         monthMap[month].attempted += (Number(item.total_exams_attempted) || 0);
         monthMap[month].mapped += (Number(item.total_exams_mapped) || 0);
       }
    });

    const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return Object.keys(monthMap)
      .sort((a, b) => monthsOrder.indexOf(a) - monthsOrder.indexOf(b))
      .map(month => ({
        month,
        value: monthMap[month].mapped > 0 ? Number(((monthMap[month].attempted / monthMap[month].mapped) * 100).toFixed(1)) : 0
      }));
  }, [apiData]);

  return (
    <div className="bg-white rounded-2xl border border-grey-200 p-3 sm:p-4 md:p-5 shadow-sm">
      <h2 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[18px] font-semibold text-[#111827] mb-4">
        Exam Participation Rate
      </h2>

      <div className="w-full h-[260px] sm:h-[320px] md:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ParticipationChart;
