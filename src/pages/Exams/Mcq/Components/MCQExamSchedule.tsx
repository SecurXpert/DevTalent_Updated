import React from "react";
import { FormErrors } from "../../types";
import InputField from "../../Shared/InputField";

interface MCQExamScheduleProps {
  startDate: string;
  endDate: string;
  isActive: boolean;
  onDateChange: (field: "startDate" | "endDate", value: string) => void;
  onActiveChange: (value: boolean) => void;
  onSave: () => void;
  formErrors: FormErrors;
}

const MCQExamSchedule: React.FC<MCQExamScheduleProps> = ({
  startDate,
  endDate,
  isActive,
  onDateChange,
  onActiveChange,
  onSave,
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

  

      {/* Save Button */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onSave}
          className="flex h-[44px] items-center justify-center rounded-[10px] px-6 text-[14px] font-medium text-white"
          style={{
            background: "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default MCQExamSchedule;
