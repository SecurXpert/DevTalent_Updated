import React from "react";
import {
  Search,
  FileSpreadsheet,
  Download,
  FileText,
  Calendar,
} from "lucide-react";

interface ResultsFilterBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedCourse: string;
  onCourseChange: (course: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  courses: string[];
}

function ResultsFilterBar({
  searchQuery,
  onSearchQueryChange,
  selectedCourse,
  onCourseChange,
  selectedStatus,
  onStatusChange,
  courses,
}: ResultsFilterBarProps) {
  return (
    <div className=" mt-10 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search */}
        <div className="relative w-full lg:w-[55%]">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by student name or exam..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium shadow hover:bg-green-700 transition">
            <FileSpreadsheet size={14} />
            Export Excel
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition">
            <Download size={16} />
            Export CSV
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium shadow hover:bg-red-700 transition">
            <FileText size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-5" />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Exam */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Exam</label>
          <select
            value={selectedCourse}
            onChange={(e) => onCourseChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All Courses">All Courses</option>
            {courses.map((course, idx) => (
              <option key={idx} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All Status">All Status</option>
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Date Range</label>
          <div className="relative">
            <Calendar
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Select Date Range"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsFilterBar;
