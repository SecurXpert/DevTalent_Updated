import React from "react";

interface AnalyticsTabProps {
  exam: any;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ exam }) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
      <h3 className="text-xl font-bold text-gray-900 mb-8">Detailed Metrics</h3>
      <div className="flex flex-col">
        <div className="flex justify-between py-5 border-b border-gray-100">
          <span className="text-gray-500 font-medium">Total Questions</span>
          <span className="font-bold text-gray-700">{exam.stats.total}</span>
        </div>
        <div className="flex justify-between py-5 border-b border-gray-100">
          <span className="text-gray-500 font-medium">Attempted Questions</span>
          <span className="font-bold text-purple-600">
            {exam.stats.attempted}
          </span>
        </div>
        <div className="flex justify-between py-5 border-b border-gray-100">
          <span className="text-gray-500 font-medium">Correct Answers</span>
          <span className="font-bold text-green-600">{exam.stats.correct}</span>
        </div>
        <div className="flex justify-between py-5 border-b border-gray-100">
          <span className="text-gray-500 font-medium">Incorrect Answers</span>
          <span className="font-bold text-red-600">{exam.stats.wrong}</span>
        </div>
        <div className="flex justify-between py-5 border-b border-gray-100">
          <span className="text-gray-500 font-medium">Obtained Score</span>
          <span className="font-bold text-purple-600">
            {exam.marksEarned} marks
          </span>
        </div>
        <div className="flex justify-between py-5 border-b border-gray-100">
          <span className="text-gray-500 font-medium">Total Score</span>
          <span className="font-bold text-gray-700">
            {exam.totalMarks} marks
          </span>
        </div>
        <div className="flex justify-between py-5 border-b border-gray-100">
          <span className="text-gray-500 font-medium">Passing Percentage</span>
          <span className="font-bold text-orange-500">
            {exam.raw?.pass_percentage || 60}%
          </span>
        </div>
        <div className="flex justify-between py-5">
          <span className="text-gray-500 font-medium">Your Percentage</span>
          <span
            className={`font-bold ${
              exam.status === "Passed" ? "text-green-600" : "text-red-600"
            }`}
          >
            {exam.score}%
          </span>
        </div>
      </div>
    </div>
  );
};
