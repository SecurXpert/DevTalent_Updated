import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CoursePerformanceProps {
  course: string;
  subscription: any;
  courseExams: any[];
  codingExams: any[];
}

export const CoursePerformance: React.FC<CoursePerformanceProps> = ({
  course,
  subscription,
  courseExams,
  codingExams,
}) => {
  const navigate = useNavigate();

  if (course !== "Technical" && course !== "Non-Technical") {
    return null;
  }

  const mcqUsed = subscription?.mcq_used || 0;
  const mcqTotal = subscription?.mcq_total || 0;
  const codingUsed = subscription?.coding_used || 0;
  const codingTotal = subscription?.coding_total || 0;

  const mcqPercentage = mcqTotal > 0 ? Math.round((mcqUsed / mcqTotal) * 100) : 0;
  const codingPercentage = codingTotal > 0 ? Math.round((codingUsed / codingTotal) * 100) : 0;
  const totalUsed = mcqUsed + codingUsed;
  const totalExams = mcqTotal + codingTotal;

  return (
    <div className="rounded-2xl shadow-xl border border-purple-100 overflow-hidden bg-white flex flex-col">
      <div className="rounded-xl border border-purple-50 bg-white">
        {/* HEADER */}
        <div className="bg-gradient-to-b from-[#F3EBFE] to-[#FCF9FF] px-6 py-5 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-bold text-lg text-gray-900">
                {subscription?.selected_courses?.length
                  ? subscription.selected_courses.map((c: any) => c.course_name).join(", ")
                  : "Course Overview"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">Your examination performance at a glance</p>
            </div>
            <span className="text-gray-500 text-sm font-medium mt-1">
              {totalUsed} / {totalExams} exams
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6 bg-white rounded-b-xl">
          {/* MCQ's & Coding boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* MCQ's */}
            <div className="border border-purple-100 bg-[#FAF8FC] rounded-2xl p-5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-base">MCQ's</h3>
                <span className="text-gray-500 text-sm font-medium">
                  {mcqUsed} / {mcqTotal} exams
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-[#E4DAF5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5B12A8] rounded-full"
                    style={{ width: `${mcqPercentage}%` }}
                  />
                </div>
                <span className="font-bold text-[#5B12A8] text-sm">{mcqPercentage}%</span>
              </div>
            </div>

            {/* Coding */}
            <div className="border border-purple-100 bg-[#FAF8FC] rounded-2xl p-5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-base">Coding</h3>
                <span className="text-gray-500 text-sm font-medium">
                  {codingUsed} / {codingTotal} exams
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-[#E4DAF5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5B12A8] rounded-full"
                    style={{ width: `${codingPercentage}%` }}
                  />
                </div>
                <span className="font-bold text-[#5B12A8] text-sm">{codingPercentage}%</span>
              </div>
            </div>
          </div>

          {/* EXAMS LISTS */}
          <div className="space-y-8">
            {/* MCQ EXAMS */}
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-600 rounded-full"></span>
                MCQ Exams
              </h3>
              <div className="space-y-4">
                {courseExams && courseExams.length > 0 ? (
                  courseExams.map((exam: any, index: number) => (
                    <div
                      key={`mcq-${index}`}
                      className="flex items-center gap-3 bg-[#FAF8FC] rounded-2xl p-4 border border-purple-50"
                    >
                      <CheckCircle2 className="text-[#0D946A] w-5 h-5" />
                      <div>
                        <p className="font-bold text-gray-900">
                          {exam.exam_name || exam.title || exam.name || "Exam"}
                        </p>
                        <p className="text-[#0D946A] text-sm mt-0.5">MCQ Exam</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 italic bg-gray-50 rounded-xl border border-gray-100">
                    No MCQ exams available.
                  </div>
                )}
              </div>
            </div>

            {/* CODING EXAMS */}
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                Coding Exams
              </h3>
              <div className="space-y-4">
                {codingExams && codingExams.length > 0 ? (
                  codingExams.map((exam: any, index: number) => (
                    <div
                      key={`coding-${index}`}
                      className="flex items-center gap-3 bg-[#FAF8FC] rounded-2xl p-4 border border-blue-50"
                    >
                      <CheckCircle2 className="text-blue-500 w-5 h-5" />
                      <div>
                        <p className="font-bold text-gray-900">
                          {exam.exam_name || exam.title || exam.name || "Exam"}
                        </p>
                        <p className="text-blue-500 text-sm mt-0.5">Coding Exam</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 italic bg-gray-50 rounded-xl border border-gray-100">
                    No Coding exams available.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                let targetCourseId = "1";
                if (subscription?.selected_courses?.length > 0) {
                  const matchedCourse = subscription.selected_courses.find((c: any) =>
                    c.course_name?.toLowerCase().includes(course.toLowerCase())
                  );
                  if (matchedCourse) {
                    targetCourseId = String(matchedCourse.course_id);
                  } else {
                    targetCourseId = String(subscription.selected_courses[0].course_id);
                  }
                } else {
                  targetCourseId = course === "Technical" ? "1" : "2";
                }
                localStorage.setItem("selectedCourseId", targetCourseId);
                navigate(course === "Technical" ? "/technical" : "/non-technical");
                window.scrollTo(0, 0);
              }}
              className="text-[#5B12A8] font-semibold hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              View All Exams <span className="text-lg leading-none mt-0.5">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
