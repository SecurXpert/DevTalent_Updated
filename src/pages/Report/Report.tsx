import React, { useMemo, useState, useEffect } from "react";
import ReportHeader from "./ReportHeader";
import ReportStats from "./ReportStats";
import ParticipationChart from "./ParticipationChart";
import SuccessRateChart from "./SuccessRateChart";
import PerformanceChart from "./PerformanceChart";
import MonthlyActivityChart from "./MonthlyActivityChart";
import CoursePerformanceChart from "./CoursePerformanceChart";
import DetailedStatsTable from "./DetailedStatsTable";
import DetailedStatsCards from "./DetailedStatsCards";
import { fetchCoursePerformance, fetchCoursePerformanceSummary } from "../../lib/api";

type CourseRow = {
  course: string;
  students: number;
  exams: number;
  avgScore: number;
  passRate: number;
};

const Report: React.FC = () => {
  const [search, setSearch] = useState("");
  const [minPassRate, setMinPassRate] = useState<string>("0");
  const [error, setError] = useState("");

  const [tableData, setTableData] = useState<CourseRow[]>([]);
  const [apiData, setApiData] = useState<any[]>([]);

  useEffect(() => {
    const loadReportData = async () => {
      try {
        const [performanceData, summaryData] = await Promise.all([
          fetchCoursePerformance({}),
          fetchCoursePerformanceSummary({}),
        ]);

        // Process performanceData for charts/ReportStats
        const perfArr = Array.isArray(performanceData)
          ? performanceData
          : (Array.isArray(performanceData?.items)
              ? performanceData.items
              : (Array.isArray(performanceData?.data)
                  ? performanceData.data
                  : []));
        setApiData(perfArr);

        // Process summaryData for table/DetailedStatsCards
        const summaryArr = Array.isArray(summaryData)
          ? summaryData
          : (Array.isArray(summaryData?.items)
              ? summaryData.items
              : (Array.isArray(summaryData?.data)
                  ? summaryData.data
                  : []));

        if (summaryArr && summaryArr.length > 0) {
          const newTableData = summaryArr.map((item: any) => ({
            course: item.course_name || `Course ${item.course_id}`,
            students: Number(item.total_students_count) || 0,
            exams: Number(item.exam_written_count) || 0,
            avgScore: Number(Number(item.average_overall_percentage ?? item.average_score ?? 0).toFixed(1)),
            passRate: Number(Number(item.pass_percentage || 0).toFixed(1)),
          }));

          setTableData(newTableData);
        }
      } catch (err) {
        console.error("Error fetching report data:", err);
      }
    };

    loadReportData();
  }, []);

  const filteredRows = useMemo(() => {
    const value = Number(minPassRate);
    if (isNaN(value) || value < 0 || value > 100) return tableData;

    return tableData.filter((row) => {
      const matchesSearch = row.course
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesPassRate = row.passRate >= value;
      return matchesSearch && matchesPassRate;
    });
  }, [search, minPassRate, tableData]);

  return (
    <div className="min-h-screen bg-[#f5f3ff] px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 md:py-5 lg:py-6">
      <div className="max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-[1400px] mx-auto">
        <ReportHeader />
        <ReportStats apiData={apiData} />

        {/* First Row Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-6">
          <ParticipationChart apiData={apiData} />
          <SuccessRateChart apiData={apiData} />
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-6">
          <PerformanceChart apiData={apiData} />
          <MonthlyActivityChart apiData={apiData} />
        </div>

        <CoursePerformanceChart apiData={apiData} />
        <DetailedStatsTable filteredRows={filteredRows} />
        <DetailedStatsCards filteredRows={filteredRows} />
      </div>
    </div>
  );
};

export default Report;
