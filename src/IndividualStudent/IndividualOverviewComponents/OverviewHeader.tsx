import React from "react";
import { NavigateFunction } from "react-router-dom";

interface OverviewHeaderProps {
  navigate: NavigateFunction;
  courseId: string;
  studentEmail: string;
  courseName: string;
}

export const OverviewHeader: React.FC<OverviewHeaderProps> = ({
  navigate,
  courseId,
  studentEmail,
  courseName,
}) => {
  return (
    <>
      {/* Back Button */}
      <button
        onClick={() => navigate(`/individualterms/${courseId}`)}
        className="absolute top-6 left-4 z-10 hover:opacity-80"
        style={{
          width: "174.625px",
          height: "36px",
          borderRadius: "10px",
          color: "black",
          fontWeight: "500",
          fontSize: "14px",
        }}
      >
        ← Back
      </button>

      {/* Header */}
      <div className="text-center mb-10 mt-6">
        <h1 className="text-5xl font-bold mb-2" style={{ color: "#6F24A6" }}>
          Welcome to Exam Portal
        </h1>
        <p className="text-lg" style={{ color: "#6B7280" }}>
          {studentEmail}
        </p>
      </div>

      <div className="text-start mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {courseName}
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Course ID: {courseId}
        </p>
      </div>
    </>
  );
};
