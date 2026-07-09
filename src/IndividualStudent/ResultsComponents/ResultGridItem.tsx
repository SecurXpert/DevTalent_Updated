import React from "react";
import { BookOpen, CheckCircle, XCircle, Code, Eye, Download } from "lucide-react";
import { NavigateFunction } from "react-router-dom";

interface ResultGridItemProps {
  result: any;
  navigate: NavigateFunction;
}

export const ResultGridItem: React.FC<ResultGridItemProps> = ({
  result,
  navigate,
}) => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col relative pt-1 hover:border-purple-500 hover:-translate-y-1 transition-all duration-300">
      {/* Top border color line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          result.status === "Passed" && result.score > 80
            ? "bg-gradient-to-r from-blue-500 to-purple-500"
            : result.status === "Passed"
            ? "bg-blue-500"
            : "bg-orange-500"
        }`}
      ></div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <BookOpen className="w-3 h-3" />
            {result.courseName}
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium ${
              result.type === "MCQ"
                ? "bg-purple-100 text-purple-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {result.type === "MCQ" ? (
              <BookOpen className="w-3 h-3" />
            ) : (
              <Code className="w-3 h-3" />
            )}
            {result.type}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 mb-4">{result.title}</h3>

        <div className="flex items-center justify-between mb-4">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
              result.status === "Passed"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {result.status === "Passed" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {result.status}
          </span>
          <div className="text-right">
            <div className="font-bold text-xl leading-none">
              {result.marksEarned}/{result.totalMarks}
            </div>
            <div className="text-xs text-gray-500">Marks</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Score</span>
            <span
              className={`font-bold ${
                result.status === "Passed" && result.score > 80
                  ? "text-blue-600"
                  : result.status === "Passed"
                  ? "text-blue-500"
                  : "text-orange-500"
              }`}
            >
              {result.score}%
            </span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                result.status === "Passed" && result.score > 80
                  ? "bg-gradient-to-r from-blue-500 to-purple-500"
                  : result.status === "Passed"
                  ? "bg-blue-500"
                  : "bg-orange-500"
              }`}
              style={{ width: `${result.score}%` }}
            ></div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-center bg-gray-50 rounded-xl py-3 px-2 mb-4">
          <div>
            <div className="font-bold text-gray-900">{result.stats.total}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
              Total
            </div>
          </div>
          <div>
            <div className="font-bold text-purple-500">
              {result.stats.attempted}
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
              Attempted
            </div>
          </div>
          <div>
            <div className="font-bold text-green-500">
              {result.stats.correct}
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
              Correct
            </div>
          </div>
          <div>
            <div className="font-bold text-red-500">{result.stats.wrong}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
              Wrong
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-6">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full border border-gray-300 flex items-center justify-center">
              📅
            </span>
            {result.date}
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full border border-gray-300 flex items-center justify-center">
              🕒
            </span>
            {result.time}
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <button
            onClick={() => navigate("/scorecard", { state: { exam: result } })}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition shadow-sm"
          >
            <Eye className="w-4 h-4" />
            View Scorecard
          </button>
          <button className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center hover:bg-purple-100 transition">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
