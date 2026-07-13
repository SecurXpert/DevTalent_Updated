import React from "react";
import { Users, FileText, DollarSign, Clock3, BookOpen } from "lucide-react";

type FormState = {
  name: string;
  studentLimit: string;
  examLimit: string;
  price: string;
  duration: string;
  description: string;
  courses: string[];
};

type FormErrors = {
  name?: string;
  studentLimit?: string;
  examLimit?: string;
  price?: string;
  duration?: string;
  description?: string;
  courses?: string;
};

type SubscriptionFormProps = {
  form: FormState;
  errors: FormErrors;
  onInputChange: (key: keyof FormState, value: string | string[]) => void;
  onToggleCourse: (course: string) => void;
  onSelectAllCourses: () => void;
  availableCourses: string[];
  selectedCoursesText: string;
};

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  form,
  errors,
  onInputChange,
  onToggleCourse,
  onSelectAllCourses,
  availableCourses,
  selectedCoursesText,
}) => {
  return (
    <div className="space-y-6">
      {/* Plan Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Plan Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => onInputChange("name", e.target.value)}
          placeholder="e.g., Professional, Enterprise, Basic"
          className={`h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 ${
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

      {/* Student and Exam Limits */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Student Limit <span className="text-red-500">*</span>
          </label>
          <div className={`flex h-12 items-center gap-2 rounded-xl border bg-white px-4 ${
            errors.studentLimit ? "border-red-400" : "border-slate-300 focus-within:border-indigo-500"
          }`}>
            <Users size={18} className="text-slate-400" />
            <input
              type="text"
              value={form.studentLimit}
              onChange={(e) => onInputChange("studentLimit", e.target.value)}
              placeholder="100"
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Enter "0" for unlimited students
          </p>
          {errors.studentLimit && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {errors.studentLimit}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Exam Limit <span className="text-red-500">*</span>
          </label>
          <div className={`flex h-12 items-center gap-2 rounded-xl border bg-white px-4 ${
            errors.examLimit ? "border-red-400" : "border-slate-300 focus-within:border-indigo-500"
          }`}>
            <FileText size={18} className="text-slate-400" />
            <input
              type="text"
              value={form.examLimit}
              onChange={(e) => onInputChange("examLimit", e.target.value)}
              placeholder="50"
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Enter "0" for unlimited exams
          </p>
          {errors.examLimit && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {errors.examLimit}
            </p>
          )}
        </div>
      </div>

      {/* Price and Duration */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Price (USD) <span className="text-red-500">*</span>
          </label>
          <div className={`flex h-12 items-center gap-2 rounded-xl border bg-white px-4 ${
            errors.price ? "border-red-400" : "border-slate-300 focus-within:border-indigo-500"
          }`}>
            <span className="text-slate-400">$</span>
            <input
              type="text"
              value={form.price}
              onChange={(e) => onInputChange("price", e.target.value)}
              placeholder="49"
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {errors.price}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Billing Duration <span className="text-red-500">*</span>
          </label>
          <div className={`flex h-12 items-center gap-2 rounded-xl border bg-white px-4 ${
            errors.duration ? "border-red-400" : "border-slate-300 focus-within:border-indigo-500"
          }`}>
            <Clock3 size={18} className="text-slate-400" />
            <select
              value={form.duration}
              onChange={(e) => onInputChange("duration", e.target.value)}
              className="h-full w-full appearance-none bg-transparent text-sm outline-none"
            >
              <option value="">Select Duration</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          {errors.duration && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {errors.duration}
            </p>
          )}
        </div>
      </div>

      {/* Plan Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Plan Description
        </label>
        <textarea
          rows={5}
          value={form.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="Describe key features and benefits of this plan..."
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 ${
            errors.description
              ? "border-red-400 focus:border-red-500"
              : "border-slate-300 focus:border-indigo-500"
          }`}
        />
        {errors.description && (
          <p className="mt-2 text-xs font-medium text-red-500">
            {errors.description}
          </p>
        )}
      </div>

      {/* Courses Selection */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Available Courses
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {form.courses.map((course) => (
            <span
              key={course}
              className="inline-flex items-center gap-1 rounded-md bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700"
            >
              <BookOpen size={12} />
              {course}
            </span>
          ))}
          <button
            type="button"
            onClick={onSelectAllCourses}
            className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
          >
            +{availableCourses.length - form.courses.length}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          {selectedCoursesText}
        </p>
        {errors.courses && (
          <p className="mt-1 text-xs font-medium text-red-500">
            {errors.courses}
          </p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionForm;
