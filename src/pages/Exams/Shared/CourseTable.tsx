import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  FileText,
  Users,
  Eye,
  Trash2,
  Clock3,
  Calendar,
} from "lucide-react";
import { FaRegEdit } from "react-icons/fa";
import { CourseItem, ExamItem } from "../types";
import { statusBadge } from "../utils";
import { API_BASE_URL } from "@/pages/Services/api/api";

interface CourseTableProps {
  filteredCourses: CourseItem[];
  expandedCourseId: number | null;
  toggleCourse: (id: number) => void;
  viewExam: (exam: ExamItem) => void;
  editExam: (exam: ExamItem) => void;
  deleteExam: (examId: number) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({
  filteredCourses,
  expandedCourseId,
  toggleCourse,
  viewExam,
  editExam,
  deleteExam,
}) => {
  const [fetchedExams, setFetchedExams] = useState<Record<number, ExamItem[]>>({});
  const [loadingExams, setLoadingExams] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (expandedCourseId !== null && !fetchedExams[expandedCourseId] && !loadingExams[expandedCourseId]) {
      const fetchExamsForCourse = async () => {
        setLoadingExams((prev) => ({ ...prev, [expandedCourseId]: true }));
        try {
          const adminToken = localStorage.getItem("adminToken");
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "accept": "application/json",
          };
          if (adminToken) {
            headers["Authorization"] = `Bearer ${adminToken}`;
          }

          const [mcqRes, codingRes] = await Promise.all([
            fetch(`${API_BASE_URL}/ind/mcq/admin/courses/${expandedCourseId}/mapped-exams`, { headers }),
            fetch(`${API_BASE_URL}/ind/coding/admin/courses/${expandedCourseId}/mapped-coding-exams`, { headers })
          ]);

          let items: any[] = [];
          if (mcqRes.ok) {
            const data = await mcqRes.json();
            items = [...items, ...(data.items || [])];
          }
          if (codingRes.ok) {
            const data = await codingRes.json();
            // Handle both {items: [...]} or direct [...] response formats
            const codingItems = Array.isArray(data) ? data : (data.items || []);
            items = [...items, ...codingItems];
          }

          if (mcqRes.ok || codingRes.ok) {
            const mappedExams: ExamItem[] = items.map((item: any) => {
              const exam = item.exam || item;
              return {
                id: exam.id,
                title: exam.title || "Untitled Exam",
                type: item.exam_kind === "mcq" ? "MCQ Only" : item.exam_kind === "coding" ? "Coding Only" : (exam.type || (item.exam ? "MCQ Only" : "Coding Only")),
                questions: exam.question_count || 0,
                duration: `${exam.duration_minutes || 60} min`,
                enrolled: exam.enrolled_students || 0,
                date: exam.created_at ? exam.created_at.split("T")[0] : "2026-01-01",
                status: exam.is_active ? "Active" : "Draft",
                description: exam.description || "",
                totalMarks: exam.total_marks || 100,
                passingScore: exam.pass_percentage || 60,
              };
            });
            setFetchedExams((prev) => ({ ...prev, [expandedCourseId]: mappedExams }));
          } else {
            const courseObj = filteredCourses.find(c => c.id === expandedCourseId);
            if (courseObj) {
              setFetchedExams((prev) => ({ ...prev, [expandedCourseId]: courseObj.exams }));
            }
          }
        } catch (error) {
          console.error(`Error fetching exams for course ${expandedCourseId}:`, error);
          const courseObj = filteredCourses.find(c => c.id === expandedCourseId);
          if (courseObj) {
            setFetchedExams((prev) => ({ ...prev, [expandedCourseId]: courseObj.exams }));
          }
        } finally {
          setLoadingExams((prev) => ({ ...prev, [expandedCourseId]: false }));
        }
      };

      fetchExamsForCourse();
    }
  }, [expandedCourseId, filteredCourses]);

  return (
    <div className="mt-6 overflow-hidden rounded-[14px] border border-[#e1e3ea] bg-white">
      {/* Desktop Table Header */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-2 border-b border-[#e5e7eb] bg-[#f7f7fb] px-4 py-3 text-[12px] font-semibold text-[#374151]">
        <div className="col-span-2">Course Name</div>
        <div>Total Exams</div>
        <div>Active Exams</div>
        <div className="grid grid-cols-2">
          <span>Total Students</span>
          <span className="text-center">Actions</span>
        </div>
      </div>

      {/* Laptop/Tablet Table Header */}
      <div className="hidden md:grid lg:hidden md:grid-cols-3 gap-2 border-b border-[#e5e7eb] bg-[#f7f7fb] px-4 py-3 text-[12px] font-Inter-semibold text-[14px]">
        <div className="col-span-2">Course Name</div>
        <div className="grid grid-cols-2">
          <span>Exams</span>
          <span className="text-center">Actions</span>
        </div>
      </div>

      {/* Mobile Header - Card Style */}
      <div className="md:hidden border-b border-[#e5e7eb] bg-[#f7f7fb] px-4 py-3">
        <h2 className="text-[14px] font-semibold text-[#374151]">
          Courses & Exams
        </h2>
      </div>

      {filteredCourses.map((course) => {
        const isExpanded = expandedCourseId === course.id;

        return (
          <div
            key={course.id}
            className="border-b border-[#eceef3] last:border-b-0"
          >

            <div className="hidden lg:grid lg:grid-cols-5 items-center gap-2 px-4 py-4 text-[14px]">
              <div className="col-span-2 flex items-center gap-3">
                <button
                  onClick={() => toggleCourse(course.id)}
                  className="text-[#6b7280]"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"
                      }`}
                  />
                </button>

                <div
                  className="flex h-8 w-8 items-center justify-center rounded-[8px] text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #615FFF 0%, #9810FA 100%)",
                  }}
                >
                  <FileText size={15} />
                </div>

                <div>
                  <p className="font-semibold text-[#1f2937]">{course.name}</p>
                  <p className="text-[13px] text-[#6b7280]">
                    {course.availableExams} exams available
                  </p>
                </div>
              </div>

              <div className="font-medium text-[#1f2937]">
                {course.totalExams}
              </div>

              <div>
                <span className="rounded-full bg-[#d8f3df] px-3 py-1 text-[12px] font-medium text-[#16934d]">
                  {course.activeExams} Active
                </span>
              </div>

              <div className="grid grid-cols-2 items-center">
                <div className="flex items-center gap-2 text-[#1f2937]">
                  <Users size={13} className="text-[#6b7280]" />
                  {course.totalStudents}
                </div>

                <div className="text-center">
                  <button
                    onClick={() => toggleCourse(course.id)}
                    className="rounded-[8px] bg-[#4F39F6] px-4 py-2 text-[10px] font-medium text-white"
                  >
                    {isExpanded ? "Hide Exams" : "View Exams"}
                  </button>
                </div>
              </div>
            </div>


            <div className="hidden md:grid lg:hidden md:grid-cols-3 items-center gap-2 px-4 py-4 text-[14px]">
              <div className="col-span-2 flex items-center gap-3">
                <button
                  onClick={() => toggleCourse(course.id)}
                  className="text-[#6b7280]"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"
                      }`}
                  />
                </button>

                <div
                  className="flex h-8 w-8 items-center justify-center rounded-[8px] text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #615FFF 0%, #9810FA 100%)",
                  }}
                >
                  <FileText size={15} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#1f2937] truncate">
                    {course.name}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-[#6b7280]">
                    <span>{course.totalExams} exams</span>
                    <span>{course.activeExams} active</span>
                    <span className="flex items-center gap-1">
                      <Users size={11} />
                      {course.totalStudents}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => toggleCourse(course.id)}
                  className="rounded-[10px] bg-[#5b4df4] px-3 py-2 text-[12px] font-medium text-white"
                >
                  {isExpanded ? "Hide" : "View"}
                </button>
              </div>
            </div>


            <div className="md:hidden px-4 py-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => toggleCourse(course.id)}
                    className="text-[#6b7280] mt-1"
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"
                        }`}
                    />
                  </button>

                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-[8px] text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #615FFF 0%, #9810FA 100%)",
                    }}
                  >
                    <FileText size={15} />
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-[#1f2937] text-[15px]">
                      {course.name}
                    </p>
                    <p className="text-[12px] text-[#6b7280]">
                      {course.availableExams} exams available
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                <div>
                  <p className="text-[11px] text-[#6b7280] mb-1">Total Exams</p>
                  <p className="font-semibold text-[#1f2937] text-[16px]">
                    {course.totalExams}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[#6b7280] mb-1">Active</p>
                  <span className="rounded-full bg-[#d8f3df] px-2 py-1 text-[11px] font-medium text-[#16934d]">
                    {course.activeExams}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] text-[#6b7280] mb-1">Students</p>
                  <div className="flex items-center gap-1 text-[#1f2937]">
                    <Users size={12} className="text-[#6b7280]" />
                    <span className="font-semibold text-[16px]">
                      {course.totalStudents}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleCourse(course.id)}
                className="w-full rounded-[10px] bg-[#5b4df4] px-4 py-2 text-[12px] font-medium text-white"
              >
                {isExpanded ? "Hide Exams" : "View Exams"}
              </button>
            </div>

            {isExpanded && (
              (() => {
                const fetchedList = fetchedExams[course.id];
                const examsToShow = (fetchedList && fetchedList.length > 0)
                  ? fetchedList
                  : course.exams;

                if (loadingExams[course.id]) {
                  return (
                    <div className="flex justify-center items-center py-6 bg-[#fafafe] px-4 pb-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#4F39F6]"></div>
                      <span className="ml-2 text-xs text-[#6b7280]">Loading exams...</span>
                    </div>
                  );
                }

                if (examsToShow.length === 0) {
                  return (
                    <div className="text-center py-4 bg-[#fafafe] text-xs text-[#6b7280] px-4 pb-4 border-t border-[#eceef3] italic">
                      No exams mapped to this course.
                    </div>
                  );
                }

                return (
                  <div className="space-y-3 bg-[#fafafe] px-4 pb-4">
                    {examsToShow.map((exam) => (
                      <div
                        key={exam.id}
                        className="flex flex-col justify-between gap-4 rounded-[12px] border border-[#e1e3ea] bg-white p-4 lg:flex-row lg:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                              <FileText size={14} className="text-[#5865f2]" />
                              <p className="font-semibold text-[#1f2937] text-sm md:text-base">
                                {exam.title}
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-medium ${statusBadge(
                                exam.status,
                              )}`}
                            >
                              {exam.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-[11px] md:text-[12px] text-[#6b7280]">
                            <span className="text-xs md:text-sm">{exam.type}</span>
                            <span className="text-xs md:text-sm">
                              {exam.questions} questions
                            </span>
                            <span className="flex items-center gap-1 text-xs md:text-sm">
                              <Clock3 size={12} />
                              {exam.duration}
                            </span>

                          </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                          <button
                            onClick={() => viewExam(exam)}
                            className="text-[#4F39F6] p-3 md:p-2 hover:bg-[#f0f8ff] rounded-lg transition-colors"
                            aria-label="View exam"
                          >
                            <Eye size={16} className="md:size-4" />
                          </button>
                          <button
                            onClick={() => editExam(exam)}
                            className="text-[#155DFC] p-3 md:p-2 hover:bg-[#f0f8ff] rounded-lg transition-colors"
                            aria-label="Edit exam"
                          >
                            <FaRegEdit size={16} className="md:size-4" />
                          </button>
                          <button
                            onClick={() => deleteExam(exam.id)}
                            className="text-red-500 p-3 md:p-2 hover:bg-[#fff0f0] rounded-lg transition-colors"
                            aria-label="Delete exam"
                          >
                            <Trash2 size={16} className="md:size-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseTable;
