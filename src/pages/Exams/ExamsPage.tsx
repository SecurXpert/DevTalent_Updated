import React, { useMemo, useState, useEffect } from "react";
import { Plus, ChevronLeft, Trash2, Upload, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/pages/Services/api/api";
import {
  CourseItem,
  ExamItem,
  FormErrors,
  QuestionItem,
  McqQuestion,
  CodingQuestion,
  ImageAnalysisQuestion,
  ExamType,
} from "./types";
import { initialCourses } from "./utils";
import SelectField from "./Shared/SelectField";
import InputField from "./Shared/InputField";
import TextAreaField from "./Shared/TextAreaField";
import ModalWrapper from "./Shared/ModalWrapper";
import ExamStats from "./Shared/ExamStats";
import SearchAndFilter from "./Shared/SearchAndFilter";
import CourseTable from "./Shared/CourseTable";
import ViewExamModal from "./Shared/ViewExamModal";
import EditExamModal from "./Shared/EditExamModal";
import CreateExamForm from "./Components/CreateExamForm";
import ExamsListHeader from "./Components/ExamsListHeader";
import QuestionChooser from "./Components/QuestionChooser";

const baseCourses: CourseItem[] = [
  { id: 1, name: "MCQ Exams", availableExams: 0, totalExams: 0, activeExams: 0, totalStudents: 0, exams: [] },
  { id: 2, name: "Coding Exams", availableExams: 0, totalExams: 0, activeExams: 0, totalStudents: 0, exams: [] }
];

const ExamsPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [viewExam, setViewExam] = useState<ExamItem | null>(null);
  const [editExam, setEditExam] = useState<ExamItem | null>(null);

  const [showCreatePage, setShowCreatePage] = useState(false);
  const [questionChooserOpen, setQuestionChooserOpen] = useState(false);

  const [form, setForm] = useState({
    examName: "",
    description: "",
    duration: "120",
    totalMarks: "100",
    passingScore: "60",
    examType: "Coding Only" as ExamType,
    startDate: "",
    endDate: "",
    supportedLanguages: [] as string[],
    randomizeQuestions: false,
    enableCamera: false,
    enableMicrophone: false,
    allowReattempt: false,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [questions, setQuestions] = useState<QuestionItem[]>([]);


  useEffect(() => {
    const fetchCoursesAndExams = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        };

        if (adminToken) {
          headers['Authorization'] = `Bearer ${adminToken}`;
        }

        const coursesRes = await fetch(`${API_BASE_URL}/admin/catalog/courses`, {
          method: 'GET',
          headers,
        });

        if (!coursesRes.ok) {
          console.error('Failed to fetch courses:', coursesRes.status);
          return;
        }

        const coursesData = await coursesRes.json();
        
        const updatedCourses: CourseItem[] = await Promise.all(
          coursesData.map(async (course: any) => {
            let mappedExams: ExamItem[] = [];
            try {
              const mappedRes = await fetch(`${API_BASE_URL}/ind/mcq/admin/courses/${course.id}/mapped-exams`, {
                method: 'GET',
                headers,
              });

              if (mappedRes.ok) {
                const data = await mappedRes.json();
                const items = data.items || [];
                mappedExams = items.map((item: any) => {
                  const exam = item.exam || {};
                  return {
                    id: exam.id,
                    title: exam.title || "Untitled Exam",
                    type: item.exam_kind === "mcq" ? "MCQ Only" : item.exam_kind === "coding" ? "Coding Only" : (exam.type || "MCQ Only"),
                    questions: exam.question_count || 0,
                    duration: `${exam.duration_minutes || 60} min`,
                    enrolled: exam.enrolled_students || 0,
                    date: exam.created_at ? exam.created_at.split('T')[0] : "2026-01-01",
                    status: exam.is_active ? "Active" : "Draft",
                    description: exam.description || "",
                    totalMarks: exam.total_marks || 100,
                    passingScore: exam.pass_percentage || 60,
                  };
                });
              }
            } catch (err) {
              console.error(`Error fetching exams for course ${course.id}:`, err);
            }

            return {
              id: course.id,
              name: course.name,
              availableExams: mappedExams.length,
              totalExams: mappedExams.length,
              activeExams: mappedExams.filter(e => e.status === 'Active').length,
              totalStudents: mappedExams.reduce((acc, curr) => acc + curr.enrolled, 0),
              exams: mappedExams,
            };
          })
        );

        setCourses(updatedCourses);
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchCoursesAndExams();
  }, []);

  const summary = useMemo(() => {
    const allExams = courses.flatMap((course) => course.exams);
    return {
      total: allExams.length,
      active: allExams.filter((item) => item.status === "Active").length,
      inactive: allExams.filter((item) => item.status === "Draft").length,
      closed: allExams.filter((item) => item.status === "Closed").length,
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

          return searchMatch && statusMatch;
        });

        if (!search && statusFilter === "All Status") {
          return course;
        }

        const courseMatch = course.name
          .toLowerCase()
          .includes(search.toLowerCase());

        return {
          ...course,
          exams: courseMatch ? course.exams : exams,
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
    if (!form.startDate.trim()) errors.startDate = "Start date is required";
    if (!form.endDate.trim()) errors.endDate = "End date is required";
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      errors.endDate = "End date must be after start date";
    }

    if (questions.length === 0) {
      errors.questions = "At least one question is required";
    }

    questions.forEach((question) => {
      if (question.type === "MCQ") {
        if (!question.questionText.trim()) {
          errors[`questionText_${question.id}`] = "Question text is required";
        }

        question.options.forEach((option, idx) => {
          if (!option.trim()) {
            errors[`option_${question.id}_${idx}`] =
              `Option ${idx + 1} is required`;
          }
        });

        if (question.correctAnswer === null) {
          errors[`correctAnswer_${question.id}`] = "Select correct answer";
        }

        if (!question.marks || Number(question.marks) <= 0) {
          errors[`marks_${question.id}`] = "Marks must be greater than 0";
        }
      }

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

      if (question.type === "Image Analysis") {
        if (!question.questionText.trim()) {
          errors[`questionText_${question.id}`] = "Question text is required";
        }
        if (!question.imageUrl.trim()) {
          errors[`imageUrl_${question.id}`] = "Image is required";
        }
        if (!question.analysisInstructions.trim()) {
          errors[`analysisInstructions_${question.id}`] =
            "Analysis instructions are required";
        }
        if (!question.marks || Number(question.marks) <= 0) {
          errors[`marks_${question.id}`] = "Marks must be greater than 0";
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addMcqQuestion = () => {
    const newQuestion: McqQuestion = {
      id: Date.now(),
      type: "MCQ",
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: null,
      marks: 1,
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setQuestionChooserOpen(false);
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
    setQuestionChooserOpen(false);
  };

  const addImageAnalysisQuestion = () => {
    const newQuestion: ImageAnalysisQuestion = {
      id: Date.now(),
      type: "Image Analysis",
      questionText: "",
      imageUrl: "",
      analysisInstructions: "",
      marks: 5,
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setQuestionChooserOpen(false);
  };

  const removeQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((question) => question.id !== id));
  };

  const updateMcqQuestion = (
    id: number,
    field: keyof McqQuestion,
    value: string | number | null | string[],
  ) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === id && question.type === "MCQ"
          ? { ...question, [field]: value }
          : question,
      ),
    );
  };

  const updateCodingQuestion = (
    id: number,
    field: keyof CodingQuestion,
    value: string | number,
  ) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === id && question.type === "Coding"
          ? { ...question, [field]: value }
          : question,
      ),
    );
  };

  const updateImageAnalysisQuestion = (
    id: number,
    field: keyof ImageAnalysisQuestion,
    value: string | number,
  ) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === id && question.type === "Image Analysis"
          ? { ...question, [field]: value }
          : question,
      ),
    );
  };

  const resetCreateForm = () => {
    setQuestions([]);
    setFormErrors({});
    setQuestionChooserOpen(false);
    setForm({
      examName: "",
      description: "",
      duration: "120",
      totalMarks: "100",
      passingScore: "60",
      examType: "Coding Only",
      startDate: "",
      endDate: "",
      supportedLanguages: [],
      randomizeQuestions: false,
      enableCamera: false,
      enableMicrophone: false,
      allowReattempt: false,
    });
  };

  const handlePublishExam = () => {
    if (!validateForm()) return;

    const newExam: ExamItem = {
      id: Date.now(),
      title: form.examName,
      type: form.examType,
      questions: questions.length,
      duration: `${form.duration} min`,
      enrolled: 0,
      date: form.startDate || "2026-01-01",
      status: "Active",
    };

    setCourses((prev) =>
      prev.map((course, index) =>
        index === 0
          ? {
            ...course,
            exams: [newExam, ...course.exams],
            totalExams: course.totalExams + 1,
            activeExams: course.activeExams + 1,
            availableExams: course.availableExams + 1,
          }
          : course,
      ),
    );

    setShowCreatePage(false);
    resetCreateForm();
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

  const handleEditExam = (exam: ExamItem) => {
    console.log("Edit exam called with:", exam);
    console.log("Exam type:", exam.type);

    // Check if it's a coding exam and navigate to EditCoding page
    if (exam.type === "Coding" || exam.type === "Coding Only") {
      console.log("Navigating to EditCoding page");
      navigate(`/exams/coding/edit/${exam.id}`, { state: { examData: exam } });
    } else if (exam.type === "MCQ" || exam.type === "MCQ Only") {
      console.log("Navigating to EditMCQ page");
      navigate(`/exams/mcq/edit/${exam.id}`, { state: { examData: exam } });
    } else {
      console.log("Using modal approach for exam type:", exam.type);
      // For other exam types, use the existing modal approach
      setEditExam(exam);
    }
  };

  const handleViewExam = (exam: ExamItem) => {
    console.log("View exam called with:", exam);
    navigate(`/exams/details/${exam.id}`, { state: { examData: exam } });
  };

  const handleDeleteExam = async (examId: number) => {
    const examToDelete = courses.flatMap(c => c.exams).find(e => e.id === examId);

    if (examToDelete) {
      const isMcq = examToDelete.type === "MCQ" || examToDelete.type === "MCQ Only";
      const isCoding = examToDelete.type === "Coding" || examToDelete.type === "Coding Only";

      if (isMcq || isCoding) {
        try {
          const adminToken = localStorage.getItem('adminToken');
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'accept': 'application/json'
          };

          if (adminToken) {
            headers['Authorization'] = `Bearer ${adminToken}`;
          }

          const endpoint = isMcq
            ? `${API_BASE_URL}/ind/mcq/admin/exams/${examId}?hard=false`
            : `${API_BASE_URL}/ind/coding/admin/exams/${examId}?hard=false`;

          const response = await fetch(endpoint, {
            method: 'DELETE',
            headers,
          });

          if (!response.ok) {
            console.error(`Failed to delete exam from backend`);
            alert(`Failed to delete exam from backend.`);
            return; // Do not delete locally if backend fails
          }
        } catch (error) {
          console.error("Error deleting exam:", error);
          alert("An error occurred while deleting the exam.");
          return;
        }
      }
    }

    // Update local state if API succeeded or if it's not an MCQ/Coding exam
    setCourses((prev) =>
      prev.map((course) => ({
        ...course,
        exams: course.exams.filter((exam) => exam.id !== examId),
      })),
    );
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionId: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    updateImageAnalysisQuestion(questionId, "imageUrl", imageUrl);
  };

  const handleBulkUpload = () => {
    console.log("Bulk upload functionality - to be implemented");
    // TODO: Implement bulk upload functionality
    // This could open a file dialog or navigate to a bulk upload page
  };

  // Create Exam Page
  if (showCreatePage) {
    return (
      <CreateExamForm
        form={form}
        formErrors={formErrors}
        questions={questions}
        onFormChange={(updates) => setForm((prev) => ({ ...prev, ...updates }))}
        onQuestionsChange={setQuestions}
        onBack={() => {
          setShowCreatePage(false);
          resetCreateForm();
        }}
        onPublishExam={handlePublishExam}
        onSaveDraft={handleSaveDraft}
        onAddMcqQuestion={addMcqQuestion}
        onAddCodingQuestion={addCodingQuestion}
        onAddImageQuestion={addImageAnalysisQuestion}
        onRemoveQuestion={removeQuestion}
        onUpdateMcqQuestion={updateMcqQuestion}
        onUpdateCodingQuestion={updateCodingQuestion}
        onUpdateImageAnalysisQuestion={updateImageAnalysisQuestion}
        onBulkUpload={handleBulkUpload}
      />
    );
  }

  // Main Exam List Page
  return (
    <div className="min-h-screen bg-[#f3f2fb] px-2 py-3 sm:px-4 md:px-6">
      <div className="mx-auto max-w-[1280px]">

        <ExamsListHeader
          onCreateMCQExam={() => navigate("/mcq")}
          onCreateCodingExam={() => navigate("/coding")}
        />

        <SearchAndFilter
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <ExamStats summary={summary} />

        <CourseTable
          filteredCourses={filteredCourses}
          expandedCourseId={expandedCourseId}
          toggleCourse={toggleCourse}
          viewExam={handleViewExam}
          editExam={handleEditExam}
          deleteExam={handleDeleteExam}
        />

        <ViewExamModal
          viewExam={viewExam}
          setViewExam={setViewExam}
          setEditExam={setEditExam}
        />

        <EditExamModal
          editExam={editExam}
          setEditExam={setEditExam}
          handleSaveEdit={handleSaveEdit}
        />
      </div>
    </div>
  );
};

export default ExamsPage;
