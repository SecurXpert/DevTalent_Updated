import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "@/pages/Services/api/api";
import InputField from "../Shared/InputField";
import TextAreaField from "../Shared/TextAreaField";
import SelectField from "../Shared/SelectField";

interface QuestionType {
  id: number | string;
  backendId?: number;
  questionText: string;
  options: string[];
  optionIds?: (number | null)[];
  correctAnswer: number | null;
  marks: number;
}

interface MCQQuestionsSectionProps {
  questions: QuestionType[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionType[]>>;
}

const MCQQuestionsSection: React.FC<MCQQuestionsSectionProps> = ({ questions, setQuestions }) => {


  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now(), // Use Date.now() for unique frontend ID
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: null,
        marks: 1,
      },
    ]);
  };

  const removeQuestion = async (id: number | string) => {
    const questionToRemove = questions.find(q => q.id === id);

    // If it exists in backend, make API call to delete
    if (questionToRemove && questionToRemove.backendId) {
      if (!window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
        return; // Cancel deletion
      }

      try {
        const adminToken = localStorage.getItem('adminToken');
        const headers: Record<string, string> = {};
        if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

        const response = await fetch(`${API_BASE_URL}/ind/mcq/admin/questions/${questionToRemove.backendId}`, {
          method: 'DELETE',
          headers
        });

        if (!response.ok) {
          throw new Error("Delete request failed");
        }
      } catch (err) {
        console.error("Failed to delete question:", err);
        alert("Failed to delete the question from the server.");
        return; // Don't remove locally if it failed
      }
    }

    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleChange = (id: number | string, field: string, value: any) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );
  };

  const handleOptionChange = (
    id: number | string,
    optionIndex: number,
    value: string,
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
            ...q,
            options: q.options.map((opt, idx) =>
              idx === optionIndex ? value : opt,
            ),
          }
          : q,
      ),
    );
  };

  return (
    <div className="space-y-5">
      {/* MCQ Questions */}
      <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[22px] font-semibold text-[#1f2937]">
            MCQ Questions
          </h2>

          <div className="flex gap-3">
            <button
              className="flex h-[46px] items-center gap-2 rounded-[12px] px-5 text-[14px] font-medium text-white shadow-lg"
              style={{
                background: "white",
                color: "#1f2937",
                border: "1px solid #e1e3ea",
              }}
            >
              <Upload className="w-4 h-4" />
              Bulk Upload
            </button>

            <button
              onClick={addQuestion}
              className="flex h-[46px] items-center gap-2 rounded-[12px] px-5 text-[14px] font-medium text-white shadow-lg"
              style={{
                background: "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
              }}
            >
              <Plus className="w-4 h-4" />
              Add MCQ Question
            </button>
          </div>
        </div>

        {/* Questions */}
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="rounded-[14px] border border-[#dde1ea] bg-white p-4 mb-5"
          >
            {/* Top row */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#eef0ff] px-3 py-1 text-[13px] font-semibold text-[#5865f2]">
                  Question {index + 1}
                </span>
                <span className="rounded-full bg-[#f2f4f8] px-3 py-1 text-[13px] text-[#374151]">
                  MCQ
                </span>
                <span className="text-[13px] text-[#6b7280]">
                  {q.marks} marks
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={async () => {
                    const updatedOptions = [...q.options, "New Option"];
                    const updatedOptionIds = q.optionIds
                      ? [...q.optionIds, null]
                      : [...q.options.map(() => null), null];

                    handleChange(q.id, "options", updatedOptions);
                    handleChange(q.id, "optionIds", updatedOptionIds);

                    console.log("Add Option clicked in EditMcq! q.id:", q.id, "q.backendId:", q.backendId);

                    const dbId = q.backendId ||
                      (q.id && !isNaN(Number(q.id)) && Number(q.id) > 0 && Number(q.id) < 1000000000000 ? Number(q.id) : null);

                    console.log("Resolved dbId:", dbId);

                    if (dbId) {
                      try {
                        const adminToken = localStorage.getItem("adminToken");
                        const headers: Record<string, string> = {
                          "Content-Type": "application/json",
                          "Accept": "application/json",
                        };
                        if (adminToken) headers["Authorization"] = `Bearer ${adminToken}`;

                        console.log(`Sending POST to: ${API_BASE_URL}/ind/mcq/admin/questions/${dbId}/options`);
                        const response = await fetch(
                          `${API_BASE_URL}/ind/mcq/admin/questions/${dbId}/options`,
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
                            handleChange(q.id, "optionIds", nextOptionIds);
                          }
                        }
                      } catch (err) {
                        console.error("Error calling add option API:", err);
                        alert("Error calling add option API: " + (err instanceof Error ? err.message : String(err)));
                      }
                    } else {
                      console.warn("API not hit: This question is a new question and does not have a database ID yet.");
                      alert("This question does not have a database ID yet. If it is new, it will be saved to the database when you click 'Save Changes' at the bottom of the page.");
                    }
                  }}
                  className="text-[#4F39F6] hover:underline text-[14px] font-semibold flex items-center gap-1"
                  style={{ color: "#4F39F6" }}
                >
                  +Add Option
                </button>
                <Trash2
                  className="w-5 h-5 text-red-500 cursor-pointer"
                  onClick={() => removeQuestion(q.id)}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="mb-4">
              <TextAreaField
                label="Question Text"
                value={q.questionText}
                onChange={(value) => handleChange(q.id, "questionText", value)}
                placeholder="Enter the question..."
                rows={3}
              />
            </div>

            {/* Options */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Options
              </label>
              <div className="space-y-3">
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-3 w-full">
                    <div className="flex items-center gap-4 flex-1 rounded-[12px] border border-[#e1e3ea] bg-[#f9fafb] p-2 px-3 sm:px-4 focus-within:border-blue-400 focus-within:bg-white transition-all">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-[13px] font-semibold text-gray-500 shadow-sm">
                        {String.fromCharCode(65 + optionIndex)}
                      </div>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(q.id, optionIndex, e.target.value)}
                        className="flex-1 bg-transparent py-1 text-[14px] text-gray-700 outline-none placeholder:text-gray-400"
                        placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleChange(q.id, "correctAnswer", optionIndex)}
                        className={`text-[13px] font-semibold px-3 py-1 rounded-lg transition-all ${q.correctAnswer === optionIndex
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
                        if (q.options.length <= 2) {
                          alert("A question must have at least 2 options.");
                          return;
                        }

                        const optionId = q.optionIds?.[optionIndex];
                        console.log("Deleting option in EditMcq! optionIndex:", optionIndex, "optionId:", optionId);

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

                        const updatedOptions = q.options.filter((_, idx) => idx !== optionIndex);
                        const updatedOptionIds = q.optionIds ? q.optionIds.filter((_, idx) => idx !== optionIndex) : undefined;

                        let newCorrect = q.correctAnswer;
                        if (q.correctAnswer === optionIndex) {
                          newCorrect = null;
                        } else if (q.correctAnswer !== null && q.correctAnswer > optionIndex) {
                          newCorrect = q.correctAnswer - 1;
                        }

                        handleChange(q.id, "options", updatedOptions);
                        if (updatedOptionIds) {
                          handleChange(q.id, "optionIds", updatedOptionIds);
                        }
                        handleChange(q.id, "correctAnswer", newCorrect);
                      }}
                      className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[12px] text-[#6b7280]">
                Click "Correct" next to the correct answer option
              </p>
            </div>

            {/* Marks */}
            <div className="max-w-[160px]">
              <InputField
                label="Marks"
                value={q.marks.toString()}
                onChange={(value) =>
                  handleChange(q.id, "marks", Number(value || 0))
                }
                type="number"
              />
            </div>
          </div>
        ))}
      </div>

   
    </div>
  );
};

interface EditMcqProps {
  examData?: any;
  onSave?: (data: any) => void;
}

const EditMcq: React.FC<EditMcqProps> = ({
  examData: propExamData,
  onSave,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get exam data from either props or navigation state
  const examData = propExamData || location.state?.examData;

  const [questions, setQuestions] = useState<QuestionType[]>([]);

  const [formData, setFormData] = useState({
    examName: examData?.title || examData?.examName || "",
    course: examData?.course || "Technical",
    description: examData?.description || "",
    duration: parseInt(examData?.duration) || 120,
    totalMarks: examData?.totalMarks || 100,
    passingScore: examData?.passingScore || 60,
    examType: examData?.type || examData?.examType || "MCQ Only",
  });

  // Fetch existing questions when examData is available
  useEffect(() => {
    const fetchQuestions = async () => {
      const examId = examData?.id || examData?.exam_id;
      if (!examId) return;

      try {
        const adminToken = localStorage.getItem('adminToken');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

        const response = await fetch(`${API_BASE_URL}/ind/mcq/admin/exams/${examId}/questions?limit=500`, { headers });

        if (response.ok) {
          const data = await response.json();
          const fetchedQuestions = data.items || data;

          if (fetchedQuestions && fetchedQuestions.length > 0) {
            const mappedQuestions = fetchedQuestions.map((q: any) => ({
              id: q.id,
              backendId: q.id,
              questionText: q.text || q.questionText || "",
              options: q.options ? q.options.map((opt: any) => opt.text || opt) : ["", "", "", ""],
              optionIds: q.options ? q.options.map((opt: any) => opt.id || null) : [null, null, null, null],
              correctAnswer: q.correct_index ?? null,
              marks: q.marks || 1
            }));
            setQuestions(mappedQuestions);
          } else {
            // Add a default empty question if none exist
            setQuestions([{
              id: Date.now(),
              questionText: "",
              options: ["", "", "", ""],
              correctAnswer: null,
              marks: 1,
            }]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch existing questions", err);
      }
    };

    fetchQuestions();
  }, [examData]);

  // Update form when examData changes
  useEffect(() => {
    if (examData) {
      setFormData({
        examName: examData?.title || examData?.examName || "",
        course: examData?.course || "Technical",
        description: examData?.description || "",
        duration: parseInt(examData?.duration) || 120,
        totalMarks: examData?.totalMarks || 100,
        passingScore: examData?.passingScore || 60,
        examType: examData?.type || examData?.examType || "MCQ Only",
      });
    }
  }, [examData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      };

      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      const examId = examData?.id || examData?.exam_id;
      if (!examId) {
        console.error("No exam ID found to update");
        if (onSave) onSave(formData);
        navigate("/exams");
        return;
      }

      const requestBody = {
        title: formData.examName,
        description: formData.description,
        duration_minutes: formData.duration,
        is_active: examData?.status === "Active" || examData?.is_active !== false,
        total_marks: formData.totalMarks,
        pass_percentage: formData.passingScore
      };

      const response = await fetch(`${API_BASE_URL}/ind/mcq/admin/exams/${examId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        // Save questions
        for (const question of questions) {
          if (!question.questionText.trim()) continue; // Skip empty questions

          const questionBody = {
            text: question.questionText,
            image_url: "",
            options: question.options.map(option => ({
              text: option,
              image_url: ""
            })),
            correct_index: question.correctAnswer,
            subject_name: "MCQ",
            marks: Number(question.marks) || 1,
          };

          try {
            if (question.backendId) {
              // Update existing question
              await fetch(`${API_BASE_URL}/ind/mcq/admin/questions/${question.backendId}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(questionBody),
              });
            } else {
              // Create new question
              await fetch(`${API_BASE_URL}/ind/mcq/admin/exams/${examId}/questions`, {
                method: 'POST',
                headers,
                body: JSON.stringify(questionBody),
              });
            }
          } catch (err) {
            console.error("Failed to save a question:", err);
          }
        }

        if (onSave) {
          onSave(formData);
        }
        navigate("/exams");
      } else {
        const errData = await response.json();
        console.error("Failed to update exam:", errData);
        alert("Failed to update exam. Please try again.");
      }
    } catch (error) {
      console.error("Error updating exam:", error);
      alert("An error occurred while updating the exam.");
    }
  };

  const handleBack = () => {
    navigate("/exams");
  };

  return (
    <div className="min-h-screen bg-[#f3f2fb] px-2 py-3 sm:px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px] lg:max-w-[1440px]">
        {/* Back */}
        <button
          onClick={handleBack}
          className="mb-3 flex items-center gap-2 text-[14px] text-[#5b5cf0]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Exams
        </button>

        {/* Header */}
        <h1 className="text-[28px] font-bold text-[#1f2937]">
          Edit MCQ Exam Details
        </h1>
        <p className="mb-4 text-[14px] text-[#6b7280]">
          Update exam information and settings
        </p>

        <div className="space-y-5">
          {/* Card */}
          <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
            <h2 className="mb-4 text-[22px] font-semibold text-[#1f2937]">
              Basic Exam Details
            </h2>

            <div className="space-y-4">
              <InputField
                label="Exam Name"
                value={formData.examName}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, examName: value }))
                }
                placeholder="e.g., Data Structures MCQ Exam"
              />

              <SelectField
                label="Select Course"
                value={formData.course}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, course: value }))
                }
                options={["Technical", "Non-Technical"]}
              />

              <TextAreaField
                label="Exam Description"
                value={formData.description}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, description: value }))
                }
                placeholder="Describe the exam objectives and content..."
                rows={4}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Duration (minutes)"
                  value={formData.duration.toString()}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: parseInt(value) || 120,
                    }))
                  }
                  type="number"
                />
                <InputField
                  label="Total Marks"
                  value={formData.totalMarks.toString()}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      totalMarks: parseInt(value) || 100,
                    }))
                  }
                  type="number"
                />
                <InputField
                  label="Passing Score (%)"
                  value={formData.passingScore.toString()}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      passingScore: parseInt(value) || 60,
                    }))
                  }
                  type="number"
                />
                <SelectField
                  label="Exam Type"
                  value={formData.examType}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, examType: value }))
                  }
                  options={["MCQ Only"]}
                />
              </div>
            </div>
          </div>

          {/* MCQ Questions Section */}
          <MCQQuestionsSection questions={questions} setQuestions={setQuestions} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-y-3 sm:gap-x-3 pb-6 sm:text-left text-center">
            <button
              onClick={handleBack}
              className="flex items-center justify-center sm:justify-start rounded-[8px] border border-[#d7dce5] bg-white px-5 py-3 text-[#111827]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center justify-center sm:justify-start gap-4 rounded-[8px] px-5 py-3 text-white shadow-lg"
              style={{
                background: "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMcq;
