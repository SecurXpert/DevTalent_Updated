import React from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExamsListHeaderProps {
  onCreateMCQExam: () => void;
  onCreateCodingExam: () => void;
}

const ExamsListHeader: React.FC<ExamsListHeaderProps> = ({
  onCreateMCQExam,
  onCreateCodingExam,
}) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start lg:items-center">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#1f2937] mb-2">
            Exam Management
          </h1>
          <p className="text-[13px] text-[#6b7280] sm:text-[14px] lg:text-[15px]">
            Create and manage all exams on the platform
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCreateMCQExam}
            className="flex h-[40px] items-center gap-2 self-start rounded-[10px] px-3 text-[13px] font-medium text-white sm:px-4 lg:h-[44px] lg:px-5 lg:text-[14px]"
            style={{
              background: "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
              boxShadow:
                "0px 5.29px 7.94px -5.29px #0000001A, 0px 13.23px 19.85px -3.97px #0000001A",
            }}
          >
            <Plus size={14} />
            Create MCQ Exam
          </button>
          <button
            onClick={onCreateCodingExam}
            className="flex h-[40px] items-center gap-2 self-start rounded-[10px] px-3 text-[13px] font-medium text-white sm:px-4 lg:h-[44px] lg:px-5 lg:text-[14px]"
            style={{
              background: "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
              boxShadow:
                "0px 5.29px 7.94px -5.29px #0000001A, 0px 13.23px 19.85px -3.97px #0000001A",
            }}
          >
            <Plus size={14} />
            Create Coding Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamsListHeader;
