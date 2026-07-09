import React from "react";
import { Sparkles, Check } from "lucide-react";

interface CourseSelectionGridProps {
  coursesList: any[];
  selectedCourses: number[];
  setSelectedCourses: (courses: number[]) => void;
  lockedCourses: number[];
  maxLimit: number;
  isLimitReached: boolean;
}

export const CourseSelectionGrid: React.FC<CourseSelectionGridProps> = ({
  coursesList,
  selectedCourses,
  setSelectedCourses,
  lockedCourses,
  maxLimit,
  isLimitReached,
}) => {
  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[#5b61f4]" />
          <h2 className="text-2xl font-bold text-gray-900">Select Courses</h2>
        </div>
        <span className="text-sm font-medium bg-indigo-50 text-indigo-600 px-3.5 py-1.5 rounded-lg border border-indigo-100">
          Selected: {selectedCourses.length} / {maxLimit}{" "}
          {maxLimit > 1 ? "Courses" : "Course"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coursesList.map((course) => {
          const isSelected = selectedCourses.includes(course.id);
          const isLocked = lockedCourses.includes(course.id);
          const canSwap = maxLimit === 1 && lockedCourses.length === 0;
          const isDisabled =
            isLocked || (!isSelected && isLimitReached && !canSwap);
          return (
            <div
              key={course.id}
              onClick={() => {
                if (isDisabled) return;
                if (isSelected) {
                  setSelectedCourses(
                    selectedCourses.filter((id) => id !== course.id)
                  );
                } else {
                  if (maxLimit === 1) {
                    setSelectedCourses([course.id]);
                  } else {
                    setSelectedCourses([...selectedCourses, course.id]);
                  }
                }
              }}
              className={`relative bg-white rounded-xl p-5 border transition-all duration-200 ${
                isSelected
                  ? `border-[#5b61f4] shadow-sm ${
                      isLocked
                        ? "cursor-not-allowed opacity-90 bg-indigo-50/30"
                        : "cursor-pointer"
                    }`
                  : isDisabled
                  ? "border-gray-100 opacity-40 cursor-not-allowed"
                  : "border-gray-200 hover:border-gray-300 cursor-pointer"
              }`}
            >
              <div className="pr-10">
                <h3 className="text-[15px] font-semibold text-gray-900 mb-1">
                  {course.name}
                </h3>
                <p className="text-[13px] text-gray-500">Course</p>
              </div>
              <div className="absolute top-5 right-5">
                {isSelected ? (
                  <div className="w-[20px] h-[20px] rounded-full bg-[#5b61f4] flex items-center justify-center">
                    <Check
                      className="w-3.5 h-3.5 text-white"
                      strokeWidth={3}
                    />
                  </div>
                ) : (
                  <div className="w-[20px] h-[20px] rounded-full border-[1.5px] border-gray-300"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
