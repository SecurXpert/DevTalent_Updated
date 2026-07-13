import React from "react";
import { BookOpen, BookMarked, GraduationCap, CheckCircle2 } from "lucide-react";
import { NavigateFunction } from "react-router-dom";

interface PlanSelectionGridProps {
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  purchasedPlan: string;
  navigate: NavigateFunction;
}

export const PlanSelectionGrid: React.FC<PlanSelectionGridProps> = ({
  selectedPlan,
  setSelectedPlan,
  purchasedPlan,
  navigate,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
      {/* Plan 1: Single Course */}
      <div
        onClick={() => setSelectedPlan("Single Course")}
        className={`relative bg-white rounded-2xl p-8 shadow-sm border-2 cursor-pointer transition-all duration-200 ${
          selectedPlan === "Single Course"
            ? "border-indigo-500 shadow-md scale-[1.02]"
            : "border-gray-100 hover:border-gray-200"
        }`}
      >
        <div className="relative inline-block mb-6">
          {selectedPlan === "Single Course" && (
            <div className="absolute -top-2 -left-2 z-10 rounded-full bg-white">
              <CheckCircle2 className="w-6 h-6 fill-indigo-500 text-white" />
            </div>
          )}
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-indigo-500" />
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2 text-gray-900">
          Single Course
        </h3>
        <p className="text-gray-500 text-sm mb-8 h-10">
          Focus on mastering one specialized course.
        </p>

        <ul className="space-y-4 mb-10">
          <li className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> 1
            Course Access
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />{" "}
            Course-specific Exams
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />{" "}
            Completion Certificate
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Beginner
            Friendly
          </li>
        </ul>

        <button
          onClick={(e) => {
            if (purchasedPlan !== "Single Course") {
              e.stopPropagation();
              navigate("/subscription");
            }
          }}
          className={`w-full py-3.5 rounded-xl font-medium transition-colors ${
            selectedPlan === "Single Course"
              ? "bg-[#5b61f4] text-white hover:bg-indigo-600"
              : "bg-indigo-50 text-[#5b61f4] hover:bg-indigo-100"
          }`}
        >
          {purchasedPlan === "Single Course" ? "Selected" : "Upgrade"}
        </button>
      </div>

      {/* Plan 2: Dual Course */}
      <div
        onClick={() => setSelectedPlan("Dual Course")}
        className={`relative bg-white rounded-2xl p-8 shadow-sm border-2 cursor-pointer transition-all duration-200 ${
          selectedPlan === "Dual Course"
            ? "border-indigo-500 shadow-md scale-[1.02]"
            : "border-gray-100 hover:border-gray-200"
        }`}
      >
        <div className="absolute top-0 right-0 bg-[#5b61f4] text-white text-xs font-semibold px-4 py-1.5 rounded-bl-lg rounded-tr-xl">
          Most Popular
        </div>

        <div className="relative inline-block mb-6">
          {selectedPlan === "Dual Course" && (
            <div className="absolute -top-2 -left-2 z-10 rounded-full bg-white">
              <CheckCircle2 className="w-6 h-6 fill-indigo-500 text-white" />
            </div>
          )}
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <BookMarked className="w-7 h-7 text-indigo-500" />
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2 text-gray-900">Dual Course</h3>
        <p className="text-gray-500 text-sm mb-8 h-10">
          Learn and get certified in two related technologies.
        </p>

        <ul className="space-y-4 mb-10">
          <li className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> 2 Courses
            Access
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Combined
            Exam Dashboard
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Dual
            Certificates
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Better
            Skill Coverage
          </li>
        </ul>

        <button
          onClick={(e) => {
            if (purchasedPlan !== "Dual Course") {
              e.stopPropagation();
              navigate("/subscription");
            }
          }}
          className={`w-full py-3.5 rounded-xl font-medium transition-colors ${
            selectedPlan === "Dual Course"
              ? "bg-[#5b61f4] text-white hover:bg-indigo-600"
              : "bg-indigo-50 text-[#5b61f4] hover:bg-indigo-100"
          }`}
        >
          {purchasedPlan === "Dual Course" ? "Selected" : "Upgrade"}
        </button>
      </div>

      {/* Plan 3: Multiple Courses */}
      <div
        onClick={() => setSelectedPlan("Multiple Courses")}
        className={`relative bg-white rounded-2xl p-8 shadow-sm border-2 cursor-pointer transition-all duration-200 ${
          selectedPlan === "Multiple Courses"
            ? "border-indigo-500 shadow-md scale-[1.02]"
            : "border-gray-100 hover:border-gray-200"
        }`}
      >
        <div className="relative inline-block mb-6">
          {selectedPlan === "Multiple Courses" && (
            <div className="absolute -top-2 -left-2 z-10 rounded-full bg-white">
              <CheckCircle2 className="w-6 h-6 fill-indigo-500 text-white" />
            </div>
          )}
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-indigo-500" />
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2 text-gray-900">
          Triple Courses
        </h3>
        <p className="text-gray-500 text-sm mb-8 h-10">
          Access triple courses and advanced examination tracks.
        </p>

        <ul className="space-y-4 mb-10">
          <li className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> 3 Courses
            Access
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Multiple
            Exams
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Advanced
            Certifications
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />{" "}
            Career-Focused Learning
          </li>
        </ul>

        <button
          onClick={(e) => {
            if (purchasedPlan !== "Multiple Courses") {
              e.stopPropagation();
              navigate("/subscription");
            }
          }}
          className={`w-full py-3.5 rounded-xl font-medium transition-colors ${
            selectedPlan === "Multiple Courses"
              ? "bg-[#5b61f4] text-white hover:bg-indigo-600"
              : "bg-indigo-50 text-[#5b61f4] hover:bg-indigo-100"
          }`}
        >
          {purchasedPlan === "Multiple Courses" ? "Selected" : "Upgrade"}
        </button>
      </div>
    </div>
  );
};
