import React from "react";
import { ArrowLeft } from "lucide-react";
import { NavigateFunction } from "react-router-dom";

interface ResultsHeaderProps {
  navigate: NavigateFunction;
}

export const ResultsHeader: React.FC<ResultsHeaderProps> = ({ navigate }) => {
  return (
    <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-6 py-8 md:px-10 md:py-10">
      <button
        onClick={() => navigate("/studentdashboard")}
        className="flex items-center gap-2 text-sm mb-6 hover:opacity-80"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <h1 className="text-2xl md:text-3xl font-bold">My Results</h1>
      <p className="text-sm opacity-90 mt-1">
        View your completed exams, track your performance, and download your
        scorecards.
      </p>
    </div>
  );
};
