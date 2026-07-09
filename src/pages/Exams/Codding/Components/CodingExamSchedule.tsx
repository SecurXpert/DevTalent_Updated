import React from "react";
import { FormErrors } from "../../types";
import InputField from "../../Shared/InputField";

interface CodingExamScheduleProps {
  startDate: string;
  endDate: string;
  isActive: boolean;
  onDateChange: (field: "startDate" | "endDate", value: string) => void;
  onActiveChange: (value: boolean) => void;
  formErrors: FormErrors;
}

const CodingExamSchedule: React.FC<CodingExamScheduleProps> = ({
  startDate,
  endDate,
  isActive,
  onDateChange,
  onActiveChange,
  formErrors,
}) => {
  return (
    <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
      <h2 className="mb-4 text-[22px] font-semibold text-[#1f2937]">
        Exam Schedule
      </h2>

      {/* Active Exam Toggle */}
      <div className="mb-4 flex items-center justify-between rounded-lg border border-[#e1e3ea] p-4">
        <div>
          <p className="text-[14px] font-medium text-[#1f2937]">Active Exam</p>
          <p className="text-[12px] text-[#6b7280]">Enable or disable this exam</p>
        </div>
        <button
          type="button"
          onClick={() => onActiveChange(!isActive)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            isActive ? 'bg-[#6366F1]' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isActive ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputField
          label="Start Date & Time"
          value={startDate}
          onChange={(value) => onDateChange("startDate", value)}
          placeholder="dd/mm/yyyy, --:--"
          error={formErrors.startDate}
          type="datetime-local"
        />
        <InputField
          label="End Date & Time"
          value={endDate}
          onChange={(value) => onDateChange("endDate", value)}
          placeholder="dd/mm/yyyy, --:--"
          error={formErrors.endDate}
          type="datetime-local"
        />
      </div> */}

    </div>
  );
};

export default CodingExamSchedule;
