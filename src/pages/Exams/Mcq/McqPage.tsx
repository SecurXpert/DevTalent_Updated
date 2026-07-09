import React, { useMemo, useState, useEffect } from "react";
import { Plus, ChevronLeft, Trash2, Check, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/pages/Services/api/api";
import { CourseItem, ExamItem, FormErrors, QuestionItem, McqQuestion, ExamType } from "../types";
import SelectField from "../Shared/SelectField";
import InputField from "../Shared/InputField";
import TextAreaField from "../Shared/TextAreaField";
import ModalWrapper from "../Shared/ModalWrapper";
import ExamStats from "../Shared/ExamStats";
import SearchAndFilter from "../Shared/SearchAndFilter";
import CourseTable from "../Shared/CourseTable";
import ViewExamModal from "../Shared/ViewExamModal";
import EditExamModal from "../Shared/EditExamModal";
import MCQCreateForm from "./Components/MCQCreateForm";
import MCQQuestionEditor from "./Components/MCQQuestionEditor";
import MCQCourseSettings from "./Components/MCQCourseSettings";
import MCQExamSchedule from "./Components/MCQExamSchedule";
// import { px } from "framer-motion";
// import { max } from "date-fns";

const baseCourses: CourseItem[] = [
  { id: 1, name: "MCQ Exams", availableExams: 0, totalExams: 0, activeExams: 0, totalStudents: 0, exams: [] }
];

const MCQPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseItem[]>(baseCourses);
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [viewExam, setViewExam] = useState<ExamItem | null>(null);
  const [editExam, setEditExam] = useState<ExamItem | null>(null);

  const [showCreatePage, setShowCreatePage] = useState(true);

  const [form, setForm] = useState({
    examName: "",
    description: "",
    duration: "",
    totalMarks: "",
    passingScore: "",
    examType: "MCQ Only" as ExamType,
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
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [publishedExamName, setPublishedExamName] = useState("");
  const [createdExamId, setCreatedExamId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      id: Date.now(),
      type: "MCQ",
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: null,
      marks: 1,
    } as McqQuestion,
  ]);

  const summary = useMemo(() => {
    const allExams = courses.flatMap((course) => course.exams);
    const mcqExams = allExams.filter(
      (exam) => exam.type === "MCQ" || exam.type === "MCQ Only",
    );
    return {
      total: mcqExams.length,
      active: mcqExams.filter((item) => item.status === "Active").length,
      inactive: mcqExams.filter((item) => item.status === "Draft").length,
      closed: mcqExams.filter((item) => item.status === "Closed").length,
    };
  }, [courses]);

  const fetchMcqExams = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      };

      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/ind/mcq/admin/exams?active_only=true&limit=200`, {
        method: 'GET',
        headers,
      });

      if (response.ok) {
        const data = await response.json();

        let examsArray = [];
        if (Array.isArray(data)) examsArray = data;
        else if (data && Array.isArray(data.items)) examsArray = data.items;
        else if (data && Array.isArray(data.data)) examsArray = data.data;
        else if (data && Array.isArray(data.exams)) examsArray = data.exams;

        const mappedExams: ExamItem[] = examsArray.map((exam: any) => ({
          id: exam.id || exam.exam_id,
          title: exam.title || "Untitled Exam",
          type: "MCQ",
          questions: exam.question_count ?? exam.questions_count ?? 0,
          duration: `${exam.duration_minutes || exam.duration || 60} min`,
          enrolled: exam.enrolled_students || 0,
          date: exam.created_at ? exam.created_at.split('T')[0] : "2026-01-01",
          status: exam.is_active ? "Active" : "Draft",
        }));

        const updatedCourses = [
          { id: 1, name: "MCQ Exams", availableExams: 0, totalExams: 0, activeExams: 0, totalStudents: 0, exams: [] as ExamItem[] }
        ];

        updatedCourses[0].exams = mappedExams;
        updatedCourses[0].availableExams = mappedExams.length;
        updatedCourses[0].totalExams = mappedExams.length;
        updatedCourses[0].activeExams = mappedExams.filter((e) => e.status === "Active").length;
        updatedCourses[0].totalStudents = mappedExams.reduce((acc, curr) => acc + curr.enrolled, 0);

        setCourses(updatedCourses);
      }
    } catch (error) {
      console.error('Error fetching MCQ exams:', error);
    }
  };

  useEffect(() => {
    fetchCourseTypes();
    fetchMcqExams();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses
      .map((course) => {
        const courseMatch = course.name
          .toLowerCase()
          .includes(search.toLowerCase());

        const exams = course.exams.filter((exam) => {
          const searchMatch =
            exam.title.toLowerCase().includes(search.toLowerCase()) ||
            course.name.toLowerCase().includes(search.toLowerCase()) ||
            exam.type.toLowerCase().includes(search.toLowerCase());

          const statusMatch =
            statusFilter === "All Status" ? true : exam.status === statusFilter;

          const isMCQExam = exam.type === "MCQ" || exam.type === "MCQ Only";

          return searchMatch && statusMatch && isMCQExam;
        });

        if (!search && statusFilter === "All Status") {
          return {
            ...course,
            exams: course.exams.filter(
              (exam) => exam.type === "MCQ" || exam.type === "MCQ Only",
            ),
          };
        }

        return {
          ...course,
          exams: courseMatch
            ? course.exams.filter(
              (exam) => exam.type === "MCQ" || exam.type === "MCQ Only",
            )
            : exams,
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

  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleActiveChange = (value: boolean) => {
    setForm((prev) => ({ ...prev, isActive: value }));
  };

  const handleSaveQuestion = async (question: McqQuestion) => {
    console.log('Saving MCQ question:', question);

    // Validate required fields for question
    if (!question.questionText?.trim()) {
      alert('Please enter a question text');
      return;
    }

    if (question.options.some(option => !option?.trim())) {
      alert('Please fill in all options');
      return;
    }

    if (question.correctAnswer === null || question.correctAnswer === undefined) {
      alert('Please select the correct answer');
      return;
    }

    if (!question.marks || Number(question.marks) <= 0) {
      alert('Please enter valid marks');
      return;
    }

    // Show loading state without blocking UI
    const loadingMessage = document.createElement('div');
    loadingMessage.textContent = 'Saving MCQ question...';
    loadingMessage.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 9999;
      font-size: 14px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    document.body.appendChild(loadingMessage);

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

      // Use created exam ID
      const examId = createdExamId;

      const requestBody = {
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

      console.log('Sending MCQ question creation request:', requestBody);

      const response = await fetch(`${API_BASE_URL}/ind/mcq/admin/exams/${examId}/questions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Failed to save MCQ question: ${response.status} - ${errorText}`);
      }

      const questionData = await response.json();
      console.log('MCQ question saved successfully:', questionData);

      const dbQuestionId = questionData.id || questionData.question_id || questionData.question?.id;
      const dbOptions = questionData.options || questionData.question?.options;
      const dbOptionIds = Array.isArray(dbOptions) ? dbOptions.map((opt: any) => opt.id || null) : undefined;

      if (dbQuestionId) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === question.id ? {
            ...q,
            id: dbQuestionId,
            optionIds: dbOptionIds || q.optionIds
          } : q))
        );
      }

      // Update loading message with success
      loadingMessage.textContent = 'MCQ question saved successfully!';
      loadingMessage.style.background = '#10b981';

      // Show success message and remove loading notification
      setTimeout(() => {
        alert('✅ MCQ question saved successfully!');
        if (document.body.contains(loadingMessage)) {
          document.body.removeChild(loadingMessage);
        }
      }, 1000);

    } catch (error) {
      console.error('Error saving MCQ question:', error);
      loadingMessage.textContent = 'Error occurred during question saving';
      loadingMessage.style.background = '#ef4444';

      setTimeout(() => {
        alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to save MCQ question'}`);
        if (document.body.contains(loadingMessage)) {
          document.body.removeChild(loadingMessage);
        }
      }, 1000);
    }
  };

  const handleSaveSchedule = async () => {
    console.log('handleSaveSchedule called', { form });

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
    loadingMessage.textContent = 'Creating MCQ exam...';
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

    try {
      const adminToken = localStorage.getItem('adminToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      const requestBody = {
        title: form.examName || "Untitled Exam",
        description: form.description || "No description",
        duration_minutes: Number(form.duration) || 60,
        is_active: form.isActive,
        total_marks: Number(form.totalMarks) || 0,
        pass_percentage: Number(form.passingScore) || 100,
      };
      console.log('Sending MCQ exam creation request:', requestBody);

      const response = await fetch(`${API_BASE_URL}/ind/mcq/admin/exams`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Failed to create MCQ exam: ${response.status} - ${errorText}`);
      }

      const examData = await response.json();
      console.log('MCQ exam created successfully:', examData);

      // Update loading message with success
      loadingMessage.textContent = 'MCQ exam created successfully!';
      loadingMessage.style.background = '#10b981';

      // Show success message and remove loading notification
      setTimeout(() => {
        alert('✅ MCQ exam created successfully!');
        if (document.body.contains(loadingMessage)) {
          document.body.removeChild(loadingMessage);
        }
      }, 1000);

      // Add the new exam to the UI
      const newExam: ExamItem = {
        id: examData.id || examData.exam_id || Date.now(),
        title: form.examName,
        type: form.examType,
        questions: questions.length,
        duration: `${form.duration} min`,
        enrolled: 0,
        date: form.startDate || "2026-01-01",
        status: form.isActive ? "Active" : "Draft",
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
              activeExams: form.isActive ? course.activeExams + 1 : course.activeExams,
              availableExams: course.availableExams + 1,
            }
            : course,
        ),
      );

      const newExamId = examData.id || examData.exam_id;
      if (newExamId) {
        setCreatedExamId(newExamId);
      }

    } catch (error) {
      console.error('Error creating MCQ exam:', error);
      loadingMessage.textContent = 'Error occurred during exam creation';
      loadingMessage.style.background = '#ef4444';

      setTimeout(() => {
        alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to create MCQ exam'}`);
        if (document.body.contains(loadingMessage)) {
          document.body.removeChild(loadingMessage);
        }
      }, 1000);
    }
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
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBulkUpload = () => {
    const examId = createdExamId;
    if (!examId) {
      alert("Please save Basic Exam Details first to create the exam before uploading questions.");
      return;
    }

    // Create a file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv,.xlsx,.json";
    fileInput.multiple = false;

    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log("Bulk upload file selected:", file.name);

        const loadingToast = document.createElement('div');
        loadingToast.style.cssText = `
          position:fixed;top:20px;right:20px;background:#4F39F6;color:#fff;
          padding:12px 20px;border-radius:8px;z-index:9999;
          font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,.15);
        `;
        loadingToast.textContent = 'Uploading questions...';
        document.body.appendChild(loadingToast);

        try {
          const adminToken = localStorage.getItem('adminToken');
          const headers: Record<string, string> = {};
          if (adminToken) {
            headers['Authorization'] = `Bearer ${adminToken}`;
          }

          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch(`${API_BASE_URL}/ind/mcq/admin/exams/${examId}/questions/bulk?skip_invalid=false`, {
            method: 'POST',
            headers,
            body: formData,
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            throw new Error(`Failed to upload questions: ${response.status} - ${errorText}`);
          }

          const result = await response.json();
          console.log('Bulk upload success:', result);

          loadingToast.textContent = 'Questions uploaded successfully!';
          loadingToast.style.background = '#10b981';

          // We can parse or fetch the questions if needed. If backend response returns them, we can add them to questions list:
          if (Array.isArray(result)) {
            const newQuestions: McqQuestion[] = result.map((q: any, index: number) => ({
              id: Date.now() + index,
              type: "MCQ",
              questionText: q.text || "",
              options: Array.isArray(q.options) ? q.options.map((opt: any) => opt.text || "") : ["", "", "", ""],
              correctAnswer: q.correct_index !== undefined ? q.correct_index : null,
              marks: q.marks || 1,
            }));
            setQuestions((prev) => [...prev, ...newQuestions]);
          } else {
            // Success placeholder mock if array is not returned
            alert('✅ Bulk questions uploaded successfully!');
          }

          setTimeout(() => {
            if (document.body.contains(loadingToast)) {
              document.body.removeChild(loadingToast);
            }
          }, 1500);

        } catch (error) {
          console.error('Error during bulk upload:', error);
          loadingToast.textContent = 'Error uploading questions';
          loadingToast.style.background = '#ef4444';

          setTimeout(() => {
            alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to upload questions'}`);
            if (document.body.contains(loadingToast)) {
              document.body.removeChild(loadingToast);
            }
          }, 1500);
        }
      }
    };

    fileInput.click();
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
  };

  const removeQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((question) => question.id !== id));
  };

  const updateMcqQuestion = (
    id: number,
    field: keyof McqQuestion,
    value: any,
  ) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === id && question.type === "MCQ"
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
      examType: "MCQ Only",
      startDate: "",
      endDate: "",
      isActive: true,
      supportedLanguages: [],
      randomizeQuestions: false,
      enableCamera: false,
      enableMicrophone: false,
      allowReattempt: false,
    });
    setCreatedExamId(null);
  };

  const handlePublishExam = async () => {
    if (!validateForm()) return;

    if (createdExamId) {
      setCourses((prev) =>
        prev.map((course, index) =>
          index === 0
            ? {
              ...course,
              exams: course.exams.map((exam) =>
                exam.id === createdExamId
                  ? {
                    ...exam,
                    title: form.examName,
                    duration: `${form.duration} min`,
                    questions: questions.length,
                    status: form.isActive ? "Active" : "Draft"
                  }
                  : exam
              )
            }
            : course
        )
      );

      setPublishedExamName(form.examName);
      setShowSuccessModal(true);
      return;
    }

    // Show loading state without blocking UI
    const loadingMessage = document.createElement('div');
    loadingMessage.textContent = 'Publishing MCQ exam...';
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

    const requestBody = {
      title: form.examName || "Untitled Exam",
      description: form.description || "No description",
      duration_minutes: Number(form.duration) || 60,
      is_active: form.isActive,
      total_marks: Number(form.totalMarks) || 0,
      pass_percentage: Number(form.passingScore) || 100,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/ind/mcq/admin/exams`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create MCQ exam: ${response.status} - ${errorText}`);
      }

      const examData = await response.json();
      const newExamId = examData.exam?.id || examData.id || examData.exam_id;

      // Attach the newly created exam to the selected courses
      if (selectedCourseIds.length > 0 && newExamId) {
        loadingMessage.textContent = 'Attaching exam to courses...';
        for (const courseId of selectedCourseIds) {
          try {
            await fetch(`${API_BASE_URL}/ind/mcq/admin/attach-to-course`, {
              method: "POST",
              headers,
              body: JSON.stringify({
                course_id: courseId,
                exam_id: newExamId,
                exam_kind: "mcq"
              })
            });
          } catch (e) {
            console.error(`Failed to attach exam ${newExamId} to course ${courseId}`, e);
          }
        }
      }

      loadingMessage.textContent = 'MCQ exam published successfully!';
      loadingMessage.style.background = '#10b981';

      // Save all locally added questions
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
          await fetch(`${API_BASE_URL}/ind/mcq/admin/exams/${newExamId}/questions`, {
            method: 'POST',
            headers,
            body: JSON.stringify(questionBody),
          });
        } catch (err) {
          console.error("Failed to save a question:", err);
        }
      }

      setTimeout(() => {
        if (document.body.contains(loadingMessage)) {
          document.body.removeChild(loadingMessage);
        }
      }, 1000);

      // Add the new exam to the UI for selected courses
      const newExam: ExamItem = {
        id: newExamId || Date.now(),
        title: form.examName,
        type: form.examType,
        questions: questions.length,
        duration: `${form.duration} min`,
        enrolled: 0,
        date: form.startDate || "2026-01-01",
        status: form.isActive ? "Active" : "Draft",
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
        }),
      );

      if (newExamId) {
        setCreatedExamId(newExamId);
      }

      setPublishedExamName(form.examName);
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Error publishing MCQ exam:', error);
      loadingMessage.textContent = 'Error occurred during publishing';
      loadingMessage.style.background = '#ef4444';

      setTimeout(() => {
        alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to publish MCQ exam'}`);
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

  const handleDeleteExam = async (examId: number) => {
    const examToDelete = courses.flatMap(c => c.exams).find(e => e.id === examId);

    if (examToDelete && (examToDelete.type === "MCQ" || examToDelete.type === "MCQ Only")) {
      try {
        const adminToken = localStorage.getItem('adminToken');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        };

        if (adminToken) {
          headers['Authorization'] = `Bearer ${adminToken}`;
        }

        const response = await fetch(`${API_BASE_URL}/ind/mcq/admin/exams/${examId}?hard=false`, {
          method: 'DELETE',
          headers,
        });

        if (!response.ok) {
          console.error("Failed to delete exam from backend");
          alert("Failed to delete exam from backend.");
          return; // Do not delete locally if backend fails
        }
      } catch (error) {
        console.error("Error deleting exam:", error);
        alert("An error occurred while deleting the exam.");
        return;
      }
    }

    // Update local state if API succeeded or if it's not an MCQ exam
    setCourses((prev) =>
      prev.map((course) => ({
        ...course,
        exams: course.exams.filter((exam) => exam.id !== examId),
      })),
    );
  };

  const handleLanguageToggle = (language: string) => {
    setForm((prev) => ({
      ...prev,
      supportedLanguages: prev.supportedLanguages.includes(language)
        ? prev.supportedLanguages.filter((lang) => lang !== language)
        : [...prev.supportedLanguages, language],
    }));
  };

  const fetchCourseTypes = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      const response = await fetch('/admin/catalog/course-types', {
        method: 'GET',
        headers,
      });

      if (response.ok) {
        const courseTypes = await response.json();
        setAvailableCourses(Array.isArray(courseTypes) ? courseTypes : []);
      } else {
        console.error('Failed to fetch course types:', response.statusText);
        // Fallback to default courses if API fails
        setAvailableCourses(['Python', 'Java', 'C++', 'JavaScript']);
      }
    } catch (error) {
      console.error('Error fetching course types:', error);
      // Fallback to default courses if API fails
      setAvailableCourses(['Python', 'Java', 'C++', 'JavaScript']);
    }
  };

  // Create Exam Page
  if (showCreatePage) {
    return (
      <div className="min-h-screen bg-[#f3f2fb] px-2 py-3 sm:px-4 md:px-6 lg:px-8">

        {/* ── Exam Created Success Modal ─────────────────────────────── */}
        {showSuccessModal && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.55)' }}
          >
            <div
              className="relative mx-4 w-full max-w-[420px] rounded-[24px] bg-white px-8 py-10 shadow-2xl text-center"
              style={{ animation: 'mcqModalIn 0.35s cubic-bezier(.4,0,.2,1)' }}
            >
              {/* Animated gradient checkmark */}
              <div
                className="mx-auto mb-5 flex h-[84px] w-[84px] items-center justify-center rounded-full"
                style={{
                  background: 'linear-gradient(135deg,#4F39F6 0%,#9810FA 100%)',
                  boxShadow: '0 8px 32px rgba(79,57,246,.4)',
                }}
              >
                <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                  <path
                    d="M11 22l9 9 13-16"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: 50,
                      strokeDashoffset: 50,
                      animation: 'mcqCheckDraw 0.55s 0.2s ease forwards',
                    }}
                  />
                </svg>
              </div>

              <h2 className="mb-1 text-[28px] font-bold text-[#1f2937]">Exam Created!</h2>
              <p className="mb-1 text-[15px] font-semibold" style={{ color: '#4F39F6' }}>
                {publishedExamName}
              </p>
              <p className="mb-7 text-[14px] text-[#6b7280] leading-relaxed">
                Your MCQ exam has been published successfully and is now live.
                {selectedCourseIds.length > 0 && (
                  <> Attached to <strong>{selectedCourseIds.length}</strong> course(s).</>
                )}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { setShowSuccessModal(false); setShowCreatePage(false); resetCreateForm(); }}
                  className="w-full rounded-[10px] py-3 text-[15px] font-semibold text-white"
                  style={{ background: 'linear-gradient(90deg,#4F39F6 0%,#9810FA 100%)', boxShadow: '0 4px 16px rgba(79,57,246,.35)' }}
                >
                  Go to Exams
                </button>
                <button
                  onClick={() => { setShowSuccessModal(false); resetCreateForm(); }}
                  className="w-full rounded-[10px] border border-[#e1e3ea] py-3 text-[15px] font-medium text-[#374151] hover:bg-[#f9fafb] transition-colors"
                >
                  Create Another Exam
                </button>
              </div>
            </div>

            <style>{`
              @keyframes mcqModalIn {
                from { opacity:0; transform:scale(.88) translateY(28px); }
                to   { opacity:1; transform:scale(1) translateY(0); }
              }
              @keyframes mcqCheckDraw { to { stroke-dashoffset:0; } }
            `}</style>
          </div>
        )}
        <div className="mx-auto max-w-[1280px] lg:max-w-[1440px]">
          <button
            onClick={() => {
              navigate("/exams");
            }}
            className="mb-3 flex items-center gap-2 text-[14px] text-[#5b5cf0]"
          >
            <ChevronLeft size={16} />
            Back to MCQ Exams
          </button>

          <h1 className="text-[28px] font-bold text-[#1f2937]">
            Create New MCQ Exam
          </h1>
          <p className="mb-4 text-[14px] text-[#6b7280]">
            Set up a new multiple choice exam with questions
          </p>

          <div className="space-y-5">
            <MCQCreateForm
              form={form}
              formErrors={formErrors}
              onFormChange={(updates) =>
                setForm((prev) => ({ ...prev, ...updates }))
              }
              onSave={handleSaveSchedule}
            />

            <MCQExamSchedule
              startDate={form.startDate}
              endDate={form.endDate}
              isActive={form.isActive}
              onDateChange={handleDateChange}
              onActiveChange={handleActiveChange}
              onSave={handleSaveSchedule}
              formErrors={formErrors}
            />

            <MCQQuestionEditor
              questions={questions}
              formErrors={formErrors}
              onAddQuestion={addMcqQuestion}
              onBulkUpload={handleBulkUpload}
              onRemoveQuestion={removeQuestion}
              onUpdateQuestion={updateMcqQuestion}
              onSaveQuestion={handleSaveQuestion}
            />

            <MCQCourseSettings
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
  return (
    <div className="min-h-screen bg-[#f3f2fb] px-2 py-3 sm:px-4 md:px-6">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/exams")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#6b7280] shadow-sm hover:bg-[#f9fafb] sm:h-10 sm:w-10"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <h1 className="text-2xl font-bold text-[#1f2937]">MCQ Exams</h1>
          </div>
          <button
            onClick={() => setShowCreatePage(true)}
            className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-white hover:opacity-90"
            style={{
              background: "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
            }}
          >
            <Plus size={20} />
            Create MCQ Exam
          </button>
        </div>

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
          viewExam={() => { }}
          editExam={() => { }}
          deleteExam={handleDeleteExam}
        />
      </div>
    </div>
  );
};

export default MCQPage;
