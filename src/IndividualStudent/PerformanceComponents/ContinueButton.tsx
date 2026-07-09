import React from "react";
import { ArrowRight } from "lucide-react";

interface ContinueButtonProps {
  selectedCourses: number[];
  lockedCourses: number[];
  maxLimit: number;
  handleSaveCourses: () => Promise<void>;
}

export const ContinueButton: React.FC<ContinueButtonProps> = ({
  selectedCourses,
  lockedCourses,
  maxLimit,
  handleSaveCourses,
}) => {
  return (
    <div className="flex justify-center mt-12 mb-8">
      <button
        disabled={selectedCourses.length !== maxLimit}
        onClick={handleSaveCourses}
        className={`px-8 py-4 text-white rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg ${
          selectedCourses.length !== maxLimit
            ? "bg-gray-300 cursor-not-allowed shadow-none opacity-80"
            : "bg-[#5b61f4] hover:bg-indigo-600 shadow-indigo-200 hover:shadow-indigo-300"
        }`}
      >
        {lockedCourses.length === maxLimit ? (
          <>
            Continue to Exams <ArrowRight className="w-5 h-5" />
          </>
        ) : (
          <>
            {maxLimit === 1 ? "Select Course" : "Select Courses"}{" "}
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
};
