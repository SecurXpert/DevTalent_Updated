import React from "react";
import { Link, PlayCircle, BookOpen, Award, CreditCard, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickLinksProps {
  course: string;
  subscription: any;
}

export const QuickLinks: React.FC<QuickLinksProps> = ({ course, subscription }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-fit bg-white text-gray-900 rounded-3xl shadow-xl overflow-hidden flex flex-col border border-gray-100">
      {/* HEADER */}
      <div className="px-5 py-4 flex items-center gap-2 bg-white">
        <Link className="text-[#6B21A8] w-5 h-5" />
        <h2 className="font-semibold text-lg text-[#6B21A8]">Quick Links</h2>
      </div>

      {/* CONTENT BACKGROUND */}
      <div className="bg-[#F5F0FF] p-5 flex flex-col gap-4">
        {/* Top Row: 3 Items */}
        <div className="grid grid-cols-3 gap-3">
          {/* Start Exam */}
          <div
            className="h-fit bg-white rounded-2xl p-3 flex flex-col items-center justify-center gap-3 cursor-pointer hover:scale-105 transition-transform shadow-sm"
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
              navigate(`/individualterms/${targetCourseId}`);
              window.scrollTo(0, 0);
            }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#A855F7] to-[#6B21A8] flex items-center justify-center shadow-lg shadow-purple-500/40">
              <PlayCircle className="text-white w-6 h-6" />
            </div>
            <span className="text-[13px] font-medium text-gray-900 text-center leading-tight">
              Start Exam
            </span>
          </div>

          {/* Select Course */}
          <div
            className="h-fit bg-white rounded-2xl p-3 flex flex-col items-center justify-center gap-3 cursor-pointer hover:scale-105 transition-transform shadow-sm"
            onClick={() => {
              navigate("/performance");
              window.scrollTo(0, 0);
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#4ADE80] to-[#16A34A] flex items-center justify-center shadow-lg shadow-green-500/40">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <span className="text-[13px] font-medium text-gray-900 text-center leading-tight">
              Select Cource
            </span>
          </div>

          {/* Certificates */}
          <div
            className="h-fit bg-white rounded-2xl p-3 flex flex-col items-center justify-center gap-3 cursor-pointer hover:scale-105 transition-transform shadow-sm"
            onClick={() => {
              navigate("/certificate");
              window.scrollTo(0, 0);
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#FCD34D] to-[#EA580C] flex items-center justify-center shadow-lg shadow-orange-500/40">
              <Award className="text-white w-6 h-6" />
            </div>
            <span className="text-[13px] font-medium text-gray-900 text-center leading-tight">
              Certificates
            </span>
          </div>
        </div>

        {/* Bottom Row: 2 Items */}
        <div className="grid grid-cols-2 gap-3 max-w-[90%] mx-auto w-full">
          {/* Payments */}
          <div
            className="h-fit bg-white rounded-2xl p-3 flex flex-col items-center justify-center gap-3 cursor-pointer hover:scale-105 transition-transform shadow-sm"
            onClick={() => {
              navigate("/payments");
              window.scrollTo(0, 0);
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#60A5FA] to-[#2563EB] flex items-center justify-center shadow-lg shadow-blue-500/40">
              <CreditCard className="text-white w-6 h-6" />
            </div>
            <span className="text-[13px] font-medium text-gray-900 text-center leading-tight">
              Payments
            </span>
          </div>

          {/* Results */}
          <div
            className="h-fit bg-white rounded-2xl p-3 flex flex-col items-center justify-center gap-3 cursor-pointer hover:scale-105 transition-transform shadow-sm"
            onClick={() => {
              navigate("/student-results");
              window.scrollTo(0, 0);
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#C084FC] to-[#7E22CE] flex items-center justify-center shadow-lg shadow-purple-500/40">
              <BarChart3 className="text-white w-6 h-6" />
            </div>
            <span className="text-[13px] font-medium text-gray-900 text-center leading-tight">
              Results
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
