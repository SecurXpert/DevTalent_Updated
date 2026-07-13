import React, { useState, useEffect, useMemo, useRef } from "react";
import { TrendingUp, Award, AlertCircle, Download } from "lucide-react";
import { FiBarChart2 } from "react-icons/fi";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ResultCharts from "./ResultCharts";
import ResultsFilterBar from "./ResultsFilterBar";
import ResultsTable from "./ResultsTable";
import { fetchExamResults } from "@/lib/api";
import { ResultData } from "@/data/resultsData";

const Result: React.FC = () => {
  const [results, setResults] = useState<ResultData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const pageRef = useRef<HTMLDivElement>(null);

  const handleExportReport = async () => {
    if (!pageRef.current) return;
    toast.info("Generating PDF report, please wait...");
    
    try {
      const canvas = await html2canvas(pageRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f3f4f6", // tailwind bg-gray-100
        logging: false
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      const pdf = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Results_Report.pdf");
      toast.success("Report exported successfully!");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to export report. Please try again.");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const rawData = await fetchExamResults(200);
        const list = Array.isArray(rawData)
          ? rawData
          : (rawData.results || rawData.data || rawData.items || []);

        const mappedResults: ResultData[] = list.map((item: any, idx: number) => {
          const scoreVal = item.score ?? item.marks_earned ?? 0;
          const totalVal = item.total ?? item.max_marks ?? 100;
          const percentVal = item.percentage ?? item.percent ?? (totalVal > 0 ? Math.round((scoreVal / totalVal) * 100) : 0);

          let statusVal: "Pass" | "Fail" = "Pass";
          if (item.status) {
            statusVal = (item.status.toLowerCase().startsWith("pass") || item.status.toLowerCase().startsWith("success")) ? "Pass" : "Fail";
          } else {
            statusVal = percentVal >= 60 ? "Pass" : "Fail";
          }

          let formattedTime = "N/A";
          if (item.submitted_at || item.created || item.time) {
            try {
              formattedTime = new Date(item.submitted_at || item.created || item.time).toLocaleString("en-US");
            } catch (e) {
              formattedTime = item.submitted_at || item.created || item.time;
            }
          }

          return {
            id: item.id ?? item.attempt_id ?? idx,
            course: item.course_name ?? item.course ?? item.college_name ?? "N/A",
            name: item.full_name ?? item.student_name ?? item.user_name ?? item.name ?? "Unknown",
            exam: item.exam_title ?? item.exam ?? item.title ?? "N/A",
            score: `${scoreVal}/${totalVal}`,
            percent: percentVal,
            status: statusVal,
            time: formattedTime,
            email: item.email_id ?? item.email ?? "",
            studentId: item.student_id ?? item.user_id ?? `STU-${String(item.id ?? idx).padStart(5, '0')}`,
            examType: item.exam_type ?? "N/A",
            duration: item.duration ?? "N/A",
            timeTaken: item.time_taken ?? "N/A",
            submission: item.submitted_at ?? "",
            totalScore: scoreVal,
            maxScore: totalVal,
            mcqScore: item.mcq_score ?? 0,
            mcqMaxScore: item.mcq_max_score ?? 0,
            codingScore: item.coding_score ?? 0,
            codingMaxScore: item.coding_max_score ?? 0,
            mcqCorrect: item.mcq_correct ?? 0,
            mcqTotal: item.mcq_total ?? 0,
            codingProblems: item.coding_problems ?? 0,
            codingTestCases: item.coding_test_cases ?? { passed: 0, total: 0 },
            problems: item.problems ?? [],
          };
        });
        setResults(mappedResults);
      } catch (e) {
        console.error("Failed to fetch exam results:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Compute list of unique courses for the dropdown
  const uniqueCourses = useMemo(() => {
    return Array.from(new Set(results.map((r) => r.course).filter(Boolean)));
  }, [results]);

  // Compute filtered results
  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.exam.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse =
        selectedCourse === "All Courses" || r.course === selectedCourse;
      const matchesStatus =
        selectedStatus === "All Status" || r.status === selectedStatus;
      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [results, searchQuery, selectedCourse, selectedStatus]);

  // Calculate dynamic stats from all results
  const totalResults = results.length;
  const passCount = results.filter((r) => r.status === "Pass").length;
  const passRate = totalResults > 0 ? Math.round((passCount / totalResults) * 100) : 0;
  const averageScore =
    totalResults > 0
      ? Math.round(results.reduce((sum, r) => sum + r.percent, 0) / totalResults)
      : 0;
  const failedCount = totalResults - passCount;

  const cardData = [
    {
      title: "Total Results",
      value: totalResults.toString(),
      subtitle: "All submissions",
      icon: <FiBarChart2 size={20} />,
      gradient: "linear-gradient(135deg, #615FFF 0%, #9810FA 100%)",
    },
    {
      title: "Pass Rate",
      value: `${passRate}%`,
      subtitle: `${passCount} students passed`,
      icon: <TrendingUp size={20} />,
      gradient: "linear-gradient(135deg, #00C950 0%, #009966 100%)",
    },
    {
      title: "Average Score",
      value: `${averageScore}%`,
      subtitle: "Overall performance",
      icon: <Award size={20} />,
      gradient: "linear-gradient(135deg, #2B7FFF 0%, #4F39F6 100%)",
    },
    {
      title: "Failed",
      value: failedCount.toString(),
      subtitle: "Require attention",
      icon: <AlertCircle size={20} />,
      gradient: "linear-gradient(135deg, #FB2C36 0%, #EC003F 100%)",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 font-semibold">Loading exam results...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen" ref={pageRef}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Results Management
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor and analyze exam performance across all students
          </p>
        </div>

        <button 
          onClick={handleExportReport}
          data-html2canvas-ignore="true"
          className="mt-4 md:mt-0 flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition"
        >
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cardData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
          >
            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <h2 className="text-2xl font-bold text-gray-800">{item.value}</h2>
              <p className="text-xs text-gray-400 mt-1">{item.subtitle}</p>
            </div>

            <div
              className="p-3 rounded-lg text-white"
              style={{ background: item.gradient }}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <ResultCharts results={filteredResults} />

      {/* Filter Bar */}
      <div data-html2canvas-ignore="true">
        <ResultsFilterBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        selectedCourse={selectedCourse}
        onCourseChange={setSelectedCourse}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
          courses={uniqueCourses}
        />
      </div>

      {/* Results Table */}
      <ResultsTable results={filteredResults} />
    </div>
  );
};

export default Result;
