import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type CoursePerformanceChartProps = {
  apiData?: any[];
};

const CoursePerformanceChart: React.FC<CoursePerformanceChartProps> = ({ apiData }) => {
  const chartData = useMemo(() => {
    if (!apiData || apiData.length === 0) return [];
    
    const courseMap: Record<string, { totalScore: number; students: Set<number> }> = {};
    
    apiData.forEach((item: any) => {
       const courseName = item.course_name || `Course ${item.course_id}`;
       if (courseName) {
         if (!courseMap[courseName]) {
           courseMap[courseName] = { totalScore: 0, students: new Set() };
         }
         courseMap[courseName].totalScore += (Number(item.average_percentage) || 0);
         if (item.student_id) {
           courseMap[courseName].students.add(item.student_id);
         } else {
           courseMap[courseName].students.add(-Math.random());
         }
       }
    });

    const newChartData = Object.keys(courseMap).map(course => {
      const dataObj = courseMap[course];
      const numStudents = dataObj.students.size;
      return {
        course,
        avgScore: numStudents > 0 ? Number((dataObj.totalScore / numStudents).toFixed(1)) : 0,
        students: numStudents,
      };
    });
    
    newChartData.sort((a, b) => b.students - a.students);
    return newChartData;
  }, [apiData]);

  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] p-3 sm:p-4 md:p-5 shadow-sm mb-6">
      <h2 className="text-base sm:text-lg font-semibold text-[#111827] mb-5">
        Course-wise Performance
      </h2>

      <div className="w-full h-[360px] sm:h-[420px] md:h-[460px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
            barCategoryGap={16}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              dataKey="course"
              type="category"
              width={90}
              tick={{ fontSize: 11 }}
            />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="students"
              name="Students"
              fill="#4F46E5"
              radius={[0, 8, 8, 0]}
            />
            <Bar
              dataKey="avgScore"
              name="Avg Score"
              fill="#06B6D4"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CoursePerformanceChart;
