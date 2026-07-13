import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/pages/Services/api/api";

import { ResultsHeader } from "./ResultsComponents/ResultsHeader";
import { SummaryCards } from "./ResultsComponents/SummaryCards";
import { ResultsFilter } from "./ResultsComponents/ResultsFilter";
import { ResultGridItem } from "./ResultsComponents/ResultGridItem";
import { PerformanceInsights } from "./ResultsComponents/PerformanceInsights";

const Results = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [coursePerformanceData, setCoursePerformanceData] = useState<any[]>([]);
  const [recentActivityData, setRecentActivityData] = useState<any[]>([]);
  const [resultsData, setResultsData] = useState<any[]>([]);

  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortOrder, setSortOrder] = useState("Latest");

  const [summary, setSummary] = useState({
    totalExams: 0,
    passedExams: 0,
    failedExams: 0,
    averageScore: 0,
  });

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const token =
          localStorage.getItem("access_token") ||
          localStorage.getItem("userToken");

        // 1. Fetch user's subscriptions to get their courses
        const subResponse = await fetch(
          `${API_BASE_URL}/student/subscription/current`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        let courseIds: number[] = [];
        let courseMap = new Map<number, string>();

        if (subResponse.ok) {
          const subData = await subResponse.json();
          let subs = [];
          if (Array.isArray(subData)) {
            subs = subData;
          } else if (subData && Array.isArray(subData.items)) {
            subs = subData.items;
          } else if (subData && Array.isArray(subData.data)) {
            subs = subData.data;
          } else if (subData) {
            subs = [subData];
          }
          const activeSubs = subs.filter(
            (s: any) => s.status === "active" || s.status === "Success"
          );

          activeSubs.forEach((sub: any) => {
            if (sub.selected_courses && Array.isArray(sub.selected_courses)) {
              sub.selected_courses.forEach((c: any) => {
                const cId = c.course_id || c.id || c;
                if (cId && !courseIds.includes(cId)) {
                  courseIds.push(cId);
                  courseMap.set(cId, c.course_name || `Course ${cId}`);
                }
              });
            }
          });
        }

        // 2. Fetch catalog to ensure we have course names if they weren't in the subscription
        if (courseIds.length > 0) {
          const coursesResponse = await fetch(
            `${API_BASE_URL}/admin/catalog/courses`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (coursesResponse.ok) {
            const coursesData = await coursesResponse.json();
            const list = Array.isArray(coursesData)
              ? coursesData
              : coursesData.data || coursesData.items || [];
            list.forEach((c: any) => {
              if (courseMap.has(c.id)) {
                courseMap.set(c.id, c.name);
              }
            });
          }
        }

        // 3. Fetch performance and exams for each course
        let totalAttempted = 0;
        let totalPassed = 0;
        let totalAvg = 0;
        let performanceList = [];
        let allExamsList: any[] = [];

        for (const cId of courseIds) {
          const perfResponse = await fetch(
            `${API_BASE_URL}/student/scorecard/courses/${cId}/performance`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (perfResponse.ok) {
            const perfData = await perfResponse.json();

            totalAttempted += perfData.total_exams_attempted || 0;
            totalPassed += perfData.total_exams_passed || 0;
            totalAvg += perfData.average_percentage || 0;

            performanceList.push({
              name: courseMap.get(cId) || `Course ${cId}`,
              score: perfData.average_percentage || 0,
              ...perfData,
            });
          }

          const examsResponse = await fetch(
            `${API_BASE_URL}/student/scorecard/courses/${cId}/exams`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (examsResponse.ok) {
            const examsData = await examsResponse.json();
            const exams = Array.isArray(examsData) ? examsData : [];

            exams.forEach((exam: any) => {
              const createdDate = exam.created_at
                ? new Date(exam.created_at)
                : new Date();
              allExamsList.push({
                id: exam.id || Math.random(),
                courseName: courseMap.get(cId) || `Course ${cId}`,
                type: exam.exam_kind || "MCQ",
                title: exam.title || `Exam ${exam.exam_id || exam.id || ""}`,
                status: exam.is_passed ? "Passed" : "Failed",
                marksEarned: exam.obtained_score || 0,
                totalMarks: exam.total_score || 0,
                score: exam.percentage || 0,
                stats: {
                  total: exam.total_questions || 0,
                  attempted: exam.attempted_questions || 0,
                  correct: exam.correct_count || 0,
                  wrong: Math.max(
                    0,
                    (exam.attempted_questions || 0) - (exam.correct_count || 0)
                  ),
                },
                date: createdDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                time: createdDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                createdAt: createdDate.getTime(),
                raw: exam,
                courseId: cId,
              });
            });
          }
        }

        setCoursePerformanceData(performanceList);

        allExamsList.sort((a, b) => b.createdAt - a.createdAt);
        setResultsData(allExamsList);

        const recentExams = [...allExamsList]
          .sort((a, b) => a.createdAt - b.createdAt)
          .slice(-7);
        setRecentActivityData(
          recentExams.map((ex, i) => ({
            name: `Exam ${i + 1}`,
            score: ex.score,
          }))
        );

        let failed = totalAttempted - totalPassed;
        if (failed < 0) failed = 0;

        setSummary({
          totalExams: totalAttempted,
          passedExams: totalPassed,
          failedExams: failed,
          averageScore:
            performanceList.length > 0
              ? Math.round(totalAvg / performanceList.length)
              : 0,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching performance", err);
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  const filteredAndSortedResults = resultsData
    .filter((result) => {
      // 1. Search text
      if (
        searchTerm &&
        !result.courseName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !result.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      // 2. Course
      if (courseFilter !== "All Courses" && result.courseName !== courseFilter)
        return false;
      // 3. Type
      if (typeFilter !== "All Types") {
        const t = typeFilter.toLowerCase();
        if (t === "mcq" && result.type?.toLowerCase() !== "mcq") return false;
        if (t === "coding" && result.type?.toLowerCase() !== "coding")
          return false;
      }
      // 4. Status
      if (statusFilter !== "All Status" && result.status !== statusFilter)
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "Latest") return b.createdAt - a.createdAt;
      return a.createdAt - b.createdAt;
    });

  const uniqueCourses = Array.from(
    new Set(resultsData.map((r) => r.courseName))
  ).filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <ResultsHeader navigate={navigate} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-10 py-8">
        <SummaryCards summary={summary} />

        <ResultsFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          courseFilter={courseFilter}
          setCourseFilter={setCourseFilter}
          uniqueCourses={uniqueCourses}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        <div className="text-sm text-gray-500 mb-4">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredAndSortedResults.length}
          </span>{" "}
          results
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedResults.map((result) => (
            <ResultGridItem
              key={result.id}
              result={result}
              navigate={navigate}
            />
          ))}
        </div>

        <PerformanceInsights
          summary={summary}
          coursePerformanceData={coursePerformanceData}
          recentActivityData={recentActivityData}
        />
      </main>
    </div>
  );
};

export default Results;
