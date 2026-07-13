import React from "react";
import {
  FormErrors,
  ExamType,
} from "../../types";
import SelectField from "../../Shared/SelectField";
import InputField from "../../Shared/InputField";
import TextAreaField from "../../Shared/TextAreaField";

type MCQFormType = {
  examName: string;
  description: string;
  duration: string;
  totalMarks: string;
  passingScore: string;
  examType: ExamType;
  startDate: string;
  endDate: string;
  supportedLanguages: string[];
  randomizeQuestions: boolean;
  enableCamera: boolean;
  enableMicrophone: boolean;
  allowReattempt: boolean;
};

interface MCQCreateFormProps {
  form: MCQFormType;
  formErrors: FormErrors;
  onFormChange: (updates: Partial<MCQFormType>) => void;
  onSave?: () => void;
}

const MCQCreateForm: React.FC<MCQCreateFormProps> = ({
  form,
  formErrors,
  onFormChange,
  onSave,
}) => {
  return (
    <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[22px] font-semibold text-[#1f2937]">
          Basic Exam Details
        </h2>
        {onSave && (
          <button
            onClick={onSave}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            Save Basic Details
          </button>
        )}
      </div>

      <div className="space-y-4">
        <InputField
          label="Exam Name"
          value={form.examName}
          onChange={(value) => onFormChange({ examName: value })}
          placeholder="e.g., General Knowledge MCQ Exam"
          error={formErrors.examName}
        />

        <TextAreaField
          label="Exam Description"
          value={form.description}
          onChange={(value) => onFormChange({ description: value })}
          placeholder="Describe the MCQ exam objectives and content..."
          error={formErrors.description}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Duration (minutes)"
            value={form.duration}
            onChange={(value) => onFormChange({ duration: value })}
            placeholder="120"
            error={formErrors.duration}
            type="number"
          />
          <InputField
            label="Total Marks"
            value={form.totalMarks}
            onChange={(value) => onFormChange({ totalMarks: value })}
            placeholder="100"
            error={formErrors.totalMarks}
            type="number"
          />
          <InputField
            label="Passing Score (%)"
            value={form.passingScore}
            onChange={(value) => onFormChange({ passingScore: value })}
            placeholder="60"
            error={formErrors.passingScore}
            type="number"
          />
          <SelectField
            label="Exam Type"
            value={form.examType}
            onChange={(value) => onFormChange({ examType: value as ExamType })}
            options={["MCQ Only"]}
            error={formErrors.examType}
          />
        </div>
      </div>
    </div>
  );
};

export default MCQCreateForm;
