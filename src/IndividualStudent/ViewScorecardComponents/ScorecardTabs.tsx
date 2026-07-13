import React from "react";
import { BarChart2, FileText } from "lucide-react";

interface ScorecardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ScorecardTabs: React.FC<ScorecardTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <button
        onClick={() => setActiveTab("Overview")}
        className={`px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition shadow-sm ${
          activeTab === "Overview"
            ? "bg-[#523de1] text-white"
            : "bg-white text-gray-500 hover:text-gray-700 border border-gray-100"
        }`}
      >
        <BarChart2 className="w-4 h-4" />
        Overview
      </button>
      <button
        onClick={() => setActiveTab("Analytics")}
        className={`px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition shadow-sm ${
          activeTab === "Analytics"
            ? "bg-[#523de1] text-white"
            : "bg-white text-gray-500 hover:text-gray-700 border border-gray-100"
        }`}
      >
        <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
        </div>
        Analytics
      </button>
      <button
        onClick={() => setActiveTab("Exam Info")}
        className={`px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition shadow-sm ${
          activeTab === "Exam Info"
            ? "bg-[#523de1] text-white"
            : "bg-white text-gray-500 hover:text-gray-700 border border-gray-100"
        }`}
      >
        <FileText className="w-4 h-4" />
        Exam Info
      </button>
    </div>
  );
};
