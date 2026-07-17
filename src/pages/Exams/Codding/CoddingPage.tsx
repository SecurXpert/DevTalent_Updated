import React, { useMemo, useState } from "react";
import { ChevronLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/pages/Services/api/api";
import {
  CourseItem,
  ExamItem,
  FormErrors,
  QuestionItem,
  CodingQuestion,
  ExamType,
} from "../types";
import ModalWrapper from "../Shared/ModalWrapper";
import ExamStats from "../Shared/ExamStats";
import SearchAndFilter from "../Shared/SearchAndFilter";
import CourseTable from "../Shared/CourseTable";
import ViewExamModal from "../Shared/ViewExamModal";
import EditExamModal from "../Shared/EditExamModal";
import CodingCreateForm from "./Components/CodingCreateForm";
import CodingQuestionsList from "./Components/CodingQuestionsList";
import CodingExamSchedule from "./Components/CodingExamSchedule";
import CodingCourseSettings from "./Components/CodingCourseSettings";

const baseCourses: CourseItem[] = [
  { id: 2, name: "Coding Exams", availableExams: 0, totalExams: 0, activeExams: 0, totalStudents: 0, exams: [] }
];

const CodingPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseItem[]>(baseCourses);
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [viewExam, setViewExam] = useState<ExamItem | null>(null);
  const [editExam, setEditExam] = useState<ExamItem | null>(null);

  const [showCreatePage, setShowCreatePage] = useState(true);

  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [createdExamId, setCreatedExamId] = useState<number | null>(null);

  const [form, setForm] = useState({
    examName: "",
    description: "",
    duration: "",
    totalMarks: "",
    passingScore: "",
    examType: "Coding Only" as ExamType,
    startDate: "",
    endDate: "",
    isActive: true,
    supportedLanguages: [] as string[],
    randomizeQuestions: false,
    enableCamera: false,
    enableMicrophone: false,
    allowReattempt: false,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [questions, setQuestions] = useState<QuestionItem[]>([
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
    } as CodingQuestion,
  ]);

  const summary = useMemo(() => {
    const allExams = courses.flatMap((course) => course.exams);
    const codingExams = allExams.filter(
      (exam) => exam.type === "Coding" || exam.type === "Coding Only",
    );
    return {
      total: codingExams.length,
      active: codingExams.filter((item) => item.status === "Active").length,
      inactive: codingExams.filter((item) => item.status === "Draft").length,
      closed: codingExams.filter((item) => item.status === "Closed").length,
    };
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses
      .map((course) => {
        const exams = course.exams.filter((exam) => {
          const searchMatch =
            exam.title.toLowerCase().includes(search.toLowerCase()) ||
            course.name.toLowerCase().includes(search.toLowerCase()) ||
            exam.type.toLowerCase().includes(search.toLowerCase());

          const statusMatch =
            statusFilter === "All Status" ? true : exam.status === statusFilter;

          const isCodingExam =
            exam.type === "Coding" || exam.type === "Coding Only";

          return searchMatch && statusMatch && isCodingExam;
        });

        if (!search && statusFilter === "All Status") {
          return {
            ...course,
            exams: course.exams.filter(
              (exam) => exam.type === "Coding" || exam.type === "Coding Only",
            ),
          };
        }

        const courseMatch = course.name
          .toLowerCase()
          .includes(search.toLowerCase());

        return {
          ...course,
          exams: courseMatch
            ? course.exams.filter(
              (exam) => exam.type === "Coding" || exam.type === "Coding Only",
            )
            : course.exams,
        };
      })
      .filter((course) => {
        if (!search && statusFilter === "All Status") return true;
        return (
          course.exams.length > 0 ||
          course.name.toLowerCase().includes(search.toLowerCase())
        );
      });
  }, [courses, search, statusFilter]);

  const toggleCourse = (id: number) => {
    setExpandedCourseId((prev) => (prev === id ? null : id));
  };

  const handleFormChange = (field: string, value: string | ExamType) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLanguageToggle = (language: string) => {
    setForm((prev) => ({
      ...prev,
      supportedLanguages: prev.supportedLanguages.includes(language)
        ? prev.supportedLanguages.filter((item) => item !== language)
        : [...prev.supportedLanguages, language],
    }));
  };

  const validateForm = () => {
    const errors: FormErrors = {};

    if (!form.examName.trim()) errors.examName = "Exam name is required";
    if (!form.description.trim())
      errors.description = "Description is required";
    if (!form.duration || Number(form.duration) <= 0) {
      errors.duration = "Duration must be greater than 0";
    }
    if (!form.totalMarks || Number(form.totalMarks) <= 0) {
      errors.totalMarks = "Total marks must be greater than 0";
    }
    if (
      !form.passingScore ||
      Number(form.passingScore) < 0 ||
      Number(form.passingScore) > 100
    ) {
      errors.passingScore = "Passing score must be between 0 and 100";
    }
    if (!form.examType.trim()) errors.examType = "Exam type is required";
    // startDate/endDate validation removed - fields are hidden in UI

    if (questions.length === 0) {
      errors.questions = "At least one question is required";
    }

    questions.forEach((question) => {
      if (question.type === "Coding") {
        if (!question.problemStatement.trim()) {
          errors[`problemStatement_${question.id}`] =
            "Problem statement is required";
        }
        if (!question.inputFormat.trim()) {
          errors[`inputFormat_${question.id}`] = "Input format is required";
        }
        if (!question.outputFormat.trim()) {
          errors[`outputFormat_${question.id}`] = "Output format is required";
        }
        if (!question.constraints.trim()) {
          errors[`constraints_${question.id}`] = "Constraints are required";
        }
        if (!question.sampleInput.trim()) {
          errors[`sampleInput_${question.id}`] = "Sample input is required";
        }
        if (!question.sampleOutput.trim()) {
          errors[`sampleOutput_${question.id}`] = "Sample output is required";
        }
        if (!question.marks || Number(question.marks) <= 0) {
          errors[`marks_${question.id}`] = "Marks must be greater than 0";
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBulkUpload = () => {
    // Create a file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv,.xlsx,.json";
    fileInput.multiple = false;

    fileInput.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        // Here you would typically parse the file and add questions
        // For now, we'll show a success message and add sample questions
        console.log("Bulk upload file selected:", file.name);

        // Sample bulk questions (in real implementation, parse the file)
        const bulkQuestions: CodingQuestion[] = [
          {
            id: Date.now() + 1,
            type: "Coding",
            problemStatement: "Write a function to reverse a string.",
            inputFormat: "A string s",
            outputFormat: "The reversed string",
            constraints: "1 <= length of s <= 1000",
            sampleInput: "hello",
            sampleOutput: "olleh",
            marks: 10,
            difficulty: "easy",
            timeLimit: 120,
            description: "Basic string manipulation problem",
          },
          {
            id: Date.now() + 2,
            type: "Coding",
            problemStatement: "Find the factorial of a given number.",
            inputFormat: "An integer n",
            outputFormat: "The factorial of n",
            constraints: "0 <= n <= 20",
            sampleInput: "5",
            sampleOutput: "120",
            marks: 15,
            difficulty: "medium",
            timeLimit: 180,
            description: "Mathematical factorial calculation",
          },
        ];

        // Add bulk questions to existing questions
        setQuestions((prev) => [...prev, ...bulkQuestions]);

        // Show success message (you could replace this with a toast notification)
        alert(
          `Successfully uploaded ${bulkQuestions.length} coding questions from ${file.name}`,
        );
      }
    };

    fileInput.click();
  };

  const addCodingQuestion = () => {
    const newQuestion: CodingQuestion = {
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
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const removeQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((question) => question.id !== id));
  };

  const updateCodingQuestion = (
    id: number,
    field: keyof CodingQuestion,
    value: any,
  ) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === id && question.type === "Coding"
          ? { ...question, [field]: value }
          : question,
      ),
    );
  };

  const resetCreateForm = () => {
    setQuestions([]);
    setFormErrors({});
    setForm({
      examName: "",
      description: "",
      duration: "",
      totalMarks: "",
      passingScore: "",
      examType: "Coding Only" as ExamType,
      startDate: "",
      endDate: "",
      isActive: true,
      supportedLanguages: [],
      randomizeQuestions: false,
      enableCamera: false,
      enableMicrophone: false,
      allowReattempt: false,
    });
  };

  const handlePublishExam = async () => {
    console.log('handlePublishExam called', { form });

    // Validate required fields before creating exam
    if (!form.examName?.trim()) {
      alert('Please enter an exam name');
      return;
    }

    if (!form.description?.trim()) {
      alert('Please enter an exam description');
      return;
    }

    if (!form.duration || Number(form.duration) <= 0) {
      alert('Please enter a valid duration');
      return;
    }

    if (!form.totalMarks || Number(form.totalMarks) <= 0) {
      alert('Please enter valid total marks');
      return;
    }

    if (!form.passingScore || Number(form.passingScore) <= 0) {
      alert('Please enter a valid passing score');
      return;
    }

    // Show loading state without blocking UI
    const loadingMessage = document.createElement('div');
    loadingMessage.textContent = 'Publishing exams to all course types...';
    loadingMessage.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4F39F6;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 9999;
      font-size: 14px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    document.body.appendChild(loadingMessage);

    const adminToken = localStorage.getItem('adminToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (adminToken) {
      headers['Authorization'] = `Bearer ${adminToken}`;
    }

    const baseRequestBody = {
      title: form.examName || "Untitled Exam",
      description: form.description || "No description",
      duration_minutes: Number(form.duration) || 60,
      is_active: form.isActive,
      total_marks: Number(form.totalMarks) || 0,
      pass_percentage: Number(form.passingScore) || 100,
    };

    // Only publish the Coding exam from this page
    const results: { name: string; success: boolean; error?: string; data?: any }[] = [];

    try {
      const codingBody = { ...baseRequestBody, exam_type: 'coding' };
      console.log('Sending Coding exam creation request:', codingBody);

      const response = await fetch(`${API_BASE_URL}/ind/coding/admin/exams`, {
        method: 'POST',
        headers,
        body: JSON.stringify(codingBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Coding exam creation failed:', errorText);
        results.push({ name: 'Coding', success: false, error: `Server error: ${response.status}` });
      } else {
        const examData = await response.json();
        console.log('Coding exam created successfully:', examData);
        results.push({ name: 'Coding', success: true, data: examData });
      }

      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);
      setTimeout(() => {
        const successMessage = successful.map(r => r.name).join(', ');
        const failedMessage = failed.map(r => `${r.name}: ${r.error}`).join(', ');

        if (failed.length === 0) {
          alert(`✅ All exams published successfully!\n\nCreated for: ${successMessage}`);
        } else {
          alert(`⚠️ Partial success\n\n✅ Successful: ${successMessage}\n❌ Failed: ${failedMessage}`);
        }

        // Remove loading message
        if (document.body.contains(loadingMessage)) {
          document.body.removeChild(loadingMessage);
        }
      }, 1000);

      // If at least one exam was created successfully, add it to the UI
      if (successful.length > 0) {
        const codingResult = successful.find(r => r.name === 'Coding');
        const newExamId = codingResult?.data?.exam?.id || codingResult?.data?.id || codingResult?.data?.exam_id || Date.now();

        // Save all locally added coding questions
        if (newExamId !== Date.now()) {
          for (const question of questions) {
            if (question.type !== "Coding") continue;
            if (!question.problemStatement.trim()) continue; // Skip empty questions

            const questionBody = {
              title: question.description || "Question",
              problem_description: question.problemStatement,
              input_format: question.inputFormat,
              output_format: question.outputFormat,
              constraints: question.constraints,
              difficulty: question.difficulty || "easy",
              time_limit: Math.floor((question.timeLimit || 120) / 60), // Convert seconds to minutes
              memory_limit: 256, // Default memory limit
              testcases: (question.testCases || []).map(tc => ({
                  input_data: tc.input_data,
                  expected_output: tc.expected_output,
                  is_hidden: tc.is_hidden || false
              }))
            };

            try {
              const res = await fetch(`${API_BASE_URL}/ind/coding/exams/${newExamId}/question-with-testcases`, {
                method: 'POST',
                headers,
                body: JSON.stringify(questionBody),
              });
              
              if (!res.ok) {
                console.error("Failed to add question-with-testcases", await res.text());
              }
            } catch (err) {
              console.error("Failed to add question:", err);
            }
          }
        }

        // Attach the newly created exam to the selected courses
        if (selectedCourseIds.length > 0 && newExamId !== Date.now()) {
          loadingMessage.textContent = 'Attaching exam to courses...';
          for (const courseId of selectedCourseIds) {
            try {
              await fetch(`${API_BASE_URL}/ind/coding/admin/attach-to-course`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                  course_id: courseId,
                  exam_id: newExamId,
                  exam_kind: "coding"
                })
              });
            } catch (e) {
              console.error(`Failed to attach exam ${newExamId} to course ${courseId}`, e);
            }
          }
        }

        const newExam: ExamItem = {
          id: newExamId,
          title: form.examName,
          type: form.examType,
          questions: questions.length,
          duration: `${form.duration} min`,
          enrolled: 0,
          date: form.startDate || "2026-01-01",
          status: form.isActive ? "Active" : "Draft",
          description: form.description,
          totalMarks: Number(form.totalMarks),
          passingScore: Number(form.passingScore),
        };

        setCourses((prev) =>
          prev.map((course) => {
            return {
              ...course,
              exams: [newExam, ...course.exams],
              totalExams: course.totalExams + 1,
              activeExams: form.isActive ? course.activeExams + 1 : course.activeExams,
              availableExams: course.availableExams + 1,
            };
          })
        );

        if (newExamId !== Date.now()) {
          setCreatedExamId(newExamId);
        }

        // Reset form for next exam creation
        resetCreateForm();
      }

    } catch (error) {
      console.error('Unexpected error in exam publishing:', error);
      loadingMessage.textContent = 'Error occurred during publishing';
      loadingMessage.style.background = '#ef4444';

      setTimeout(() => {
        alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to publish exams'}`);
        if (document.body.contains(loadingMessage)) {
          document.body.removeChild(loadingMessage);
        }
      }, 1000);
    }
  };

  const handleSaveDraft = () => {
    if (!validateForm()) return;

    const newExam: ExamItem = {
      id: Date.now(),
      title: form.examName,
      type: form.examType,
      questions: questions.length,
      duration: `${form.duration} min`,
      enrolled: 0,
      date: form.startDate || "2026-01-01",
      status: "Draft",
      description: form.description,
      totalMarks: parseInt(form.totalMarks),
      passingScore: parseInt(form.passingScore),
    };

    setCourses((prev) =>
      prev.map((course, index) =>
        index === 0
          ? {
            ...course,
            exams: [newExam, ...course.exams],
            totalExams: course.totalExams + 1,
            availableExams: course.availableExams + 1,
          }
          : course,
      ),
    );

    setShowCreatePage(false);
    resetCreateForm();
  };

  const handleSaveEdit = () => {
    if (!editExam) return;

    setCourses((prev) =>
      prev.map((course) => ({
        ...course,
        exams: course.exams.map((exam) =>
          exam.id === editExam.id ? editExam : exam,
        ),
      })),
    );

    setEditExam(null);
  };

  const handleSaveQuestion = async (question: CodingQuestion) => {
    console.log('Saving question:', question);

    // Validate required fields for question
    if (!question.problemStatement?.trim()) {
      alert('Please enter a problem statement');
      return;
    }

    if (!question.inputFormat?.trim()) {
      alert('Please enter an input format');
      return;
    }

    if (!question.outputFormat?.trim()) {
      alert('Please enter an output format');
      return;
    }

    if (!question.constraints?.trim()) {
      alert('Please enter constraints');
      return;
    }

    try {
      const adminToken = localStorage.getItem('adminToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      if (!createdExamId) {
        alert('Please save Basic Exam Details first to create the exam before saving individual questions. Alternatively, you can use Publish Exam to save everything at once.');
        return;
      }

      // Use the actual exam ID
      const examId = createdExamId;

      const requestBody = {
        title: question.description || "Question",
        problem_description: question.problemStatement,
        input_format: question.inputFormat,
        output_format: question.outputFormat,
        constraints: question.constraints,
        difficulty: question.difficulty || "easy",
        time_limit: Math.floor((question.timeLimit || 120) / 60), // Convert seconds to minutes
        memory_limit: 256, // Default memory limit
        testcases: (question.testCases || []).map(tc => ({
            input_data: tc.input_data,
            expected_output: tc.expected_output,
            is_hidden: tc.is_hidden || false
        }))
      };

      console.log('Sending question creation request:', requestBody);

      const response = await fetch(`${API_BASE_URL}/ind/coding/exams/${examId}/question-with-testcases`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to save question to backend");
      }

      const questionData = await response.json();

      // Update local state to mark this question as saved
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === question.id ? { ...q, isSaved: true } : q,
        ),
      );
      
      console.log('Question saved successfully:', questionData);
      alert('Question saved successfully!');

    } catch (error) {
      console.error('Error saving question:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to save question'}`);
    }
  };

  const handleDeleteExam = (examId: number) => {
    setCourses((prev) =>
      prev.map((course) => ({
        ...course,
        exams: course.exams.filter((exam) => exam.id !== examId),
      })),
    );
  };

  // Create Exam Page
  if (showCreatePage) {
    return (
      <div className="min-h-screen bg-[#f3f2fb] px-2 py-3 sm:px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px] lg:max-w-[1440px]">
          <button
            onClick={() => {
              setShowCreatePage(false);
              resetCreateForm();
              navigate("/exams");
            }}
            className="mb-3 flex items-center gap-2 text-[14px] text-[#5b5cf0]"
          >
            <ChevronLeft size={16} />
            Back to Coding Exams
          </button>

          <h1 className="text-[28px] font-bold text-[#1f2937]">
            Create New Coding Exam
          </h1>
          <p className="mb-4 text-[14px] text-[#6b7280]">
            Set up a new coding exam with programming questions
          </p>

          <div className="space-y-5">
            <CodingCreateForm
              form={{
                examName: form.examName,
                description: form.description,
                duration: form.duration,
                totalMarks: form.totalMarks,
                passingScore: form.passingScore,
                examType: form.examType,
              }}
              onFormChange={handleFormChange}
              formErrors={formErrors}
            />

            <CodingExamSchedule
              startDate={form.startDate}
              endDate={form.endDate}
              isActive={form.isActive}
              onDateChange={handleDateChange}
              onActiveChange={(value) => setForm(prev => ({ ...prev, isActive: value }))}
              formErrors={formErrors}
            />

            <CodingQuestionsList
              questions={questions}
              formErrors={formErrors}
              onAddQuestion={addCodingQuestion}
              onBulkUpload={handleBulkUpload}
              onUpdateQuestion={updateCodingQuestion}
              onRemoveQuestion={removeQuestion}
              onSaveQuestion={handleSaveQuestion}
            />

            <CodingCourseSettings
              onSelectionChange={setSelectedCourseIds}
              examId={createdExamId || 0}
            />

            <div className="flex flex-col sm:flex-row gap-y-3 sm:gap-x-3 pb-6 sm:text-left text-center">
              <button
                onClick={handlePublishExam}
                className="inline-flex items-center justify-center sm:justify-start gap-4 rounded-[8px] px-5 py-3 text-white shadow-lg"
                style={{
                  background:
                    "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
                }}
              >
                <Check size={16} />
                Publish Exam
              </button>
              {/* <button
                onClick={handleSaveDraft}
                className="flex items-center justify-center sm:justify-start rounded-[8px] border border-[#d7dce5] bg-white px-5 py-3 text-[#111827]"
              >
                Save as Draft
              </button> */}
              <button
                onClick={() => {
                  setShowCreatePage(false);
                  resetCreateForm();
                }}
                className="flex items-center justify-center sm:justify-start rounded-[8px] border border-[#d7dce5] bg-white px-5 py-3 text-[#111827]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default CodingPage;
