import React, { useState } from "react";
import { Trash2, Plus, Upload, Terminal, Copy, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { CodingQuestion, FormErrors, TestCase } from "../../types";
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
  const [expandedCases, setExpandedCases] = useState<number[]>([0]);

  const toggleExpand = (index: number) => {
    setExpandedCases((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const updateTestCase = (index: number, field: keyof TestCase, value: any) => {
    const updatedTestCases = [...(question.testCases || [])];
    updatedTestCases[index] = { ...updatedTestCases[index], [field]: value };
    onUpdateQuestion(question.id, "testCases", updatedTestCases);
  };

  const removeTestCase = (index: number) => {
    const updatedTestCases = [...(question.testCases || [])];
    updatedTestCases.splice(index, 1);
    onUpdateQuestion(question.id, "testCases", updatedTestCases);
  };

  const copyTestCase = (index: number) => {
    const testCases = question.testCases || [];
    const tcToCopy = testCases[index];
    const updatedTestCases = [...testCases, { ...tcToCopy }];
    onUpdateQuestion(question.id, "testCases", updatedTestCases);
  };

  const addTestCase = () => {
    const updatedTestCases = [...(question.testCases || []), { input_data: "", expected_output: "", is_hidden: false, weightage: 20, time_limit: 2 }];
    onUpdateQuestion(question.id, "testCases", updatedTestCases);
    setExpandedCases((prev) => [...prev, updatedTestCases.length - 1]);
  };

  const testCasesList = question.testCases || [];
  const sampleCount = testCasesList.filter(tc => !tc.is_hidden).length;
  const hiddenCount = testCasesList.filter(tc => tc.is_hidden).length;
  const totalWeightage = testCasesList.reduce((acc, tc) => acc + (Number(tc.weightage) || 0), 0);
  const targetPoints = Number(question.marks) || 100;
  const progressPercent = Math.min((totalWeightage / targetPoints) * 100, 100);

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

      {/* Test Cases Enhanced UI */}
      <div className="mt-6 border-t border-[#e1e3ea] pt-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex gap-2">
            <div className="flex h-[24px] w-[24px] items-center justify-center rounded-md bg-[#f4f2ff] text-[#4f39f6]">
              <Terminal size={14} />
            </div>
            <div>
              <h4 className="text-[15px] font-semibold text-[#111827]">Test Cases</h4>
              <p className="text-[13px] text-[#6b7280]">Add hidden and sample test cases used to evaluate the submitted solution.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-green-50 px-3 py-1 text-[12px] font-medium text-green-600 border border-green-200">
              {sampleCount} sample
            </span>
            <span className="rounded-full bg-purple-50 px-3 py-1 text-[12px] font-medium text-purple-600 border border-purple-200">
              {hiddenCount} hidden
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#4F39F6] to-[#4F39F6]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[12px] font-medium text-gray-500 min-w-max">
            {totalWeightage} / {targetPoints} pts allocated
          </span>
        </div>

        {/* Test cases list */}
        <div className="space-y-3">
          {testCasesList.map((tc, index) => {
            const isExpanded = expandedCases.includes(index);
            const isHidden = tc.is_hidden;
            const numberColor = isHidden ? "text-purple-600 bg-purple-50" : "text-green-600 bg-green-50";
            const badgeColor = isHidden ? "text-purple-600 bg-purple-50 border-purple-200" : "text-green-600 bg-green-50 border-green-200";
            
            return (
              <div key={index} className="rounded-xl border border-[#e1e3ea] bg-white overflow-hidden transition-all duration-200">
                {/* Header */}
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-[24px] w-[24px] items-center justify-center rounded-full text-[12px] font-semibold ${numberColor}`}>
                      {index + 1}
                    </div>
                    <span className="text-[14px] font-semibold text-[#111827]">
                      Test Case {index + 1} {isHidden ? "(Edge)" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${badgeColor}`}>
                      {isHidden ? "Hidden" : "Sample"}
                    </span>
                    <span className="text-[13px] text-gray-400 font-medium">
                      {tc.weightage || 0} pts
                    </span>
                    <div className="flex items-center gap-2 text-gray-400">
                      <button 
                        onClick={(e) => { e.stopPropagation(); copyTestCase(index); }}
                        className="hover:text-gray-600 p-1"
                      >
                        <Copy size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeTestCase(index); }}
                        className="hover:text-red-500 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="ml-2">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-gray-100 mt-2">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
                      <div>
                        <label className="mb-2 block text-[13px] font-medium text-[#374151]">Input</label>
                        <textarea
                          value={tc.input_data}
                          onChange={(e) => updateTestCase(index, "input_data", e.target.value)}
                          placeholder="Enter test case input..."
                          className="w-full rounded-[10px] border border-[#e1e3ea] bg-[#f9fafb] p-3 text-[13px] focus:border-[#4f39f6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4f39f6] min-h-[120px]"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-[13px] font-medium text-[#374151]">Expected Output</label>
                        <textarea
                          value={tc.expected_output}
                          onChange={(e) => updateTestCase(index, "expected_output", e.target.value)}
                          placeholder="Enter expected output..."
                          className="w-full rounded-[10px] border border-[#e1e3ea] bg-[#f9fafb] p-3 text-[13px] focus:border-[#4f39f6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4f39f6] min-h-[120px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-12 mt-6">
                      <div className="md:col-span-6">
                        <label className="mb-2 block text-[13px] font-medium text-[#374151]">Visibility</label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => updateTestCase(index, "is_hidden", false)}
                            className={`flex flex-1 items-center gap-2 rounded-[24px] border py-2 px-4 text-[13px] transition-colors ${
                              !tc.is_hidden
                                ? "border-green-500 bg-green-50 text-green-700"
                                : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            <div className={`h-4 w-4 rounded-full border-[4px] ${!tc.is_hidden ? "border-green-500" : "border-gray-300"}`} />
                            Sample (Visible to Student)
                          </button>
                          <button
                            type="button"
                            onClick={() => updateTestCase(index, "is_hidden", true)}
                            className={`flex flex-1 items-center gap-2 rounded-[24px] border py-2 px-4 text-[13px] transition-colors ${
                              tc.is_hidden
                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            <div className={`h-4 w-4 rounded-full border-[4px] ${tc.is_hidden ? "border-purple-500" : "border-gray-300"}`} />
                            Hidden (Evaluation Only)
                          </button>
                        </div>
                      </div>

                      <div className="md:col-span-3">
                        <label className="mb-2 block text-[13px] font-medium text-[#374151]">Weightage (Marks)</label>
                        <input
                          type="number"
                          value={tc.weightage || ''}
                          onChange={(e) => updateTestCase(index, "weightage", Number(e.target.value))}
                          className="w-full rounded-[24px] border border-[#e1e3ea] bg-[#f9fafb] px-4 py-2 text-[13px] focus:border-[#4f39f6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4f39f6]"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="mb-2 block text-[13px] font-medium text-[#374151]">Time Limit (sec)</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={tc.time_limit || ''}
                            onChange={(e) => updateTestCase(index, "time_limit", Number(e.target.value))}
                            className="w-full rounded-[24px] border border-[#e1e3ea] bg-[#f9fafb] pl-4 pr-10 py-2 text-[13px] focus:border-[#4f39f6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4f39f6]"
                          />
                          <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={addTestCase}
            className="flex items-center gap-1 rounded-full bg-[#4f39f6] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#4330d3] transition-colors self-start sm:self-auto"
          >
            <Plus size={16} /> Add Test Case
          </button>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-[12px] text-gray-400">Bulk upload:</span>
            
            <label className="flex cursor-pointer items-center gap-1 rounded-full border border-[#e1e3ea] bg-white px-3 py-1.5 text-[12px] font-medium text-[#374151] hover:bg-gray-50 transition-colors">
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
                      
                      const mappedCases = cases.map((c: any) => ({
                         input_data: c.input_data || c.input || "",
                         expected_output: c.expected_output || c.output || c.expectedOutput || "",
                         is_hidden: c.is_hidden !== undefined ? c.is_hidden : (c.isHidden !== undefined ? c.isHidden : false),
                         weightage: c.weightage || c.marks || 0,
                         time_limit: c.time_limit || c.timeLimit || 2
                      }));

                      onUpdateQuestion(question.id, "testCases", mappedCases);
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
        </div>
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
