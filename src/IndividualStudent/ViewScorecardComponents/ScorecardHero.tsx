import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface ScorecardHeroProps {
  exam: any;
}

export const ScorecardHero: React.FC<ScorecardHeroProps> = ({ exam }) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)] relative overflow-hidden mb-6">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-blue-500"></div>

      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Left: Circular Progress */}
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <defs>
                <linearGradient
                  id="scoreGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <circle
                cx="80"
                cy="80"
                r="64"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-gray-100"
              />
              <circle
                cx="80"
                cy="80"
                r="64"
                stroke="url(#scoreGradient)"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="402"
                strokeDashoffset={402 - (402 * exam.score) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex items-center justify-center">
              <span className="text-5xl font-bold text-[#523de1]">
                {exam.score}%
              </span>
            </div>
          </div>
          <div
            className={`mt-4 px-6 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
              exam.status === "Passed"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {exam.status === "Passed" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {exam.status}
          </div>
        </div>

        {/* Middle: Info */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-purple-500 font-medium text-sm mb-1">
            {exam.courseName}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {exam.title}
          </h1>

          <div className="mb-6 flex items-baseline justify-center md:justify-start gap-2">
            <span className="text-5xl font-bold text-[#523de1]">
              {exam.marksEarned}
            </span>
            <span className="text-3xl font-bold text-purple-300">/</span>
            <span className="text-5xl font-bold text-purple-300">
              {exam.totalMarks}
            </span>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-6">
            Marks Obtained
          </p>

          <div className="bg-green-50/80 border border-green-100 rounded-xl py-3 px-4 inline-flex items-center gap-2 text-green-700 text-sm font-medium">
            <span>🎉</span>
            {exam.status === "Passed"
              ? "Excellent work! You've successfully passed the assessment."
              : "Don't give up! Review the material and try again."}
          </div>
        </div>

        {/* Right: Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center w-28 h-28">
            <span className="text-3xl font-bold text-gray-700 mb-1">
              {exam.stats.total}
            </span>
            <span className="text-xs text-gray-500 font-medium">Total Q's</span>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4 flex flex-col items-center justify-center w-28 h-28">
            <span className="text-3xl font-bold text-purple-400 mb-1">
              {exam.stats.attempted}
            </span>
            <span className="text-xs text-purple-300 font-medium">
              Attempted
            </span>
          </div>
          <div className="bg-green-50/50 rounded-2xl p-4 flex flex-col items-center justify-center w-28 h-28">
            <span className="text-3xl font-bold text-green-500 mb-1">
              {exam.stats.correct}
            </span>
            <span className="text-xs text-green-400 font-medium">Correct</span>
          </div>
          <div className="bg-red-50/50 rounded-2xl p-4 flex flex-col items-center justify-center w-28 h-28">
            <span className="text-3xl font-bold text-red-500 mb-1">
              {exam.stats.wrong}
            </span>
            <span className="text-xs text-red-400 font-medium">Incorrect</span>
          </div>
        </div>
      </div>
    </div>
  );
};
