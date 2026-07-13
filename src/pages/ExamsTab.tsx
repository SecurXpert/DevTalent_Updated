import React, { useMemo, useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  Eye,
  FileText,
  Plus,
  Search,
  Trash2,
  Users,
  X,
  Clock3,
  Image as ImageIcon,
  Upload,
  Check,
} from "lucide-react";
import { FaRegEdit } from "react-icons/fa";

type ExamStatus = "Active" | "Draft" | "Closed";
type ExamType = "MCQ Only" | "Coding Only" | "MCQ + Coding" | "Image Analysis";

type ExamItem = {
  id: number;
  title: string;
  type: string;
  questions: number;
  duration: string;
  enrolled: number;
  date: string;
  status: ExamStatus;
};

type CourseItem = {
  id: number;
  name: string;
  availableExams: number;
  totalExams: number;
  activeExams: number;
  totalStudents: number;
  exams: ExamItem[];
};

type FormErrors = {
  [key: string]: string;
};

type McqQuestion = {
  id: number;
  type: "MCQ";
  questionText: string;
  options: string[];
  correctAnswer: number | null;
  marks: number;
};

type CodingQuestion = {
  id: number;
  type: "Coding";
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  marks: number;
};

type ImageAnalysisQuestion = {
  id: number;
  type: "Image Analysis";
  questionText: string;
  imageUrl: string;
  analysisInstructions: string;
  marks: number;
};

type QuestionItem = McqQuestion | CodingQuestion | ImageAnalysisQuestion;

const baseCourses: CourseItem[] = [
  { id: 1, name: "MCQ Exams", availableExams: 0, totalExams: 0, activeExams: 0, totalStudents: 0, exams: [] },
  { id: 2, name: "Coding Exams", availableExams: 0, totalExams: 0, activeExams: 0, totalStudents: 0, exams: [] }
];

function statusBadge(status: ExamStatus) {
  if (status === "Active") return "bg-[#d8f3df] text-[#16934d]";
  if (status === "Draft") return "bg-[#f7e9b8] text-[#b68400]";
  return "bg-[#edf0f5] text-[#6b7280]";
}

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-medium text-[#374151]">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-[48px] w-full appearance-none rounded-[14px] border bg-white px-4 pr-10 text-[14px] text-[#111827] outline-none ${error ? "border-red-400" : "border-[#d9dde5]"
            }`}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#111827]"
        />
      </div>
      {error ? <p className="mt-1 text-[12px] text-red-500">{error}</p> : null}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  icon,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-medium text-[#374151]">
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-[48px] w-full rounded-[14px] border bg-white px-4 text-[14px] text-[#111827] outline-none ${error ? "border-red-400" : "border-[#d9dde5]"
          }`}
      />
      {error ? <p className="mt-1 text-[12px] text-red-500">{error}</p> : null}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  error,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-medium text-[#374151]">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-[14px] border bg-white px-4 py-3 text-[14px] text-[#111827] outline-none ${error ? "border-red-400" : "border-[#d9dde5]"
          }`}
      />
      {error ? <p className="mt-1 text-[12px] text-red-500">{error}</p> : null}
    </div>
  );
}

function ModalWrapper({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-[20px] bg-[#f7f7ff] shadow-2xl">
        {children}
      </div>
      <button
        onClick={onClose}
        className="absolute right-6 top-6 rounded-full p-2 text-white"
      >
        <X size={22} />
      </button>
    </div>
  );
}

export default function ExamPage() {
  const [courses, setCourses] = useState<CourseItem[]>(baseCourses);
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(1);
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

  const handleDeleteExam = (examId: number) => {
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

  if (showCreatePage) {
    return (
      <div className="min-h-screen bg-[#f3f2fb] px-2 py-3 sm:px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px] lg:max-w-[1440px]">
          <button
            onClick={() => {
              setShowCreatePage(false);
              resetCreateForm();
            }}
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
            <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
              <h2 className="mb-4 text-[22px] font-semibold text-[#1f2937]">
                Basic Exam Details
              </h2>

              <div className="space-y-4">
                <InputField
                  label="Exam Name"
                  value={form.examName}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, examName: value }))
                  }
                  placeholder="e.g., Data Structures Final Exam"
                  error={formErrors.examName}
                />

                <TextAreaField
                  label="Exam Description"
                  value={form.description}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, description: value }))
                  }
                  placeholder="Describe the exam objectives and content..."
                  error={formErrors.description}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InputField
                    label="Duration (minutes)"
                    value={form.duration}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, duration: value }))
                    }
                    placeholder="120"
                    error={formErrors.duration}
                    type="number"
                  />
                  <InputField
                    label="Total Marks"
                    value={form.totalMarks}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, totalMarks: value }))
                    }
                    placeholder="100"
                    error={formErrors.totalMarks}
                    type="number"
                  />
                  <InputField
                    label="Passing Score (%)"
                    value={form.passingScore}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, passingScore: value }))
                    }
                    placeholder="60"
                    error={formErrors.passingScore}
                    type="number"
                  />
                  <SelectField
                    label="Exam Type"
                    value={form.examType}
                    onChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        examType: value as ExamType,
                      }))
                    }
                    options={[
                      "Coding Only",
                      "MCQ Only",
                      "MCQ + Coding",
                      "Image Analysis",
                    ]}
                    error={formErrors.examType}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
              <h2 className="mb-4 text-[22px] font-semibold text-[#1f2937]">
                Exam Schedule
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Start Date & Time"
                  value={form.startDate}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, startDate: value }))
                  }
                  placeholder="dd/mm/yyyy, --:--"
                  error={formErrors.startDate}
                  type="datetime-local"
                />
                <InputField
                  label="End Date & Time"
                  value={form.endDate}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, endDate: value }))
                  }
                  placeholder="dd/mm/yyyy, --:--"
                  error={formErrors.endDate}
                  type="datetime-local"
                />
              </div>
            </div>

            <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-[22px] font-semibold text-[#1f2937]">
                  Questions
                </h2>
                <button
                  onClick={() => setQuestionChooserOpen((prev) => !prev)}
                  className="flex h-[46px] items-center gap-2 rounded-[12px] px-5 text-[14px] font-medium text-white shadow-lg"
                  style={{
                    background:
                      "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
                  }}
                >
                  <Plus size={16} />
                  Add Question
                </button>
              </div>

              {questionChooserOpen && (
                <div className="mb-6 rounded-[12px] border border-[#dde1ea] bg-[#fafafa] p-4">
                  <p className="mb-4 text-[14px] text-[#374151]">
                    Select Question Type:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={addMcqQuestion}
                      className="rounded-[10px] bg-[#2563eb] px-4 py-2 text-white"
                    >
                      Add MCQ Question
                    </button>
                    <button
                      onClick={addCodingQuestion}
                      className="rounded-[10px] bg-[#16a34a] px-4 py-2 text-white"
                    >
                      Add Coding Question
                    </button>
                    {/* <button
                      onClick={addImageAnalysisQuestion}
                      className="rounded-[10px] bg-[#8b5cf6] px-4 py-2 text-white"
                    >
                      Add Image Analysis Question
                    </button> */}
                    <button
                      onClick={() => setQuestionChooserOpen(false)}
                      className="rounded-[10px] border border-[#d1d5db] bg-white px-4 py-2 text-[#374151]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

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
                            <button
                              onClick={() => removeQuestion(question.id)}
                              className="text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <TextAreaField
                            label="Question Text"
                            value={question.questionText}
                            onChange={(value) =>
                              updateMcqQuestion(
                                question.id,
                                "questionText",
                                value,
                              )
                            }
                            placeholder="Enter your question here..."
                            rows={2}
                            error={formErrors[`questionText_${question.id}`]}
                          />

                          <div className="mt-4">
                            <label className="mb-2 block text-[13px] font-medium text-[#374151]">
                              Options
                            </label>
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex}>
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="radio"
                                      checked={
                                        question.correctAnswer === optionIndex
                                      }
                                      onChange={() =>
                                        updateMcqQuestion(
                                          question.id,
                                          "correctAnswer",
                                          optionIndex,
                                        )
                                      }
                                      className="h-4 w-4"
                                    />
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => {
                                        const updatedOptions = [
                                          ...question.options,
                                        ];
                                        updatedOptions[optionIndex] =
                                          e.target.value;
                                        updateMcqQuestion(
                                          question.id,
                                          "options",
                                          updatedOptions,
                                        );
                                      }}
                                      className="h-[42px] w-full rounded-[10px] border border-[#d9dde5] px-4 outline-none"
                                      placeholder={`Option ${optionIndex + 1}`}
                                    />
                                  </div>
                                  {formErrors[
                                    `option_${question.id}_${optionIndex}`
                                  ] && (
                                      <p className="ml-7 mt-1 text-[12px] text-red-500">
                                        {
                                          formErrors[
                                          `option_${question.id}_${optionIndex}`
                                          ]
                                        }
                                      </p>
                                    )}
                                </div>
                              ))}
                            </div>
                            <p className="mt-2 text-[12px] text-[#6b7280]">
                              Select the radio button for the correct answer
                            </p>
                            {formErrors[`correctAnswer_${question.id}`] && (
                              <p className="mt-1 text-[12px] text-red-500">
                                {formErrors[`correctAnswer_${question.id}`]}
                              </p>
                            )}
                          </div>

                          <div className="mt-4 max-w-[160px]">
                            <InputField
                              label="Marks"
                              value={question.marks}
                              onChange={(value) =>
                                updateMcqQuestion(
                                  question.id,
                                  "marks",
                                  Number(value || 0),
                                )
                              }
                              type="number"
                              error={formErrors[`marks_${question.id}`]}
                            />
                          </div>
                        </div>
                      );
                    }

                    if (question.type === "Coding") {
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
                              <span className="rounded-full bg-[#f2f4f8] px-3 py-1 text-[13px] text-[#374151]">
                                Coding
                              </span>
                              <span className="text-[13px] text-[#6b7280]">
                                {question.marks} marks
                              </span>
                            </div>
                            <button
                              onClick={() => removeQuestion(question.id)}
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
                              updateCodingQuestion(
                                question.id,
                                "problemStatement",
                                value,
                              )
                            }
                            placeholder="Describe the coding problem..."
                            rows={4}
                            error={
                              formErrors[`problemStatement_${question.id}`]
                            }
                          />

                          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <TextAreaField
                              label="Input Format"
                              value={question.inputFormat}
                              onChange={(value) =>
                                updateCodingQuestion(
                                  question.id,
                                  "inputFormat",
                                  value,
                                )
                              }
                              placeholder="Describe input format..."
                              rows={2}
                              error={formErrors[`inputFormat_${question.id}`]}
                            />
                            <TextAreaField
                              label="Output Format"
                              value={question.outputFormat}
                              onChange={(value) =>
                                updateCodingQuestion(
                                  question.id,
                                  "outputFormat",
                                  value,
                                )
                              }
                              placeholder="Describe output format..."
                              rows={2}
                              error={formErrors[`outputFormat_${question.id}`]}
                            />
                          </div>

                          <div className="mt-4">
                            <InputField
                              label="Constraints"
                              value={question.constraints}
                              onChange={(value) =>
                                updateCodingQuestion(
                                  question.id,
                                  "constraints",
                                  value,
                                )
                              }
                              placeholder="e.g., 1 <= N <= 10^5"
                              error={formErrors[`constraints_${question.id}`]}
                            />
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <TextAreaField
                              label="Sample Input"
                              value={question.sampleInput}
                              onChange={(value) =>
                                updateCodingQuestion(
                                  question.id,
                                  "sampleInput",
                                  value,
                                )
                              }
                              placeholder="Sample input..."
                              rows={2}
                              error={formErrors[`sampleInput_${question.id}`]}
                            />
                            <TextAreaField
                              label="Sample Output"
                              value={question.sampleOutput}
                              onChange={(value) =>
                                updateCodingQuestion(
                                  question.id,
                                  "sampleOutput",
                                  value,
                                )
                              }
                              placeholder="Sample output..."
                              rows={2}
                              error={formErrors[`sampleOutput_${question.id}`]}
                            />
                          </div>

                          <div className="mt-4 max-w-[160px]">
                            <InputField
                              label="Marks"
                              value={question.marks}
                              onChange={(value) =>
                                updateCodingQuestion(
                                  question.id,
                                  "marks",
                                  Number(value || 0),
                                )
                              }
                              type="number"
                              error={formErrors[`marks_${question.id}`]}
                            />
                          </div>
                        </div>
                      );
                    }

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
                            <span className="rounded-full bg-[#f2f4f8] px-3 py-1 text-[13px] text-[#374151]">
                              Image Analysis
                            </span>
                            <span className="text-[13px] text-[#6b7280]">
                              {question.marks} marks
                            </span>
                          </div>
                          <button
                            onClick={() => removeQuestion(question.id)}
                            className="text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <TextAreaField
                          label="Question Text"
                          value={question.questionText}
                          onChange={(value) =>
                            updateImageAnalysisQuestion(
                              question.id,
                              "questionText",
                              value,
                            )
                          }
                          placeholder="Enter image analysis question..."
                          rows={3}
                          error={formErrors[`questionText_${question.id}`]}
                        />

                        <div className="mt-4">
                          <label className="mb-2 block text-[13px] font-medium text-[#374151]">
                            Upload Image
                          </label>

                          <label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed border-[#cfd5e3] bg-[#fafbff] p-4 text-center">
                            <Upload size={22} className="mb-2 text-[#6b7280]" />
                            <p className="text-[14px] font-medium text-[#374151]">
                              Click to upload image
                            </p>
                            <p className="mt-1 text-[12px] text-[#6b7280]">
                              PNG, JPG, JPEG supported
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageUpload(e, question.id)
                              }
                            />
                          </label>

                          {formErrors[`imageUrl_${question.id}`] && (
                            <p className="mt-1 text-[12px] text-red-500">
                              {formErrors[`imageUrl_${question.id}`]}
                            </p>
                          )}

                          {question.imageUrl && (
                            <div className="mt-4 overflow-hidden rounded-[12px] border border-[#dde1ea] bg-[#fafafa] p-3">
                              <img
                                src={question.imageUrl}
                                alt="Uploaded preview"
                                className="max-h-[260px] w-full rounded-[10px] object-contain"
                              />
                            </div>
                          )}
                        </div>

                        <div className="mt-4">
                          <TextAreaField
                            label="Analysis Instructions"
                            value={question.analysisInstructions}
                            onChange={(value) =>
                              updateImageAnalysisQuestion(
                                question.id,
                                "analysisInstructions",
                                value,
                              )
                            }
                            placeholder="Describe what student should analyze from the image..."
                            rows={4}
                            error={
                              formErrors[`analysisInstructions_${question.id}`]
                            }
                          />
                        </div>

                        <div className="mt-4 max-w-[160px]">
                          <InputField
                            label="Marks"
                            value={question.marks}
                            onChange={(value) =>
                              updateImageAnalysisQuestion(
                                question.id,
                                "marks",
                                Number(value || 0),
                              )
                            }
                            type="number"
                            error={formErrors[`marks_${question.id}`]}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
              <h2 className="mb-4 text-[22px] font-semibold text-[#1f2937]">
                Code Editor Settings
              </h2>
              <p className="mb-4 text-[14px] text-[#374151]">
                Supported Programming Languages
              </p>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {["Python", "Java", "C++", "JavaScript"].map((language) => (
                  <label
                    key={language}
                    className="flex items-center gap-2 text-[14px] text-[#374151]"
                  >
                    <input
                      type="checkbox"
                      checked={form.supportedLanguages.includes(language)}
                      onChange={() => handleLanguageToggle(language)}
                    />
                    {language}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
              <h2 className="mb-4 text-[22px] font-semibold text-[#1f2937]">
                Additional Settings
              </h2>

              <div className="space-y-4">
                {[
                  {
                    key: "randomizeQuestions",
                    title: "Randomize Questions",
                    sub: "Show questions in random order for each student",
                  },
                  {
                    key: "enableCamera",
                    title: "Enable Camera Monitoring",
                    sub: "Require students to enable camera during exam",
                  },
                  {
                    key: "enableMicrophone",
                    title: "Enable Microphone Monitoring",
                    sub: "Monitor audio during the exam",
                  },
                  {
                    key: "allowReattempt",
                    title: "Allow Reattempt",
                    sub: "Students can retake the exam",
                  },
                ].map((item) => (
                  <label key={item.key} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(form[item.key as keyof typeof form])}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          [item.key]: e.target.checked,
                        }))
                      }
                      className="mt-1"
                    />
                    <div>
                      <p className="text-[14px] font-medium text-[#374151]">
                        {item.title}
                      </p>
                      <p className="text-[12px] text-[#6b7280]">{item.sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

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
              <button
                onClick={handleSaveDraft}
                className="flex items-center justify-center sm:justify-start rounded-[8px] border border-[#d7dce5] bg-white px-5 py-3 text-[#111827]"
              >
                Save as Draft
              </button>
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

  return (
    <div className="min-h-screen bg-[#f3f2fb] px-2 py-3 sm:px-4 md:px-6">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start lg:items-center">
          <div>
            <h1 className="text-[20px] font-bold text-[#1f2937] sm:text-[22px] lg:text-[24px]">
              Exam Management
            </h1>
            <p className="text-[13px] text-[#6b7280] sm:text-[14px] lg:text-[15px]">
              Create and manage all exams on the platform
            </p>
          </div>

          <button
            onClick={() => setShowCreatePage(true)}
            className="flex h-[40px] items-center gap-2 self-start rounded-[10px] px-3 text-[13px] font-medium text-white sm:px-4 lg:h-[44px] lg:px-5 lg:text-[14px]"
            style={{
              background: "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
              boxShadow:
                "0px 5.29px 7.94px -5.29px #0000001A, 0px 13.23px 19.85px -3.97px #0000001A",
            }}
          >
            <Plus size={14} />
            Create New Exam
          </button>
        </div>
        <div className="rounded-[14px] border border-[#e1e3ea] bg-white p-3 sm:p-4 lg:p-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_230px] lg:grid-cols-[1fr_280px]">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exams by name or type..."
                className="h-[44px] w-full rounded-[10px] border border-[#d9dde5] bg-white pl-8 pr-4 text-[14px] outline-none lg:h-[35px] lg:text-[15px]"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-[44px] w-full appearance-none rounded-[10px] border border-[#d9dde5] bg-white px-4 pr-10 text-[14px] outline-none lg:h-[35px] lg:text-[15px]"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Closed</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-[12px] border border-[#e1e3ea] bg-white p-4">
            <p className="text-[15px] text-[#6b7280]">Total Exams</p>
            <h3 className="mt-2 text-[25px] font-semibold leading-none text-[#1f2937]">
              {summary.total}
            </h3>
          </div>
          <div className="rounded-[12px] border border-[#e1e3ea] bg-white p-4">
            <p className="text-[15px] text-[#6b7280]">Active Exams</p>
            <h3 className="mt-2 text-[25px] font-semibold leading-none text-[#16a34a]">
              {summary.active}
            </h3>
          </div>
          <div className="rounded-[12px] border border-[#e1e3ea] bg-white p-4">
            <p className="text-[15px] text-[#6b7280]">Inactive Exams</p>
            <h3 className="mt-2 text-[25px] font-semibold leading-none text-[#d97706]">
              {summary.inactive}
            </h3>
          </div>
          <div className="rounded-[12px] border border-[#e1e3ea] bg-white p-4">
            <p className="text-[15px] text-[#6b7280]">Closed Exams</p>
            <h3 className="mt-2 text-[25px] font-semibold leading-none text-[#4b5563]">
              {summary.closed}
            </h3>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[14px] border border-[#e1e3ea] bg-white">
          {/* Desktop Table Header */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-2 border-b border-[#e5e7eb] bg-[#f7f7fb] px-4 py-3 text-[12px] font-semibold text-[#374151]">
            <div className="col-span-2">Course Name</div>
            <div>Total Exams</div>
            <div>Active Exams</div>
            <div className="grid grid-cols-2">
              <span>Total Students</span>
              <span className="text-center">Actions</span>
            </div>
          </div>

          {/* Laptop/Tablet Table Header */}
          <div className="hidden md:grid lg:hidden md:grid-cols-3 gap-2 border-b border-[#e5e7eb] bg-[#f7f7fb] px-4 py-3 text-[12px] font-Inter-semibold text-[14px]">
            <div className="col-span-2">Course Name</div>
            <div className="grid grid-cols-2">
              <span>Exams</span>
              <span className="text-center">Actions</span>
            </div>
          </div>

          {/* Mobile Header - Card Style */}
          <div className="md:hidden border-b border-[#e5e7eb] bg-[#f7f7fb] px-4 py-3">
            <h2 className="text-[14px] font-semibold text-[#374151]">
              Courses & Exams
            </h2>
          </div>

          {filteredCourses.map((course) => {
            const isExpanded = expandedCourseId === course.id;

            return (
              <div
                key={course.id}
                className="border-b border-[#eceef3] last:border-b-0"
              >
                {/* Desktop View */}
                <div className="hidden lg:grid lg:grid-cols-5 items-center gap-2 px-4 py-4 text-[14px]">
                  <div className="col-span-2 flex items-center gap-3">
                    <button
                      onClick={() => toggleCourse(course.id)}
                      className="text-[#6b7280]"
                    >
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"
                          }`}
                      />
                    </button>

                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-[8px] text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, #615FFF 0%, #9810FA 100%)",
                      }}
                    >
                      <FileText size={15} />
                    </div>

                    <div>
                      <p className="font-semibold text-[#1f2937]">
                        {course.name}
                      </p>
                      <p className="text-[13px] text-[#6b7280]">
                        {course.availableExams} exams available
                      </p>
                    </div>
                  </div>

                  <div className="font-medium text-[#1f2937]">
                    {course.totalExams}
                  </div>

                  <div>
                    <span className="rounded-full bg-[#d8f3df] px-3 py-1 text-[12px] font-medium text-[#16934d]">
                      {course.activeExams} Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 items-center">
                    <div className="flex items-center gap-2 text-[#1f2937]">
                      <Users size={13} className="text-[#6b7280]" />
                      {course.totalStudents}
                    </div>

                    <div className="text-center">
                      <button
                        onClick={() => toggleCourse(course.id)}
                        className="rounded-[8px] bg-[#4F39F6] px-4 py-2 text-[10px] font-medium text-white"
                      >
                        {isExpanded ? "Hide Exams" : "View Exams"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Laptop/Tablet View */}
                <div className="hidden md:grid lg:hidden md:grid-cols-3 items-center gap-2 px-4 py-4 text-[14px]">
                  <div className="col-span-2 flex items-center gap-3">
                    <button
                      onClick={() => toggleCourse(course.id)}
                      className="text-[#6b7280]"
                    >
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"
                          }`}
                      />
                    </button>

                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-[8px] text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, #615FFF 0%, #9810FA 100%)",
                      }}
                    >
                      <FileText size={15} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#1f2937] truncate">
                        {course.name}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-[#6b7280]">
                        <span>{course.totalExams} exams</span>
                        <span>{course.activeExams} active</span>
                        <span className="flex items-center gap-1">
                          <Users size={11} />
                          {course.totalStudents}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => toggleCourse(course.id)}
                      className="rounded-[10px] bg-[#5b4df4] px-3 py-2 text-[12px] font-medium text-white"
                    >
                      {isExpanded ? "Hide" : "View"}
                    </button>
                  </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden px-4 py-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleCourse(course.id)}
                        className="text-[#6b7280] mt-1"
                      >
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"
                            }`}
                        />
                      </button>

                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-[8px] text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #615FFF 0%, #9810FA 100%)",
                        }}
                      >
                        <FileText size={15} />
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold text-[#1f2937] text-[15px]">
                          {course.name}
                        </p>
                        <p className="text-[12px] text-[#6b7280]">
                          {course.availableExams} exams available
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                    <div>
                      <p className="text-[11px] text-[#6b7280] mb-1">
                        Total Exams
                      </p>
                      <p className="font-semibold text-[#1f2937] text-[16px]">
                        {course.totalExams}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#6b7280] mb-1">Active</p>
                      <span className="rounded-full bg-[#d8f3df] px-2 py-1 text-[11px] font-medium text-[#16934d]">
                        {course.activeExams}
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#6b7280] mb-1">
                        Students
                      </p>
                      <div className="flex items-center gap-1 text-[#1f2937]">
                        <Users size={12} className="text-[#6b7280]" />
                        <span className="font-semibold text-[16px]">
                          {course.totalStudents}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleCourse(course.id)}
                    className="w-full rounded-[10px] bg-[#5b4df4] px-4 py-2 text-[12px] font-medium text-white"
                  >
                    {isExpanded ? "Hide Exams" : "View Exams"}
                  </button>
                </div>

                {isExpanded && course.exams.length > 0 && (
                  <div className="space-y-3 bg-[#fafafe] px-4 pb-4">
                    {course.exams.map((exam) => (
                      <div
                        key={exam.id}
                        className="flex flex-col justify-between gap-4 rounded-[12px] border border-[#e1e3ea] bg-white p-4 lg:flex-row lg:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                              <FileText size={14} className="text-[#5865f2]" />
                              <p className="font-semibold text-[#1f2937] text-sm md:text-base">
                                {exam.title}
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-medium ${statusBadge(
                                exam.status,
                              )}`}
                            >
                              {exam.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-[11px] md:text-[12px] text-[#6b7280]">
                            <span className="text-xs md:text-sm">
                              {exam.type}
                            </span>
                            <span className="text-xs md:text-sm">
                              {exam.questions} questions
                            </span>
                            <span className="flex items-center gap-1 text-xs md:text-sm">
                              <Clock3 size={12} />
                              {exam.duration}
                            </span>
                            <span className="flex items-center gap-1 text-xs md:text-sm">
                              <Users size={12} />
                              {exam.enrolled} enrolled
                            </span>
                            <span className="flex items-center gap-1 text-xs md:text-sm">
                              <Calendar size={12} />
                              {exam.date}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                          <button
                            onClick={() => setViewExam(exam)}
                            className="text-[#4F39F6] p-3 md:p-2 md:p-0 hover:bg-[#f0f8ff] rounded-lg transition-colors"
                            aria-label="View exam"
                          >
                            <Eye size={16} className="md:size-4" />
                          </button>
                          <button
                            onClick={() => setEditExam(exam)}
                            className="text-[#155DFC] p-3 md:p-2 md:p-0 hover:bg-[#f0f8ff] rounded-lg transition-colors"
                            aria-label="Edit exam"
                          >
                            <FaRegEdit size={16} className="md:size-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExam(exam.id)}
                            className="text-red-500 p-3 md:p-2 md:p-0 hover:bg-[#fff0f0] rounded-lg transition-colors"
                            aria-label="Delete exam"
                          >
                            <Trash2 size={16} className="md:size-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {viewExam && (
        <ModalWrapper onClose={() => setViewExam(null)}>
          <div className="rounded-t-[20px] bg-[#f3f2fb] px-6 py-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[28px] font-bold text-[#1f2937]">
                  Exam Details
                </h2>
                <p className="text-[14px] text-[#6b7280]">
                  View exam information
                </p>
              </div>
              <button
                onClick={() => setViewExam(null)}
                className="text-[#6b7280]"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="bg-white px-6 py-8">
            <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
              <div>
                <p className="mb-2 flex items-center gap-2 text-[14px] text-[#6b7280]">
                  <FileText size={16} />
                  Exam Name
                </p>
                <h3 className="text-[22px] font-semibold text-[#1f2937]">
                  {viewExam.title}
                </h3>
              </div>

              <div />

              <div>
                <p className="mb-2 text-[14px] text-[#6b7280]">Exam Type</p>
                <p className="text-[20px] text-[#1f2937]">{viewExam.type}</p>
              </div>

              <div>
                <p className="mb-2 text-[14px] text-[#6b7280]">
                  Total Questions
                </p>
                <p className="text-[20px] text-[#1f2937]">
                  {viewExam.questions} questions
                </p>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-2 text-[14px] text-[#6b7280]">
                  <Clock3 size={16} />
                  Duration
                </p>
                <p className="text-[20px] text-[#1f2937]">
                  {viewExam.duration}
                </p>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-2 text-[14px] text-[#6b7280]">
                  <Calendar size={16} />
                  Created Date
                </p>
                <p className="text-[20px] text-[#1f2937]">{viewExam.date}</p>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-2 text-[14px] text-[#6b7280]">
                  <Users size={16} />
                  Enrolled Students
                </p>
                <p className="text-[20px] text-[#1f2937]">
                  {viewExam.enrolled} students
                </p>
              </div>

              <div>
                <p className="mb-2 text-[14px] text-[#6b7280]">Status</p>
                <span
                  className={`rounded-full px-4 py-2 text-[14px] font-medium ${statusBadge(
                    viewExam.status,
                  )}`}
                >
                  {viewExam.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-[#e5e7eb] bg-white px-6 py-5">
            <button
              onClick={() => setViewExam(null)}
              className="rounded-[14px] border border-[#d9dde5] bg-white px-6 py-3 text-[16px] text-[#374151]"
            >
              Close
            </button>
            <button
              onClick={() => {
                setEditExam(viewExam);
                setViewExam(null);
              }}
              className="rounded-[14px] bg-gradient-to-r from-[#5b5cf0] to-[#a21caf] px-7 py-3 text-[16px] text-white shadow-lg"
            >
              Edit Exam
            </button>
          </div>
        </ModalWrapper>
      )}

      {editExam && (
        <ModalWrapper onClose={() => setEditExam(null)}>
          <div className="rounded-t-[20px] bg-[#f3f2fb] px-6 py-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[28px] font-bold text-[#1f2937]">
                  Edit Exam
                </h2>
                <p className="text-[14px] text-[#6b7280]">
                  Update exam information
                </p>
              </div>
              <button
                onClick={() => setEditExam(null)}
                className="text-[#6b7280]"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="bg-white px-6 py-8">
            <div className="space-y-6">
              <InputField
                label="Exam Name"
                value={editExam.title}
                onChange={(value) => setEditExam({ ...editExam, title: value })}
                icon={<FileText size={16} />}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <SelectField
                  label="Exam Type"
                  value={editExam.type}
                  onChange={(value) =>
                    setEditExam({ ...editExam, type: value })
                  }
                  options={["MCQ", "Coding", "MCQ + Coding", "Image Analysis"]}
                />
                <InputField
                  label="Total Questions"
                  value={editExam.questions}
                  onChange={(value) =>
                    setEditExam({ ...editExam, questions: Number(value || 0) })
                  }
                  type="number"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Duration (minutes)"
                  value={editExam.duration}
                  onChange={(value) =>
                    setEditExam({ ...editExam, duration: value })
                  }
                  icon={<Clock3 size={16} />}
                />
                <InputField
                  label="Created Date"
                  value={editExam.date}
                  onChange={(value) =>
                    setEditExam({ ...editExam, date: value })
                  }
                  icon={<Calendar size={16} />}
                />
              </div>

              <div className="max-w-[320px]">
                <SelectField
                  label="Status"
                  value={editExam.status}
                  onChange={(value) =>
                    setEditExam({ ...editExam, status: value as ExamStatus })
                  }
                  options={["Active", "Draft", "Closed"]}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-[#e5e7eb] bg-white px-6 py-5">
            <button
              onClick={() => setEditExam(null)}
              className="rounded-[14px] border border-[#d9dde5] bg-white px-6 py-3 text-[16px] text-[#374151]"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="rounded-[14px] bg-gradient-to-r from-[#5b5cf0] to-[#a21caf] px-7 py-3 text-[16px] text-white shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}
