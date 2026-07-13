import React from "react";
import { Search, ChevronDown } from "lucide-react";

interface SearchAndFilterProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="rounded-[14px] border border-[#e1e3ea] bg-white p-3 sm:p-4 lg:p-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_230px] lg:grid-cols-[1fr_280px]">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exams by name or type..."
            className="h-[44px] w-full rounded-[10px] border border-[#d9dde5] bg-white pl-8 pr-4 text-[14px] outline-none lg:h-[35px] lg:text-[15px]"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-[44px] w-full appearance-none rounded-[10px] border border-[#d9dde5] bg-white px-4 pr-10 text-[14px] outline-none lg:h-[35px] lg:text-[15px]"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Draft</option>
            <option>Closed</option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
