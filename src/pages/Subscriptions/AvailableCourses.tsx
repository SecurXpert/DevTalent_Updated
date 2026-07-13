import React from "react";
import { BookOpen, Users, FileText, Code } from "lucide-react";

type FormState = {
  name: string;
  courseLimit: string;
  mcqCredits: string;
  codingCredits: string;
  amount: string;
};

type FormErrors = {
  name?: string;
  courseLimit?: string;
  mcqCredits?: string;
  codingCredits?: string;
  amount?: string;
};

type AvailableCoursesProps = {
  form: FormState;
  errors: FormErrors;
  onInputChange: (key: keyof FormState, value: string | string[]) => void;
  onSubmit: () => void;
  view: "create" | "edit";
};

const AvailableCourses: React.FC<AvailableCoursesProps> = ({
  form,
  errors,
  onInputChange,
  onSubmit,
  view,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
          style={{
            background: "linear-gradient(135deg, #AD46FF 0%, #E60076 100%)",
          }}
        >
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="text-[18px] font-semibold text-slate-900">
            Credits & Limits
          </h2>
          <p className="text-sm text-slate-500">
            Set course limits and credit allocations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            MCQ Credits <span className="text-red-500">*</span>
          </label>
          <div
            className={`flex h-12 items-center gap-2 rounded-xl border bg-white px-4 ${
              errors.mcqCredits
                ? "border-red-400"
                : "border-slate-300 focus-within:border-indigo-500"
            }`}
          >
            <FileText size={18} className="text-slate-400" />
            <input
              type="text"
              value={form.mcqCredits}
              onChange={(e) => onInputChange("mcqCredits", e.target.value)}
              placeholder="50"
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Total mcq questions available
          </p>
          {errors.mcqCredits && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {errors.mcqCredits}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Coding Credits <span className="text-red-500">*</span>
          </label>
          <div
            className={`flex h-12 items-center gap-2 rounded-xl border bg-white px-4 ${
              errors.codingCredits
                ? "border-red-400"
                : "border-slate-300 focus-within:border-indigo-500"
            }`}
          >
            <Code size={18} className="text-slate-400" />
            <input
              type="text"
              value={form.codingCredits}
              onChange={(e) => onInputChange("codingCredits", e.target.value)}
              placeholder="25"
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Total coding questions available
          </p>
          {errors.codingCredits && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {errors.codingCredits}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableCourses;
