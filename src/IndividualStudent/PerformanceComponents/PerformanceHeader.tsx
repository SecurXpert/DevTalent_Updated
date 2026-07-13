import React from "react";
import { ArrowLeft } from "lucide-react";
import { NavigateFunction } from "react-router-dom";
import Devlogo from "../../assests/Devlogo.png";

interface PerformanceHeaderProps {
  navigate: NavigateFunction;
}

export const PerformanceHeader: React.FC<PerformanceHeaderProps> = ({
  navigate,
}) => {
  return (
    <>
      <button
        onClick={() => navigate("/studentdashboard")}
        className="flex items-center gap-2 text-gray-800 font-medium hover:text-black mb-10 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      <div className="text-center mb-14">
        <img
          src={Devlogo}
          alt="DevTalent"
          className="w-16 h-16 mx-auto mb-6 object-contain"
        />
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          Choose Your Learning Path
        </h1>
        <p className="text-gray-500 text-lg">
          Select your course plan to continue with assessments and certifications.
        </p>
      </div>
    </>
  );
};
