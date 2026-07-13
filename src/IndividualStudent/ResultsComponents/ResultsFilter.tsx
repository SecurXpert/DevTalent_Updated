import React from "react";
import { Search, BookOpen, Filter, ArrowUpDown } from "lucide-react";

interface ResultsFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  courseFilter: string;
  setCourseFilter: (value: string) => void;
  uniqueCourses: string[];
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
}

export const ResultsFilter: React.FC<ResultsFilterProps> = ({
  searchTerm,
  setSearchTerm,
  courseFilter,
  setCourseFilter,
  uniqueCourses,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border flex flex-wrap items-center gap-4 mb-6">
      <div className="flex-1 min-w-[200px] relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search exams or courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <BookOpen className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="appearance-none pl-9 pr-8 py-2 border rounded-xl text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer min-w-[140px]"
          >
            <option value="All Courses">All Courses</option>
            {uniqueCourses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div className="relative">
          <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none pl-9 pr-8 py-2 border rounded-xl text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer min-w-[130px]"
          >
            <option value="All Types">All Types</option>
            <option value="MCQ">MCQ</option>
            <option value="Coding">Coding</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div className="relative">
          <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-9 pr-8 py-2 border rounded-xl text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer min-w-[130px]"
          >
            <option value="All Status">All Status</option>
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div className="relative">
          <ArrowUpDown className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="appearance-none pl-9 pr-8 py-2 border border-purple-200 text-purple-600 rounded-xl text-sm hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer min-w-[120px]"
          >
            <option value="Latest">Latest</option>
            <option value="Oldest">Oldest</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-purple-600">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
