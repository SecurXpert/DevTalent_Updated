import React from "react";
import { ArrowLeft, Printer, Share2, Download } from "lucide-react";
import { NavigateFunction } from "react-router-dom";

interface ScorecardHeaderProps {
  navigate: NavigateFunction;
}

export const ScorecardHeader: React.FC<ScorecardHeaderProps> = ({
  navigate,
}) => {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
      <button
        onClick={() => navigate("/student-results")}
        className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 px-4 py-2 rounded-full transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Results
      </button>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition">
          <Printer className="w-4 h-4" />
          Print
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition">
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#523de1] rounded-full hover:bg-blue-700 transition shadow-sm">
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </header>
  );
};
