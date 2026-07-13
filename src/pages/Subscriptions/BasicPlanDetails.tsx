import React from "react";
import { FileText, Calendar, Users, Layers } from "lucide-react";

type FormState = {
  name: string;
  planType: string;
  courseLimit: string;
  mcqCredits: string;
  codingCredits: string;
  amount: string;
};

type FormErrors = {
  name?: string;
  planType?: string;
  courseLimit?: string;
  mcqCredits?: string;
  codingCredits?: string;
  amount?: string;
};

type BasicPlanDetailsProps = {
  form: FormState;
  errors: FormErrors;
  onInputChange: (key: keyof FormState, value: string | string[]) => void;
};

const BasicPlanDetails: React.FC<BasicPlanDetailsProps> = ({
  form,
  errors,
  onInputChange,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
          <FileText size={18} />
        </div>
        <div>
          <h2 className="text-[18px] font-semibold text-slate-900">
            Plan Details
          </h2>
          <p className="text-sm text-slate-500">
            Configure the basic subscription parameters
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Plan Name - Full Width */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Plan Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            placeholder="Enter plan name"
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 ${
              errors.name
                ? "border-red-400 focus:border-red-500"
                : "border-slate-300 focus:border-indigo-500"
            }`}
          />
          {errors.name && (
            <p className="mt-2 text-xs font-medium text-red-500">
              {errors.name}
            </p>
          )}
        </div>

        {/* Plan Type and Course Limit - Side by Side */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Plan Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Plan Type <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex h-12 items-center rounded-xl border bg-white px-4 ${
                errors.name
                  ? "border-red-400"
                  : "border-slate-300 focus-within:border-indigo-500"
              }`}
            >
              <select
                className="h-full w-full bg-transparent text-sm outline-none"
                value={form.planType || ""}
                onChange={(e) => onInputChange("planType", e.target.value)}
              >
                <option value="" disabled>
                  Select plan type
                </option>
                <option value="Single">Single</option>
                <option value="Dual">Dual</option>
                <option value="Triple">Triple</option>
              </select>
            </div>
          </div>

          {/* Course Limit */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Course Limit <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex h-12 items-center rounded-xl border bg-white px-4 ${
                errors.name
                  ? "border-red-400"
                  : "border-slate-300 focus-within:border-indigo-500"
              }`}
            >
              <input
                type="text"
                value={form.courseLimit}
                onChange={(e) => onInputChange("courseLimit", e.target.value)}
                placeholder="e.g., 10"
                className="h-full w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Plan Description - Full Width */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Plan Description <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Enter description"
            rows={4}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 resize-none ${
              errors.name
                ? "border-red-400 focus:border-red-500"
                : "border-slate-300 focus:border-indigo-500"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicPlanDetails;
