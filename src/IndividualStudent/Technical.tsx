import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, BookOpen, ArrowLeft } from "lucide-react";
import { API_BASE_URL } from "@/pages/Services/api/api";

interface Exam {
    id: number;
    title: string;
    description: string;
    created_at: string;
    duration: number;
    category: string;
    course: string;
    question_count: number;
    total_marks: number;
}

export default function Technical() {
    const navigate = useNavigate();
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
                if (!token) {
                    setLoading(false);
                    return;
                }

                // Fetch active subscription to get selected courses
                const subResponse = await fetch(`${API_BASE_URL}/student/subscription/current`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!subResponse.ok) {
                    setLoading(false);
                    return;
                }

                const subData = await subResponse.json();
                let subs: any[] = [];
                if (Array.isArray(subData)) subs = subData;
                else if (subData && Array.isArray(subData.items)) subs = subData.items;
                else if (subData && Array.isArray(subData.data)) subs = subData.data;
                else if (subData) subs = [subData];

                let activeSubs = subs.filter((s: any) => s.status === 'active' || s.status === 'Success');
                let targetSubs = activeSubs.length > 0 ? activeSubs : subs;

                let activeSub = targetSubs[0];
                const storedPlanId = localStorage.getItem("selectedPlanId");
                if (storedPlanId) {
                    const matched = targetSubs.find((s: any) => String(s.subscription_id) === String(storedPlanId));
                    if (matched) activeSub = matched;
                }

                if (!activeSub || !activeSub.selected_courses) {
                    setLoading(false);
                    return;
                }

                let coursesToFetch = activeSub.selected_courses;
                const storedCourseId = localStorage.getItem("selectedCourseId");
                if (storedCourseId) {
                    const matchedCourse = activeSub.selected_courses.find((c: any) => String(c.course_id) === storedCourseId);
                    if (matchedCourse) {
                        coursesToFetch = [matchedCourse];
                    } else {
                        // Fallback in case the course isn't in selected_courses
                        coursesToFetch = [{ course_id: storedCourseId, course_name: "Selected Course" }];
                    }
                }

                let fetchedExams: Exam[] = [];

                // Fetch exams for each selected course
                for (const c of coursesToFetch) {
                    if (!c.course_id) continue;

                    // Fetch Coding Exams
                    try {
                        const codingRes = await fetch(`${API_BASE_URL}/ind/coding/student/courses/${c.course_id}/exams`, {
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            }
                        });

                        if (codingRes.ok) {
                            const data = await codingRes.json();
                            const coding = Array.isArray(data) ? data : (data.coding_exams || data.items || data.exams || []);

                            const mappedCoding = coding.map((exam: any) => ({
                                id: exam.id,
                                title: exam.title || exam.exam_name || exam.name || "Coding Exam",
                                description: exam.description || "",
                                total_marks: exam.total_marks || 0,
                                duration: exam.duration_minutes || exam.duration || 0,
                                created_at: exam.created_at || new Date().toISOString(),
                                category: "Coding",
                                course: c.course_name,
                                question_count: exam.question_count || 0
                            }));
                            fetchedExams = [...fetchedExams, ...mappedCoding];
                        }
                    } catch (e) {
                        console.error(`Error fetching coding exams for course ${c.course_id}:`, e);
                    }

                    // Fetch MCQ Exams
                    try {
                        const mcqRes = await fetch(`${API_BASE_URL}/ind/mcq/student/courses/${c.course_id}/exams`, {
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            }
                        });

                        if (mcqRes.ok) {
                            const data = await mcqRes.json();
                            const mcqs = Array.isArray(data) ? data : (data.mcq_exams || data.items || data.exams || []);

                            const mappedMcq = mcqs.map((exam: any) => ({
                                id: exam.id,
                                title: exam.title || exam.exam_name || exam.name || "MCQ Exam",
                                description: exam.description || "",
                                total_marks: exam.total_marks || 0,
                                duration: exam.duration_minutes || exam.duration || 0,
                                created_at: exam.created_at || new Date().toISOString(),
                                category: "MCQ",
                                course: c.course_name,
                                question_count: exam.question_count || exam.mcq_count || 0
                            }));
                            fetchedExams = [...fetchedExams, ...mappedMcq];
                        }
                    } catch (e) {
                        console.error(`Error fetching MCQ exams for course ${c.course_id}:`, e);
                    }
                }

                setExams(fetchedExams);
            } catch (error) {
                console.error("Error fetching exams:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

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

    // Group exams by course
    const examsByCourse = exams.reduce((acc, exam) => {
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
                Exams Available
            </h3>

            {/* GROUPED COURSES */}
            <div className="space-y-10">
                {Object.keys(examsByCourse).length > 0 ? (
                    Object.keys(examsByCourse).map((courseName) => (
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
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        No exams found for the selected courses.
                    </div>
                )}
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
        try {
            const date = new Date(dateStr);
            return date.toLocaleString();
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition relative overflow-hidden">
            {/* Category Banner */}
            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-lg ${exam.category === "Coding" ? "bg-blue-600" : "bg-purple-600"}`}>
                {exam.category}
            </div>

            {/* Title */}
            <h4 className="font-semibold text-gray-800 mb-2 mt-2">{exam.title}</h4>

            {/* Badge */}
            <span className="inline-block bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full mb-3">
                {exam.duration} Mins
            </span>

            {/* Details */}
            <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-purple-600" />
                    <span>Created: {formatDateTime(exam.created_at)}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-purple-600" />
                    <span>Duration: {exam.duration} mins</span>
                </div>

                <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-purple-600" />
                    <span>{exam.question_count} Questions</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Marks: {exam.total_marks}</span>
                </div>
            </div>

            {/* Start Button */}
            {/* <button
                onClick={() => onStartExam(exam.id, exam.category)}
                className={`w-full mt-4 bg-gradient-to-r text-white py-2 rounded-lg font-semibold hover:shadow-lg transition ${
                    exam.category === "Coding" 
                        ? "from-blue-600 to-blue-800" 
                        : "from-purple-600 to-purple-800"
                }`}
            >
                Start Exam Now
            </button> */}
        </div>
    );
}
