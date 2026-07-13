import React from "react";
import { Plus, Upload, Trash2 } from "lucide-react";
import { API_BASE_URL } from "@/pages/Services/api/api";
import {
  FormErrors,
  QuestionItem,
  McqQuestion,
} from "../../types";
import InputField from "../../Shared/InputField";
import TextAreaField from "../../Shared/TextAreaField";

interface MCQQuestionEditorProps {
  questions: QuestionItem[];
  formErrors: FormErrors;
  onAddQuestion: () => void;
  onBulkUpload: () => void;
  onRemoveQuestion: (id: number) => void;
  onUpdateQuestion: (
    id: number,
    field: keyof McqQuestion,
    value: any
  ) => void;
  onSaveQuestion: (question: McqQuestion) => void;
}

const MCQQuestionEditor: React.FC<MCQQuestionEditorProps> = ({
  questions,
  formErrors,
  onAddQuestion,
  onBulkUpload,
  onRemoveQuestion,
  onUpdateQuestion,
  onSaveQuestion,
}) => {
  return (
    <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[22px] font-semibold text-[#1f2937]">
          MCQ Questions
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
            Add MCQ Question
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
          No MCQ questions added yet. Click "Add MCQ Question" to get started.
        </div>
      ) : (
        <div className="space-y-5">
          {questions.map((question, index) => {
            if (question.type === "MCQ") {
              return (
                <div
                  key={question.id}
                  className="rounded-[14px] border border-[#dde1ea] bg-white p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-[#eef0ff] px-3 py-1 text-[13px] font-semibold text-[#5865f2]">
                        Question {index + 1}
                      </span>
                      <span className="rounded-full bg-[#f2f4f8] px-3 py-1 text-[13px] text-[#6b7280]">
                        MCQ
                      </span>
                      <span className="text-[13px] text-[#6b7280]">
                        {question.marks} marks
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={async () => {
                          const updatedOptions = [...question.options, "New Option"];
                          const updatedOptionIds = question.optionIds
                            ? [...question.optionIds, null]
                            : [...question.options.map(() => null), null];

                          onUpdateQuestion(question.id, "options", updatedOptions);
                          onUpdateQuestion(question.id, "optionIds", updatedOptionIds);

                          console.log("Add Option clicked! question.id:", question.id, "type of id:", typeof question.id);
                          
                          // Robust check to differentiate between a backend database ID and a client-side timestamp (Date.now())
                          const idNum = Number(question.id);
                          const isDatabaseId = !isNaN(idNum) && idNum > 0 && idNum < 1000000000000;
                          
                          console.log("isDatabaseId determined:", isDatabaseId, "parsed id:", idNum);

                          if (isDatabaseId) {
                            try {
                              const adminToken = localStorage.getItem("adminToken");
                              const headers: Record<string, string> = {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                              };
                              if (adminToken) headers["Authorization"] = `Bearer ${adminToken}`;

                              console.log(`Sending POST to: ${API_BASE_URL}/ind/mcq/admin/questions/${idNum}/options`);
                              const response = await fetch(
                                `${API_BASE_URL}/ind/mcq/admin/questions/${idNum}/options`,
                                {
                                  method: "POST",
                                  headers,
                                  body: JSON.stringify({
                                    text: "New Option",
                                    image_url: "",
                                  }),
                                }
                              );
                              if (!response.ok) {
                                const errText = await response.text();
                                console.error("Failed to add option on server:", errText);
                                alert("Failed to add option on server: " + errText);
                              } else {
                                const optionData = await response.json();
                                console.log("Successfully added option on server:", optionData);
                                const newOptionId = optionData.id || optionData.option_id || optionData.option?.id || (typeof optionData === "number" ? optionData : (typeof optionData === "string" && !isNaN(Number(optionData)) ? Number(optionData) : null));
                                if (newOptionId) {
                                  const nextOptionIds = [...updatedOptionIds];
                                  nextOptionIds[nextOptionIds.length - 1] = newOptionId;
                                  onUpdateQuestion(question.id, "optionIds", nextOptionIds);
                                }
                              }
                            } catch (err) {
                              console.error("Error calling add option API:", err);
                              alert("Error calling add option API: " + (err instanceof Error ? err.message : String(err)));
                            }
                          } else {
                            console.warn("API not hit: This question is a new question and does not have a database ID yet. Please click 'Save Question' first.");
                            alert("This question has not been saved yet! Please click the green 'Save Question' button at the bottom of this card before adding new options so it has a database ID.");
                          }
                        }}
                        className="text-[#4F39F6] hover:underline text-[14px] font-semibold flex items-center gap-1"
                        style={{ color: "#4F39F6" }}
                      >
                        +Add Option
                      </button>
                      <button
                        onClick={() => onRemoveQuestion(question.id)}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <TextAreaField
                    label="Question Text"
                    value={question.questionText}
                    onChange={(value) =>
                      onUpdateQuestion(question.id, "questionText", value)
                    }
                    placeholder="Enter your MCQ question here..."
                    rows={2}
                    error={formErrors[`questionText_${question.id}`]}
                  />

                  <div className="mt-4">
                    <label className="mb-2 block text-[13px] font-medium text-[#374151]">
                      Options
                    </label>
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex}>
                          <div className="flex items-center gap-3 w-full">
                            <div className="flex items-center gap-4 flex-1 rounded-[12px] border border-[#e1e3ea] bg-[#f9fafb] p-2 px-3 sm:px-4 focus-within:border-blue-400 focus-within:bg-white transition-all">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-[13px] font-semibold text-gray-500 shadow-sm">
                                {String.fromCharCode(65 + optionIndex)}
                              </div>
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const updatedOptions = [...question.options];
                                  updatedOptions[optionIndex] = e.target.value;
                                  onUpdateQuestion(
                                    question.id,
                                    "options",
                                    updatedOptions,
                                  );
                                }}
                                className="flex-1 bg-transparent py-1 text-[14px] text-gray-700 outline-none placeholder:text-gray-400"
                                placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQuestion(
                                    question.id,
                                    "correctAnswer",
                                    optionIndex,
                                  )
                                }
                                className={`text-[13px] font-semibold px-3 py-1 rounded-lg transition-all ${
                                  question.correctAnswer === optionIndex
                                    ? "bg-green-100 text-green-700 border border-green-300"
                                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                }`}
                              >
                                Correct
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={async () => {
                                if (question.options.length <= 2) {
                                  alert("A question must have at least 2 options.");
                                  return;
                                }

                                const optionId = question.optionIds?.[optionIndex];
                                console.log("Deleting option! optionIndex:", optionIndex, "optionId:", optionId);

                                if (optionId) {
                                  try {
                                    const adminToken = localStorage.getItem("adminToken");
                                    const headers: Record<string, string> = {};
                                    if (adminToken) headers["Authorization"] = `Bearer ${adminToken}`;

                                    console.log(`Sending DELETE to: ${API_BASE_URL}/ind/mcq/admin/options/${optionId}`);
                                    const deleteResponse = await fetch(
                                      `${API_BASE_URL}/ind/mcq/admin/options/${optionId}`,
                                      {
                                        method: "DELETE",
                                        headers,
                                      }
                                    );
                                    if (!deleteResponse.ok) {
                                      const errText = await deleteResponse.text();
                                      console.error("Failed to delete option on server:", errText);
                                      alert("Failed to delete option on server: " + errText);
                                    } else {
                                      console.log("Successfully deleted option on server");
                                    }
                                  } catch (err) {
                                    console.error("Error calling delete option API:", err);
                                  }
                                }

                                const updatedOptions = question.options.filter((_, idx) => idx !== optionIndex);
                                const updatedOptionIds = question.optionIds ? question.optionIds.filter((_, idx) => idx !== optionIndex) : undefined;
                                
                                let newCorrect = question.correctAnswer;
                                if (question.correctAnswer === optionIndex) {
                                  newCorrect = null;
                                } else if (question.correctAnswer !== null && question.correctAnswer > optionIndex) {
                                  newCorrect = question.correctAnswer - 1;
                                }

                                onUpdateQuestion(question.id, "options", updatedOptions);
                                if (updatedOptionIds) {
                                  onUpdateQuestion(question.id, "optionIds", updatedOptionIds);
                                }
                                onUpdateQuestion(question.id, "correctAnswer", newCorrect);
                              }}
                              className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          {formErrors[`option_${question.id}_${optionIndex}`] && (
                            <p className="ml-12 mt-1 text-[12px] text-red-500">
                              {formErrors[`option_${question.id}_${optionIndex}`]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-[12px] text-[#6b7280]">
                      Click "Correct" next to the correct answer option
                    </p>
                    {formErrors[`correctAnswer_${question.id}`] && (
                      <p className="mt-1 text-[12px] text-red-500">
                        {formErrors[`correctAnswer_${question.id}`]}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-end gap-3">
                    <div className="max-w-[160px]">
                      <InputField
                        label="Marks"
                        value={question.marks}
                        onChange={(value) =>
                          onUpdateQuestion(
                            question.id,
                            "marks",
                            Number(value || 0),
                          )
                        }
                        type="number"
                        error={formErrors[`marks_${question.id}`]}
                      />
                    </div>
                    <button
                      onClick={() => onSaveQuestion(question)}
                      className="flex h-[42px] items-center justify-center rounded-[10px] px-4 text-[14px] font-medium text-white"
                      style={{
                        background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                      }}
                    >
                      Save Question
                    </button>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default MCQQuestionEditor;
