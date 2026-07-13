import React from "react";
import { Filter, Download } from "lucide-react";
import FilterModal from "../../components/filtermodal";

type DashboardHeaderProps = {
  onToggleFilters: () => void;
  showFilters: boolean;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onToggleFilters,
  showFilters,
}) => {
  return (
    <div className="bg-[#f5f3ff]">
      <div className="flex flex-col">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="font-semibold leading-tight text-[#182033] text-[29px]">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-[10px] sm:text-[11px] laptop:text-[13px] xl:text-[14px] text-[#5d677a]">
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onToggleFilters}
              className="flex h-[30px] items-center gap-1 border-2 border-gray-100 rounded-[9px] bg-white px-2 text-[11px] font-medium text-black shadow sm:h-[32px] sm:px-3"
            >
              <Filter size={15} />
              Filters
            </button>

            <button className="flex h-[30px] items-center gap-2 rounded-[8px] bg-gradient-to-r from-[#6d28d9] to-[#9333ea] px-1 text-[11px] font-medium text-white shadow-[0_8px_20px_rgba(124,58,237,0.28)] sm:h-[30px] sm:px-2">
              <Download size={15} />
              Export Report
            </button>
          </div>
        </div>

        <FilterModal isOpen={showFilters} />
      </div>
    </div>
  );
};

export default DashboardHeader;
