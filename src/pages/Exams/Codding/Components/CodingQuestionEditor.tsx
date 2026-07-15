import React from "react";
import { Trash2, Plus, Upload } from "lucide-react";
import { CodingQuestion, FormErrors } from "../../types";
import InputField from "../../Shared/InputField";
import TextAreaField from "../../Shared/TextAreaField";

interface CodingQuestionEditorProps {
  question: CodingQuestion;
  questionIndex: number;
  onUpdateQuestion: (id: number, field: keyof CodingQuestion, value: string | number) => void;
  onRemoveQuestion: (id: number) => void;
  onSaveQuestion: (question: CodingQuestion) => void;
  formErrors: FormErrors;
}

const CodingQuestionEditor: React.FC<CodingQuestionEditorProps> = ({
  question,
  questionIndex,
  onUpdateQuestion,
  onRemoveQuestion,
  onSaveQuestion,
  formErrors,
}) => {
  return (
    <div className="rounded-[14px] border border-[#dde1ea] bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#eef0ff] px-3 py-1 text-[13px] font-semibold text-[#5865f2]">
            Question {questionIndex + 1}
          </span>
          <span className="rounded-full bg-[#f2f4f8] px-3 py-1 text-[13px] text-[#374151]">
            Coding
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

      <h3 className="mb-4 text-center text-[18px] font-semibold text-[#111827]">
        Add coding question
      </h3>

      <TextAreaField
        label="Problem Statement"
        value={question.problemStatement}
        onChange={(value) =>
          onUpdateQuestion(question.id, "problemStatement", value)
        }
        placeholder="Describe the coding problem..."
        rows={4}
        error={formErrors[`problemStatement_${question.id}`]}
      />

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextAreaField
          label="Input Format"
          value={question.inputFormat}
          onChange={(value) =>
            onUpdateQuestion(question.id, "inputFormat", value)
          }
          placeholder="Describe input format..."
          rows={2}
          error={formErrors[`inputFormat_${question.id}`]}
        />
        <TextAreaField
          label="Output Format"
          value={question.outputFormat}
          onChange={(value) =>
            onUpdateQuestion(question.id, "outputFormat", value)
          }
          placeholder="Describe output format..."
          rows={2}
          error={formErrors[`outputFormat_${question.id}`]}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputField
          label="Constraints"
          value={question.constraints}
          onChange={(value) =>
            onUpdateQuestion(question.id, "constraints", value)
          }
          placeholder="e.g., 1 <= N <= 10^5"
          error={formErrors[`constraints_${question.id}`]}
        />
        <div>
          <label className="mb-2 block text-[14px] font-medium text-[#1f2937]">
            Difficulty <span className="text-red-500">*</span>
          </label>
          <select
            value={question.difficulty}
            onChange={(e) =>
              onUpdateQuestion(question.id, "difficulty", e.target.value)
            }
            className="w-full rounded-[8px] border border-[#e1e3ea] bg-white py-3 px-4 text-[14px] focus:border-[#5865f2] focus:outline-none focus:ring-1 focus:ring-[#5865f2] appearance-none"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextAreaField
          label="Sample Input"
          value={question.sampleInput}
          onChange={(value) =>
            onUpdateQuestion(question.id, "sampleInput", value)
          }
          placeholder="Sample input..."
          rows={2}
          error={formErrors[`sampleInput_${question.id}`]}
        />
        <TextAreaField
          label="Sample Output"
          value={question.sampleOutput}
          onChange={(value) =>
            onUpdateQuestion(question.id, "sampleOutput", value)
          }
          placeholder="Sample output..."
          rows={2}
          error={formErrors[`sampleOutput_${question.id}`]}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="max-w-[160px]">
          <InputField
            label="Marks"
            value={question.marks}
            onChange={(value) =>
              onUpdateQuestion(question.id, "marks", Number(value || 0))
            }
            type="number"
            error={formErrors[`marks_${question.id}`]}
          />
        </div>
        <div className="max-w-[160px]">
          <InputField
            label="Time Limit (seconds)"
            value={question.timeLimit}
            onChange={(value) =>
              onUpdateQuestion(question.id, "timeLimit", Number(value || 0))
            }
            type="number"
            placeholder="120"
            error={formErrors[`timeLimit_${question.id}`]}
          />
        </div>
        <div className="flex-1">
          <InputField
            label="Description"
            value={question.description}
            onChange={(value) =>
              onUpdateQuestion(question.id, "description", value)
            }
            placeholder="Brief description of the question"
            error={formErrors[`description_${question.id}`]}
          />
        </div>
      </div>

      {/* Test Cases Bulk Upload */}
      <div className="mt-6 border-t border-[#e1e3ea] pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-[16px] font-semibold text-[#111827]">
            Test Cases (Bulk Upload)
          </h4>
          <label className="flex cursor-pointer items-center gap-1 rounded-[8px] border border-[#e1e3ea] bg-white px-3 py-1.5 text-[13px] font-medium text-[#111827]">
            <Upload size={14} /> Upload JSON
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const parsed = JSON.parse(event.target?.result as string);
                    let cases = [];
                    if (parsed.testcases && Array.isArray(parsed.testcases)) {
                        cases = parsed.testcases;
                    } else if (Array.isArray(parsed)) {
                        cases = parsed;
                    } else {
                        alert("Invalid JSON format. Expected an array of testcases or { testcases: [...] }.");
                        return;
                    }
                    onUpdateQuestion(question.id, "testCases", cases);
                  } catch (err) {
                    alert("Failed to parse JSON file.");
                  }
                };
                reader.readAsText(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        {(!question.testCases || question.testCases.length === 0) ? (
          <p className="text-[13px] text-[#6b7280] italic">No test cases uploaded yet. Upload a JSON file to add bulk test cases.</p>
        ) : (
          <div className="rounded-[8px] bg-[#f9fafb] p-3 border border-[#e1e3ea]">
            <p className="text-[14px] font-medium text-green-600 mb-2">
              ✓ {question.testCases.length} test cases uploaded and ready.
            </p>
            <div className="max-h-40 overflow-y-auto text-[12px] bg-white border p-2 rounded">
              <pre>{JSON.stringify(question.testCases.slice(0, 3), null, 2)}</pre>
              {question.testCases.length > 3 && <p className="text-gray-500 mt-1">...and {question.testCases.length - 3} more.</p>}
            </div>
            <button
                type="button"
                className="mt-2 text-[12px] text-red-500 hover:underline"
                onClick={() => onUpdateQuestion(question.id, "testCases", [])}
            >
                Clear uploaded test cases
            </button>
          </div>
        )}
      </div>

      {/* Save Question Button */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => onSaveQuestion(question)}
          className="flex h-[44px] items-center justify-center rounded-[10px] px-6 text-[14px] font-medium text-white"
          style={{
            background: "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
          }}
        >
          Save Question
        </button>
      </div>
    </div>
  );
};

export default CodingQuestionEditor;
