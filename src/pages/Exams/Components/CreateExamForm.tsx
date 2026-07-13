import React from "react";
import { ChevronLeft, Plus, Upload, Trash2, Check } from "lucide-react";
import {
  FormErrors,
  QuestionItem,
  McqQuestion,
  CodingQuestion,
  ImageAnalysisQuestion,
  ExamType,
} from "../types";

type FormType = {
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
import SelectField from "../Shared/SelectField";
import InputField from "../Shared/InputField";
import TextAreaField from "../Shared/TextAreaField";

interface CreateExamFormProps {
  form: FormType;
  formErrors: FormErrors;
  questions: QuestionItem[];
  onFormChange: (updates: Partial<FormType>) => void;
  onQuestionsChange: (questions: QuestionItem[]) => void;
  onBack: () => void;
  onPublishExam: () => void;
  onSaveDraft: () => void;
  onAddMcqQuestion: () => void;
  onAddCodingQuestion: () => void;
  onAddImageQuestion: () => void;
  onRemoveQuestion: (id: number) => void;
  onUpdateMcqQuestion: (
    id: number,
    field: keyof McqQuestion,
    value: string | number | null | string[],
  ) => void;
  onUpdateCodingQuestion: (
    id: number,
    field: keyof CodingQuestion,
    value: string | number | string[],
  ) => void;
  onUpdateImageAnalysisQuestion: (
    id: number,
    field: keyof ImageAnalysisQuestion,
    value: string | number | null,
  ) => void;
  onBulkUpload: () => void;
}

const CreateExamForm: React.FC<CreateExamFormProps> = ({
  form,
  formErrors,
  questions,
  onFormChange,
  onQuestionsChange,
  onBack,
  onPublishExam,
  onSaveDraft,
  onAddMcqQuestion,
  onAddCodingQuestion,
  onAddImageQuestion,
  onRemoveQuestion,
  onUpdateMcqQuestion,
  onUpdateCodingQuestion,
  onUpdateImageAnalysisQuestion,
  onBulkUpload,
}) => {
  const handleFormChange = (field: string, value: any) => {
    onFormChange({ [field]: value });
  };

  return (
    <div className="min-h-screen bg-[#f3f2fb] px-2 py-3 sm:px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px] lg:max-w-[1440px]">
        <button
          onClick={onBack}
          className="mb-3 flex items-center gap-2 text-[14px] text-[#5b5cf0]"
        >
          <ChevronLeft size={16} />
          Back to Exams
        </button>

        <h1 className="text-[28px] font-bold text-[#1f2937]">
          Create New Exam
        </h1>
        <p className="mb-4 text-[14px] text-[#6b7280]">
          Set up a new exam with questions and settings
        </p>

        <div className="space-y-5">
          {/* Basic Exam Details */}
          <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
            <h2 className="mb-4 text-[22px] font-semibold text-[#1f2937]">
              Basic Exam Details
            </h2>

            <div className="space-y-4">
              <InputField
                label="Exam Name"
                value={form.examName}
                onChange={(value) => handleFormChange("examName", value)}
                placeholder="e.g., Data Structures Final Exam"
                error={formErrors.examName}
              />

              <TextAreaField
                label="Exam Description"
                value={form.description}
                onChange={(value) => handleFormChange("description", value)}
                placeholder="Describe the exam objectives and content..."
                error={formErrors.description}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Duration (minutes)"
                  value={form.duration}
                  onChange={(value) => handleFormChange("duration", value)}
                  placeholder="120"
                  error={formErrors.duration}
                  type="number"
                />
                <InputField
                  label="Total Marks"
                  value={form.totalMarks}
                  onChange={(value) => handleFormChange("totalMarks", value)}
                  placeholder="100"
                  error={formErrors.totalMarks}
                  type="number"
                />
                <InputField
                  label="Passing Score (%)"
                  value={form.passingScore}
                  onChange={(value) => handleFormChange("passingScore", value)}
                  placeholder="60"
                  error={formErrors.passingScore}
                  type="number"
                />
                <SelectField
                  label="Exam Type"
                  value={form.examType}
                  onChange={(value) => handleFormChange("examType", value)}
                  options={[
                    "MCQ Only",
                    "Coding Only",
                    "Mixed",
                    "Image Analysis",
                  ]}
                  error={formErrors.examType}
                />
              </div>
            </div>
          </div>

          {/* Exam Schedule */}
          <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
            <h2 className="mb-4 text-[22px] font-semibold text-[#1f2937]">
              Exam Schedule
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                label="Start Date & Time"
                value={form.startDate}
                onChange={(value) => handleFormChange("startDate", value)}
                placeholder="dd/mm/yyyy, --:--"
                error={formErrors.startDate}
                type="datetime-local"
              />
              <InputField
                label="End Date & Time"
                value={form.endDate}
                onChange={(value) => handleFormChange("endDate", value)}
                placeholder="dd/mm/yyyy, --:--"
                error={formErrors.endDate}
                type="datetime-local"
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[22px] font-semibold text-[#1f2937]">
                Questions
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={onBulkUpload}
                  className="flex h-[46px] items-center gap-2 rounded-[12px] px-5 text-[14px] font-medium text-white shadow-lg"
                  style={{
                    background: "white",
                    color: "#1f2937",
                    border: "1px solid #e1e3ea",
                  }}
                >
                  <Upload size={16} />
                  Bulk Upload
                </button>
                <button
                  onClick={onAddMcqQuestion}
                  className="flex h-[46px] items-center gap-2 rounded-[12px] px-5 text-[14px] font-medium text-white shadow-lg"
                  style={{
                    background:
                      "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
                  }}
                >
                  <Plus size={16} />
                  Add MCQ Question
                </button>
                <button
                  onClick={onAddCodingQuestion}
                  className="flex h-[46px] items-center gap-2 rounded-[12px] px-5 text-[14px] font-medium text-white shadow-lg"
                  style={{
                    background:
                      "linear-gradient(90deg, #059669 0%, #10b981 100%)",
                  }}
                >
                  <Plus size={16} />
                  Add Coding Question
                </button>
                <button
                  onClick={onAddImageQuestion}
                  className="flex h-[46px] items-center gap-2 rounded-[12px] px-5 text-[14px] font-medium text-white shadow-lg"
                  style={{
                    background:
                      "linear-gradient(90deg, #dc2626 0%, #ef4444 100%)",
                  }}
                >
                  <Plus size={16} />
                  Add Image Question
                </button>
              </div>
            </div>

            {formErrors.questions && (
              <p className="mb-3 text-[12px] text-red-500">
                {formErrors.questions}
              </p>
            )}

            {questions.length === 0 ? (
              <div className="flex min-h-[150px] items-center justify-center text-center text-[16px] text-[#6b7280]">
                No questions added yet. Click "Add Question" to get started.
              </div>
            ) : (
              <div className="space-y-5">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="rounded-[14px] border border-[#dde1ea] bg-white p-4"
                  >
                    {/* Question content would be rendered here based on question type */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-[#eef0ff] px-3 py-1 text-[13px] font-semibold text-[#5865f2]">
                          Question {index + 1}
                        </span>
                        <span className="rounded-full bg-[#f2f4f8] px-3 py-1 text-[13px] text-[#6b7280]">
                          {question.type}
                        </span>
                        <span className="text-[13px] text-[#6b7280]">
                          {question.marks} marks
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveQuestion(question.id)}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <TextAreaField
                      label="Question Text"
                      value={
                        question.type === "MCQ" ||
                        question.type === "Image Analysis"
                          ? question.questionText
                          : question.type === "Coding"
                            ? question.problemStatement
                            : ""
                      }
                      onChange={(value) => {
                        if (question.type === "MCQ") {
                          onUpdateMcqQuestion(
                            question.id,
                            "questionText",
                            value,
                          );
                        } else if (question.type === "Coding") {
                          onUpdateCodingQuestion(
                            question.id,
                            "problemStatement",
                            value,
                          );
                        } else if (question.type === "Image Analysis") {
                          onUpdateImageAnalysisQuestion(
                            question.id,
                            "questionText",
                            value,
                          );
                        }
                      }}
                      placeholder="Enter your question here..."
                      rows={2}
                      error={formErrors[`questionText_${question.id}`]}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-y-3 sm:gap-x-3 pb-6 sm:text-left text-center">
            <button
              onClick={onPublishExam}
              className="inline-flex items-center justify-center sm:justify-start gap-4 rounded-[8px] px-5 py-3 text-white shadow-lg"
              style={{
                background: "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
              }}
            >
              <Check size={16} />
              Publish Exam
            </button>
            <button
              onClick={onSaveDraft}
              className="flex items-center justify-center sm:justify-start rounded-[8px] border border-[#d7dce5] bg-white px-5 py-3 text-[#111827]"
            >
              Save as Draft
            </button>
            <button
              onClick={onBack}
              className="flex items-center justify-center sm:justify-start rounded-[8px] border border-[#d7dce5] bg-white px-5 py-3 text-[#111827]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExamForm;
