import React from "react";
import { Users, Star, Check } from "lucide-react";

interface DualCourseCardProps {
  plan: string;
  setPlan: (value: "single" | "dual" | "triple") => void;
  apiCourses: any[];
  dualExams: number;
  dualPrice: number;
}

export const DualCourseCard: React.FC<DualCourseCardProps> = ({
  plan,
  setPlan,
  apiCourses,
  dualExams,
  dualPrice,
}) => {
  return (
    <div
      onClick={() => setPlan("dual")}
      className={`bg-white rounded-xl shadow-md p-6 cursor-pointer border-2 relative ${
        plan === "dual" ? "border-purple-600" : "border-transparent"
      }`}
    >
      <span className="absolute -top-3 left-4 bg-purple-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
        <Star size={12} />
        POPULAR
      </span>

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Dual Course</h3>
        <Users className="text-purple-600" />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Select 2 courses for balanced learning
      </p>

      {/* Course Selection List for Dual */}
      <div className="mt-4">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Select 2 Courses
        </h4>
        <div className="space-y-2">
          {apiCourses.map((course) => (
            <div
              key={course.id}
              className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 bg-gray-50 transition-all"
            >
              <div className="p-1.5 rounded-md bg-white shadow-sm">
                <course.icon size={18} className="text-gray-500" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {course.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="space-y-3 text-sm p-4 rounded-lg mt-5
          border-t border-[#7C3AED33]
          bg-gradient-to-br from-[rgba(124,58,237,0.1)] to-[rgba(109,40,217,0.1)]"
      >
        {" "}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Courses:</span>
          <span className="font-medium text-gray-800">2 Courses</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Per Course:</span>
          <span className="font-medium text-gray-800">3 Exams</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Exams:</span>
          <span className="font-medium text-gray-800">{dualExams} Exams</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="text-gray-600">Base Price:</span>
          <span className="text-purple-700 font-semibold text-lg">
            ₹{dualPrice}
          </span>
        </div>
        <p className="text-right text-gray-500 text-xs">+ GST</p>
      </div>

      <div className="mt-4 flex items-center text-sm text-gray-600">
        <Check size={14} className="text-green-600 mr-2" />
        <span>Technical + Non-Technical</span>
      </div>
    </div>
  );
};
