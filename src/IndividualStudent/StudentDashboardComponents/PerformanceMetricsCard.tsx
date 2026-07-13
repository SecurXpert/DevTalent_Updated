import React from "react";
import { Trophy, Medal, Star } from "lucide-react";

interface PerformanceMetricsCardProps {
  performanceMetrics: any;
}

export const PerformanceMetricsCard: React.FC<PerformanceMetricsCardProps> = ({ performanceMetrics }) => {
  return (
    <div className="rounded-2xl shadow-xl border border-purple-100 overflow-hidden bg-white flex flex-col">
      {/* INNER BORDER / BACKGROUND CONTAINER */}
      <div className="rounded-xl border border-purple-50 bg-white">
        {/* HEADER */}
        <div className="bg-gradient-to-b from-[#F3EBFE] to-[#FCF9FF] px-6 py-5 rounded-t-xl">
          <h2 className="font-bold text-lg flex items-center gap-2 text-gray-900">
            <Trophy className="w-5 h-5 text-[#5B12A8]" />
            Performance Metrics
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Your examination performance at a glance
          </p>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6 bg-white rounded-b-xl">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Avg Score */}
            <div className="rounded-2xl p-6 pb-12 text-center shadow-sm relative overflow-hidden bg-gradient-to-br from-[#E2D4F8] to-[#F1EAFA]">
              <p className="text-4xl font-extrabold text-[#5B12A8] relative z-10 mb-1">
                {performanceMetrics ? `${Math.round(performanceMetrics.average_percentage || 0)}%` : '0%'}
              </p>
              <p className="text-gray-600/80 text-sm relative z-10">Avg Score</p>
              {/* Static Chart Line */}
              <svg className="absolute bottom-2 left-0 w-full h-12 text-[#5B12A8]" preserveAspectRatio="none" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5,25 L20,15 L35,20 L55,10 L75,18 L95,5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="5" cy="25" r="1.5" fill="currentColor" />
                <circle cx="20" cy="15" r="1.5" fill="currentColor" />
                <circle cx="35" cy="20" r="1.5" fill="currentColor" />
                <circle cx="55" cy="10" r="1.5" fill="currentColor" />
                <circle cx="75" cy="18" r="1.5" fill="currentColor" />
                <circle cx="95" cy="5" r="1.5" fill="currentColor" />
              </svg>
            </div>

            {/* Passed */}
            <div className="rounded-2xl p-6 pb-12 text-center shadow-sm relative overflow-hidden bg-gradient-to-br from-[#C6F3DE] to-[#E3F9ED]">
              <p className="text-4xl font-extrabold text-[#0D946A] relative z-10 mb-1">
                {performanceMetrics ? (performanceMetrics.total_exams_passed || 0) : '0'}
              </p>
              <p className="text-gray-600/80 text-sm relative z-10">Passed</p>
              <svg className="absolute bottom-2 left-0 w-full h-12 text-[#0D946A]" preserveAspectRatio="none" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5,25 L20,15 L35,20 L55,22 L75,10 L85,15 L95,5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="5" cy="25" r="1.5" fill="currentColor" />
                <circle cx="20" cy="15" r="1.5" fill="currentColor" />
                <circle cx="35" cy="20" r="1.5" fill="currentColor" />
                <circle cx="55" cy="22" r="1.5" fill="currentColor" />
                <circle cx="75" cy="10" r="1.5" fill="currentColor" />
                <circle cx="85" cy="15" r="1.5" fill="currentColor" />
                <circle cx="95" cy="5" r="1.5" fill="currentColor" />
              </svg>
            </div>

            {/* Pass Rate */}
            <div className="rounded-2xl p-6 pb-12 text-center shadow-sm relative overflow-hidden bg-gradient-to-br from-[#FCE3BB] to-[#FDF1D8]">
              <p className="text-4xl font-extrabold text-[#E58416] relative z-10 mb-1">
                {performanceMetrics ? `${Math.round(performanceMetrics.overall_percentage || 0)}%` : '0%'}
              </p>
              <p className="text-gray-600/80 text-sm relative z-10">Pass Rate</p>
              <svg className="absolute bottom-2 left-0 w-full h-12 text-[#E58416]" preserveAspectRatio="none" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5,25 L15,15 L25,20 L40,22 L55,25 L75,10 L85,18 L95,5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="5" cy="25" r="1.5" fill="currentColor" />
                <circle cx="15" cy="15" r="1.5" fill="currentColor" />
                <circle cx="25" cy="20" r="1.5" fill="currentColor" />
                <circle cx="40" cy="22" r="1.5" fill="currentColor" />
                <circle cx="55" cy="25" r="1.5" fill="currentColor" />
                <circle cx="75" cy="10" r="1.5" fill="currentColor" />
                <circle cx="85" cy="18" r="1.5" fill="currentColor" />
                <circle cx="95" cy="5" r="1.5" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* CURRENT LEVEL */}
          <div className="bg-[#FAF8FC] border border-purple-100 rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div>
              <p className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                <Medal className="w-5 h-5 text-[#5B12A8]" />
                Current Level
              </p>

              <p className="text-[#E58416] text-sm font-medium flex items-center gap-1.5">
                <Star className="w-4 h-4" />
                Congratulations! You've reached the highest level
              </p>
            </div>

            <span className="bg-[#E58416] text-white px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap shadow-sm mt-1">
              L4 - Advanced
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
