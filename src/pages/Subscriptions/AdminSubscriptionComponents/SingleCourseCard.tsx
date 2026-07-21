import React from "react";
import { Code } from "lucide-react";

interface SingleCourseCardProps {
  plan: string;
  setPlan: (value: "single" | "dual" | "triple") => void;
  selectedExam: number;
  setSelectedExam: (value: number) => void;
  courseType: string;
  setCourseType: (value: string) => void;
  apiCourses: any[];
  singlePlans: any[];
}

export const SingleCourseCard: React.FC<SingleCourseCardProps> = ({
  plan,
  setPlan,
  selectedExam,
  setSelectedExam,
  courseType,
  setCourseType,
  apiCourses,
  singlePlans,
}) => {
  return (
    <div
      onClick={() => {
        setPlan("single");
        if (!selectedExam) {
          setSelectedExam(2); // default
        }
      }}
      className={`bg-white rounded-xl shadow-md p-6 cursor-pointer border-2 ${
        plan === "single" ? "border-purple-600" : "border-transparent"
      }`}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Single Course</h3>
        <Code className="text-purple-600" />
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Choose one course with flexible exam counts
      </p>

      {/* Select Course */}
      <div className="mt-4">
        <h4 className="font-semibold text-gray-800 mb-2">Select Course:</h4>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {["Technical", "Non-Tech"].map((type) => (
            <button
              key={type}
              onClick={(e) => {
                e.stopPropagation();
                setPlan("single");
                setCourseType(type);
              }}
              className={`flex-1 py-1 rounded-md text-sm ${
                courseType === type
                  ? "bg-purple-600 text-white"
                  : "text-gray-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Course Selection List */}
      <div className="mt-4">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Select Course
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

      {/* Select Plan */}
      <div className="mt-4">
        <h4 className="font-semibold text-gray-800 mb-2">Select Plan:</h4>
        <div className="space-y-2">
          {singlePlans.map((item) => (
            <div
              key={item.exams}
              onClick={(e) => {
                e.stopPropagation();
                setPlan("single");
                setSelectedExam(item.exams);
              }}
              className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer ${
                selectedExam === item.exams
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200"
              }`}
            >
              <span>{item.exams} Exams</span>
              <span className="text-purple-700 font-semibold">
                ₹{item.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
