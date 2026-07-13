import React from "react";
import { ExamType, FormErrors } from "../../types";
import InputField from "../../Shared/InputField";
import TextAreaField from "../../Shared/TextAreaField";
import SelectField from "../../Shared/SelectField";

interface CodingCreateFormProps {
  form: {
    examName: string;
    description: string;
    duration: string;
    totalMarks: string;
    passingScore: string;
    examType: ExamType;
  };
  onFormChange: (field: string, value: string | ExamType) => void;
  formErrors: FormErrors;
}

const CodingCreateForm: React.FC<CodingCreateFormProps> = ({
  form,
  onFormChange,
  formErrors,
}) => {
  return (
    <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
      <h2 className="mb-4 text-[22px] font-semibold text-[#1f2937]">
        Basic Exam Details
      </h2>

      <div className="space-y-4">
        <InputField
          label="Exam Name"
          value={form.examName}
          onChange={(value) => onFormChange("examName", value)}
          placeholder="e.g., Data Structures Coding Exam"
          error={formErrors.examName}
        />

        <TextAreaField
          label="Exam Description"
          value={form.description}
          onChange={(value) => onFormChange("description", value)}
          placeholder="Describe the coding exam objectives and content..."
          error={formErrors.description}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Duration (minutes)"
            value={form.duration}
            onChange={(value) => onFormChange("duration", value)}
            placeholder="120"
            error={formErrors.duration}
            type="number"
          />
          <InputField
            label="Total Marks"
            value={form.totalMarks}
            onChange={(value) => onFormChange("totalMarks", value)}
            placeholder="100"
            error={formErrors.totalMarks}
            type="number"
          />
          <InputField
            label="Passing Score (%)"
            value={form.passingScore}
            onChange={(value) => onFormChange("passingScore", value)}
            placeholder="60"
            error={formErrors.passingScore}
            type="number"
          />
          <SelectField
            label="Exam Type"
            value={form.examType}
            onChange={(value) => onFormChange("examType", value as ExamType)}
            options={["MCQ Only", "Coding Only", "Image Analysis"]}
            error={formErrors.examType}
          />
        </div>
      </div>
    </div>
  );
};

export default CodingCreateForm;
