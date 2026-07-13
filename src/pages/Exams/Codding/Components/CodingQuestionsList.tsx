import React from "react";
import { Plus, Upload } from "lucide-react";
import { QuestionItem, CodingQuestion, FormErrors } from "../../types";
import CodingQuestionEditor from "./CodingQuestionEditor";

interface CodingQuestionsListProps {
  questions: QuestionItem[];
  formErrors: FormErrors;
  onAddQuestion: () => void;
  onBulkUpload: () => void;
  onUpdateQuestion: (id: number, field: keyof CodingQuestion, value: string | number) => void;
  onRemoveQuestion: (id: number) => void;
  onSaveQuestion: (question: CodingQuestion) => void;
}

const CodingQuestionsList: React.FC<CodingQuestionsListProps> = ({
  questions,
  formErrors,
  onAddQuestion,
  onBulkUpload,
  onUpdateQuestion,
  onRemoveQuestion,
  onSaveQuestion,
}) => {
  const codingQuestions = questions.filter(q => q.type === "Coding");

  return (
    <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[22px] font-semibold text-[#1f2937]">
          Coding Questions
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
            onClick={onAddQuestion}
            className="flex h-[46px] items-center gap-2 rounded-[12px] px-5 text-[14px] font-medium text-white shadow-lg"
            style={{
              background: "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
            }}
          >
            <Plus size={16} />
            Add Coding Question
          </button>
        </div>
      </div>

      {formErrors.questions && (
        <p className="mb-3 text-[12px] text-red-500">
          {formErrors.questions}
        </p>
      )}

      {codingQuestions.length === 0 ? (
        <div className="flex min-h-[150px] items-center justify-center text-center text-[16px] text-[#6b7280]">
          No coding questions added yet. Click "Add Coding Question" to
          get started.
        </div>
      ) : (
        <div className="space-y-5">
          {codingQuestions.map((question, index) => (
            <CodingQuestionEditor
              key={question.id}
              question={question as CodingQuestion}
              questionIndex={index}
              onUpdateQuestion={onUpdateQuestion}
              onRemoveQuestion={onRemoveQuestion}
              onSaveQuestion={onSaveQuestion}
              formErrors={formErrors}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CodingQuestionsList;
