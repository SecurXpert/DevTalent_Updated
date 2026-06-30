import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, BookOpen, ArrowLeft } from "lucide-react";

interface Exam {
    id: number;
    title: string;
    description: string;
    collage: string;
    window_start: string;
    window_end: string;
    duration: number;
    category: string;
    course: string;
    questions: Record<string, any>;
}

const mockExams: Exam[] = [
    {
        id: 1,
        title: "Arrays and Strings",
        description: "Basic DSA",
        collage: "IMT",
        window_start: new Date().toISOString(),
        window_end: new Date(Date.now() + 3600000).toISOString(),
        duration: 30,
        category: "Technical",
        course: "Data Structures & Algorithms",
        questions: { q1: {}, q2: {}, q3: {} },
    },
    {
        id: 2,
        title: "Linked Lists & Trees",
        description: "Advanced DSA",
        collage: "IMT",
        window_start: new Date().toISOString(),
        window_end: new Date(Date.now() + 7200000).toISOString(),
        duration: 45,
        category: "Technical",
        course: "Data Structures & Algorithms",
        questions: { q1: {}, q2: {}, q3: {}, q4: {} },
    },
    {
        id: 3,
        title: "OOP Basics",
        description: "Classes and Objects",
        collage: "IMT",
        window_start: new Date().toISOString(),
        window_end: new Date(Date.now() + 7200000).toISOString(),
        duration: 45,
        category: "Technical",
        course: "Object-Oriented Programming",
        questions: { q1: {}, q2: {}, q3: {} },
    },
    {
        id: 4,
        title: "SQL Queries",
        description: "Database",
        collage: "IMT",
        window_start: new Date().toISOString(),
        window_end: new Date(Date.now() + 7200000).toISOString(),
        duration: 60,
        category: "Technical",
        course: "Database Management Systems",
        questions: { q1: {}, q2: {}, q3: {}, q4: {}, q5: {} },
    },
];

export default function Technical() {
    const navigate = useNavigate();
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setExams(mockExams);
            setLoading(false);
        }, 500);
    }, []);

    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    const handleStartExam = (examId: number, category: string) => {
        if (category === "MCQ") {
            navigate("/mcq-exam", { state: { examId } });
        } else {
            navigate("/individualcompiler", { state: { examId } });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    const codingExams = exams.filter((e) => e.category === "Technical");

    // Group exams by course
    const examsByCourse = codingExams.reduce((acc, exam) => {
        if (!acc[exam.course]) {
            acc[exam.course] = [];
        }
        acc[exam.course].push(exam);
        return acc;
    }, {} as Record<string, Exam[]>);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
            {/* HEADER */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate("/studentdashboard")}
                    className="flex items-center gap-2 text-gray-600 hover:text-black"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>
            </div>

            {/* TITLE */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-purple-700">
                    Welcome to Exam Portal
                </h2>
                <p className="text-gray-500 mt-1">
                    College: Indian Institute of Technology, Delhi
                </p>
            </div>

            {/* TECHNICAL SECTION */}
            <h3 className="text-xl font-semibold mb-8 text-center">
                Technical Course Exams
            </h3>

            {/* GROUPED COURSES */}
            <div className="space-y-10">
                {Object.keys(examsByCourse).map((courseName) => (
                    <div key={courseName} className="mb-6">
                        <p className="font-bold text-lg text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                            <BookOpen className="text-purple-600" />
                            {courseName}
                        </p>
                        <div className="grid md:grid-cols-3 gap-6">
                            {examsByCourse[courseName].map((exam) => (
                                <ExamCard key={exam.id} exam={exam} onStartExam={handleStartExam} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* BUTTON */}
            <div className="flex justify-center mt-10">
                <button
                    onClick={() => navigate("/individualterms")}
                    className="w-full md:w-1/2 bg-gradient-to-r from-purple-600 to-purple-800 
                     text-white py-3 rounded-xl font-semibold 
                     hover:shadow-lg transition"
                >
                    Go To Exam Portal
                </button>
            </div>
        </div>
    );
}

/* ---------------- COMPONENT ---------------- */

function ExamCard({
    exam,
    onStartExam,
}: {
    exam: Exam;
    onStartExam: (examId: number, category: string) => void;
}) {
    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
            {/* Title */}
            <h4 className="font-semibold text-gray-800 mb-2">{exam.title}</h4>

            {/* Badge */}
            <span className="inline-block bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full mb-3">
                {exam.duration} Mins
            </span>

            {/* Details */}
            <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-purple-600" />
                    <span>Start: {formatDateTime(exam.window_start)}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-purple-600" />
                    <span>Duration: {exam.duration} mins</span>
                </div>

                <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-purple-600" />
                    <span>{Object.keys(exam.questions).length} Questions</span>
                </div>
            </div>

            {/* Start Button */}
            {/* <button
        onClick={() => onStartExam(exam.id, exam.category)}
        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition"
      >
        Start Exam Now
      </button> */}
        </div>
    );
}
