import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "@/pages/Services/api/api";
import InputField from "../Shared/InputField";
import TextAreaField from "../Shared/TextAreaField";
import SelectField from "../Shared/SelectField";
import { CodingQuestion, FormErrors } from "../types";
import CodingQuestionsList from "./Components/CodingQuestionsList";


interface EditCodingProps {
  examData?: any;
  onSave?: (data: any) => void;
}

const EditCoding: React.FC<EditCodingProps> = ({
  examData: propExamData,
  onSave,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get exam data from either props or navigation state
  const examData = propExamData || location.state?.examData;

  const [questions, setQuestions] = useState<CodingQuestion[]>([]);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    examName: examData?.title || examData?.examName || "",
    course: examData?.course || "Technical",
    description: examData?.description || "",
    duration: parseInt(examData?.duration) || 120,
    totalMarks: examData?.totalMarks || 100,
    passingScore: examData?.passingScore || 60,
    examType: examData?.type || examData?.examType || "Coding Only",
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

        const response = await fetch(`${API_BASE_URL}/ind/coding/admin/exams/${examId}/questions?limit=500`, { headers });
        
        if (response.ok) {
          const data = await response.json();
          const fetchedQuestions = data.items || data;
          
          if (fetchedQuestions && fetchedQuestions.length > 0) {
            const mappedQuestions = fetchedQuestions.map((q: any) => ({
              id: q.id,
              backendId: q.id,
              type: "Coding",
              problemStatement: q.problem_description || q.problem || "",
              inputFormat: q.input_format || q.input || "",
              outputFormat: q.output_format || q.output || "",
              constraints: q.constraints || "",
              sampleInput: q.sample_input || q.sampleInput || "",
              sampleOutput: q.sample_output || q.sampleOutput || "",
              marks: q.marks || 10,
              difficulty: q.difficulty || "medium",
              timeLimit: (q.time_limit || 2) * 60,
              description: q.title || "Coding Question",
              isSaved: true,
              testCases: []
            }));
            setQuestions(mappedQuestions);
          } else {
            // Add a default empty question if none exist
            setQuestions([{
              id: Date.now(),
              type: "Coding",
              problemStatement: "",
              inputFormat: "",
              outputFormat: "",
              constraints: "",
              sampleInput: "",
              sampleOutput: "",
              marks: 10,
              difficulty: "easy",
              timeLimit: 120,
              description: ""
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
        examType: examData?.type || examData?.examType || "Coding Only",
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

  
  const addCodingQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "Coding",
        problemStatement: "",
        inputFormat: "",
        outputFormat: "",
        constraints: "",
        sampleInput: "",
        sampleOutput: "",
        marks: 10,
        difficulty: "easy",
        timeLimit: 120,
        description: "",
      },
    ]);
  };

  const handleRemoveQuestion = async (id: number) => {
    const questionToRemove = questions.find(q => q.id === id);
    if (questionToRemove && questionToRemove.backendId) {
      if (!window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
        return;
      }
      try {
        const adminToken = localStorage.getItem('adminToken');
        const headers: Record<string, string> = {};
        if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
        
        const response = await fetch(`${API_BASE_URL}/ind/coding/admin/questions/${questionToRemove.backendId}`, {
          method: 'DELETE',
          headers
        });
        
        if (!response.ok) throw new Error("Delete request failed");
      } catch (err) {
        console.error("Failed to delete question:", err);
        alert("Failed to delete the question from the server.");
        return;
      }
    }
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateCodingQuestion = (id: number, field: keyof CodingQuestion, value: any) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleBulkUpload = () => {
    alert("Bulk upload currently not supported in edit mode.");
  };

  const handleSaveQuestion = async (question: CodingQuestion) => {
      alert("Individual question saving during edit mode uses 'Save Changes' below.");
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

      const response = await fetch(`${API_BASE_URL}/ind/coding/admin/exams/${examId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        // Save questions
        for (const question of questions) {
          if (!question.problemStatement.trim()) continue; // Skip empty questions

          try {
            if (question.backendId) {
              // Update existing question
              const questionBody = {
                title: "Coding Question",
                problem_description: question.problemStatement,
                input_format: question.inputFormat,
                output_format: question.outputFormat,
                constraints: question.constraints,
                difficulty: "medium", // Default
                time_limit: 2, // Default
                memory_limit: 256, // Default
              };

              await fetch(`${API_BASE_URL}/ind/coding/admin/questions/${question.backendId}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(questionBody),
              });

              // Upload bulk testcases if available
              if (question.testCases && question.testCases.length > 0) {
                await fetch(`${API_BASE_URL}/ind/coding/questions/${question.backendId}/testcases`, {
                  method: 'POST',
                  headers,
                  body: JSON.stringify({
                    testcases: question.testCases.map(tc => ({
                      input_data: tc.input_data,
                      expected_output: tc.expected_output,
                      is_hidden: tc.is_hidden || false
                    }))
                  })
                });
              }
            } else {
              // Create new question with testcases using the new unified endpoint
              const questionWithTestcasesBody = {
                title: "Coding Question",
                problem_description: question.problemStatement,
                input_format: question.inputFormat,
                output_format: question.outputFormat,
                constraints: question.constraints,
                difficulty: "medium", // Default
                time_limit: 2, // Default
                memory_limit: 256, // Default
                testcases: (question.testCases || []).map(tc => ({
                    input_data: tc.input_data,
                    expected_output: tc.expected_output,
                    is_hidden: tc.is_hidden || false
                }))
              };

              await fetch(`${API_BASE_URL}/ind/coding/exams/${examId}/question-with-testcases`, {
                method: 'POST',
                headers,
                body: JSON.stringify(questionWithTestcasesBody),
              });
            }
          } catch (err) {
            console.error("Failed to save a question or testcases:", err);
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
          Edit Coding Exam Details
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
                placeholder="e.g., Data Structures Final Exam"
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
                  options={["Coding Only"]}
                />
              </div>
            </div>
          </div>

          {/* Coding Questions Section */}
          <CodingQuestionsList
            questions={questions}
            formErrors={formErrors}
            onAddQuestion={addCodingQuestion}
            onBulkUpload={handleBulkUpload}
            onUpdateQuestion={updateCodingQuestion}
            onRemoveQuestion={handleRemoveQuestion}
            onSaveQuestion={handleSaveQuestion}
          />

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

export default EditCoding;
