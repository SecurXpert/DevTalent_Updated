import React from "react";
import { BookOpen, CheckCircle, XCircle, TrendingUp } from "lucide-react";

interface Summary {
  totalExams: number;
  passedExams: number;
  failedExams: number;
  averageScore: number;
}

interface SummaryCardsProps {
  summary: Summary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Exams */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4 hover:border-purple-500 hover:-translate-y-1 transition-all duration-300">
        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">
            {summary.totalExams}
          </div>
          <div className="text-sm font-medium text-gray-700">Total Exams</div>
          <div className="text-xs text-gray-400">All attempts</div>
        </div>
      </div>

      {/* Passed Exams */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4 hover:border-purple-500 hover:-translate-y-1 transition-all duration-300">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <div className="text-2xl font-bold text-green-500">
            {summary.passedExams}
          </div>
          <div className="text-sm font-medium text-gray-700">Passed Exams</div>
          <div className="text-xs text-gray-400">63% success rate</div>
        </div>
      </div>

      {/* Failed Exams */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4 hover:border-purple-500 hover:-translate-y-1 transition-all duration-300">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <XCircle className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <div className="text-2xl font-bold text-red-500">
            {summary.failedExams}
          </div>
          <div className="text-sm font-medium text-gray-700">Failed Exams</div>
          <div className="text-xs text-gray-400">Needs improvement</div>
        </div>
      </div>

      {/* Average Score */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4 hover:border-purple-500 hover:-translate-y-1 transition-all duration-300">
        <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <div className="text-2xl font-bold text-yellow-500">
            {summary.averageScore}%
          </div>
          <div className="text-sm font-medium text-gray-700">Average Score</div>
          <div className="text-xs text-gray-400">Across all exams</div>
        </div>
      </div>
    </div>
  );
};
