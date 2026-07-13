import { ExamStatus, CourseItem } from "./types";

export function statusBadge(status: ExamStatus) {
  if (status === "Active") return "bg-[#d8f3df] text-[#16934d]";
  if (status === "Draft") return "bg-[#f7e9b8] text-[#b68400]";
  return "bg-[#edf0f5] text-[#6b7280]";
}

export const initialCourses: CourseItem[] = [
  {
    id: 1,
    name: "Computer Science",
    availableExams: 3,
    totalExams: 3,
    activeExams: 1,
    totalStudents: 145,
    exams: [
      {
        id: 11,
        title: "Data Structures Final",
        type: "Coding",
        questions: 50,
        duration: "120 min",
        enrolled: 45,
        date: "2024-03-15",
        status: "Active" as const,
      },
      {
        id: 12,
        title: "Algorithms Mid-term",
        type: "MCQ",
        questions: 45,
        duration: "120 min",
        enrolled: 58,
        date: "2024-03-20",
        status: "Active" as const,
      },
      {
        id: 13,
        title: "Advanced Algorithms",
        type: "Coding",
        questions: 8,
        duration: "150 min",
        enrolled: 0,
        date: "2026-03-10",
        status: "Active",
      },
      {
        id: 14,
        title: "Web Development Coding",
        type: "Coding",
        questions: 5,
        duration: "180 min",
        enrolled: 25,
        date: "2026-02-20",
        status: "Active",
      },
    ],
  },
  {
    id: 2,
    name: "Data Science",
    availableExams: 2,
    totalExams: 2,
    activeExams: 1,
    totalStudents: 109,
    exams: [
      {
        id: 21,
        title: "Python Programming Quiz",
        type: "MCQ",
        questions: 30,
        duration: "45 min",
        enrolled: 67,
        date: "2026-02-20",
        status: "Active",
      },
      {
        id: 22,
        title: "Machine Learning Basics",
        type: "MCQ",
        questions: 25,
        duration: "60 min",
        enrolled: 0,
        date: "2026-03-05",
        status: "Draft",
      },
    ],
  },
  {
    id: 3,
    name: "Software Engineering",
    availableExams: 2,
    totalExams: 2,
    activeExams: 1,
    totalStudents: 90,
    exams: [
      {
        id: 31,
        title: "Database Management",
        type: "MCQ Only",
        questions: 40,
        duration: "90 min",
        enrolled: 38,
        date: "2026-02-10",
        status: "Closed",
      },
      {
        id: 32,
        title: "Web Development Project",
        type: "Coding",
        questions: 5,
        duration: "180 min",
        enrolled: 52,
        date: "2026-03-01",
        status: "Active",
      },
    ],
  },
  {
    id: 4,
    name: "Cloud Computing",
    availableExams: 1,
    totalExams: 1,
    activeExams: 1,
    totalStudents: 42,
    exams: [],
  },
];
