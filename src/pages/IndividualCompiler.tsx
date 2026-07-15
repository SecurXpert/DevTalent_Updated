import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "@/pages/Services/api/api";

const IndividualCompiler: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const examState = (location.state as any) || {};
    const examData = examState.examData || {};

    const [code, setCode] = useState(
        "def solution():\n    # write your solution here",
    );
    const [input, setInput] = useState("");
    const [output, setOutput] = useState<string>("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [activeIdx, setActiveIdx] = useState(0);
    
    // Ensure questions is an array even if it's missing
    const [questions, setQuestions] = useState<any[]>(
        examData.questions && examData.questions.length > 0
            ? examData.questions
            : [
                {
                    title: "Reverse String",
                    problem_description: "Lorem Ipsum...",
                    difficulty: "Hard",
                    total_marks: 10
                }
              ]
    );

    const [timeLeft, setTimeLeft] = useState((examData.duration || 60) * 60);
    const examTitle = examData.title || "STM CODING 1";
    const [candidateId, setCandidateId] = useState("Loading...");
    const [studentData, setStudentData] = useState<any>(null);

    const [languages, setLanguages] = useState<any[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("python");

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
                if (!token) {
                    setCandidateId("CP-2024-9XBR"); // fallback if no token
                    return;
                }
                
                let studentId = "";
                try {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    studentId = String(payload.user_id || payload.id || payload.candidate_id || payload.sub || "");
                } catch (e) {
                    console.error("Error decoding token", e);
                }
                
                if (studentId) {
                    const response = await fetch(`${API_BASE_URL}/student/students/${studentId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        const student = Array.isArray(data) ? data[0] : data;
                        setStudentData(student);
                        
                        if (student?.id) {
                            setCandidateId(String(student.id));
                        } else if (student?.full_name) {
                            setCandidateId(student.full_name);
                        } else {
                            setCandidateId("CP-2026-XXXX");
                        }
                    } else {
                        setCandidateId("CP-2026-XXXX");
                    }
                } else {
                    setCandidateId("CP-2024-9XBR"); // fallback if studentId not found
                }
            } catch (error) {
                console.error("Error fetching student details:", error);
                setCandidateId("CP-2026-XXXX");
            }
        };

        fetchStudentDetails();
    }, []);

    // Fetch languages
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/languages/`);
                if (response.ok) {
                    const data = await response.json();
                    setLanguages(data);
                    if (data.length > 0) {
                        setSelectedLanguage(data[0].lang_name);
                    }
                }
            } catch (error) {
                console.error("Error fetching languages:", error);
            }
        };
        fetchLanguages();
    }, []);

    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraError, setCameraError] = useState(false);

    // Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    // Camera
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch {
                setCameraError(true);
            }
        };

        startCamera();

        return () => {
            if (videoRef.current?.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach((t) => t.stop());
            }
        };
    }, []);

    // ================= BUTTON FUNCTIONS =================

    const handleSend = () => {
        if (!input.trim()) return;
        setOutput((prev) => prev + `\nInput Sent: ${input}`);
        setInput("");
    };

    const handleRunCode = async () => {
        setOutput("Running code...\n");

        try {
            const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
            const courseId = parseInt(localStorage.getItem("selectedCourseId") || "0") || 0;
            const currentQuestion = questions[activeIdx];
            const questionId = currentQuestion?.question_id || currentQuestion?.id || 0;

            const response = await fetch(`${API_BASE_URL}/ind/coding/student/questions/run`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    course_id: courseId,
                    question_id: questionId,
                    language: selectedLanguage.toLowerCase(),
                    source_code: code,
                    user_input: input
                })
            });

            if (response.ok) {
                const data = await response.json();
                // Depending on the exact response structure, you might need to adjust this. 
                // We're handling both primitive string responses and JSON objects with an "output" field.
                const runOutput = typeof data === 'string' ? data : (data.output || JSON.stringify(data, null, 2));
                setOutput((prev) => prev + `\nOutput:\n${runOutput}\n`);
            } else {
                const errData = await response.json().catch(() => ({}));
                setOutput((prev) => prev + `\nError running code: ${errData.detail || response.statusText}\n`);
            }
        } catch (error) {
            console.error("Run code error:", error);
            setOutput((prev) => prev + "\nFailed to run code. Please try again.\n");
        }
    };

    const handleRunTestCases = async () => {
        setOutput("Running test cases...\n");

        try {
            const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
            const examId = examState?.examData?.examId || location.state?.examId;
            const courseId = parseInt(localStorage.getItem("selectedCourseId") || "0") || 0;
            
            if (!examId) {
                setOutput((prev) => prev + "\nError: Exam ID not found.\n");
                return;
            }

            const submissions = questions.map((q, idx) => ({
                question_id: q.question_id || q.id,
                code: idx === activeIdx ? code : ""
            }));

            const response = await fetch(`${API_BASE_URL}/ind/coding/student/exams/${examId}/test-cases`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    course_id: courseId,
                    exam_id: examId,
                    language: selectedLanguage.toLowerCase(),
                    submissions: submissions
                })
            });

            if (response.ok) {
                const data = await response.json();
                const runOutput = typeof data === 'string' ? data : (data.output || JSON.stringify(data, null, 2));
                setOutput((prev) => prev + `\nTest Cases Output:\n${runOutput}\n`);
            } else {
                const errData = await response.json().catch(() => ({}));
                setOutput((prev) => prev + `\nError running test cases: ${errData.detail || response.statusText}\n`);
            }
        } catch (error) {
            console.error("Run test cases error:", error);
            setOutput((prev) => prev + "\nFailed to run test cases. Please try again.\n");
        }
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
            const examId = examState?.examData?.examId || location.state?.examId;
            const courseId = parseInt(localStorage.getItem("selectedCourseId") || "0") || 0;
            
            if (!examId) {
                setOutput((prev) => prev + "\nError: Exam ID not found.\n");
                return;
            }

            // We submit the current code for the active question. 
            // If you want to track code per question, you can update the code state to be an object/array.
            const submissions = questions.map((q, idx) => ({
                question_id: q.question_id || q.id,
                code: idx === activeIdx ? code : ""
            }));

            const response = await fetch(`${API_BASE_URL}/ind/coding/student/exams/${examId}/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    course_id: courseId,
                    language: selectedLanguage.toLowerCase(),
                    submissions: submissions
                })
            });

            if (response.ok) {
                setOutput((prev) => prev + "\nExam Submitted Successfully 🎉\n");
                setShowSuccessModal(true);
            } else {
                const errData = await response.json().catch(() => ({}));
                setOutput((prev) => prev + `\nError submitting exam: ${errData.detail || response.statusText}\n`);
            }
        } catch (error) {
            console.error("Submit error:", error);
            setOutput((prev) => prev + "\nFailed to submit exam. Please try again.\n");
        }
    };

    // ====================================================

    return (
        <div className="h-screen flex flex-col bg-[#f5f6fb]">
            {/* HEADER */}
            <div className="h-[90px] bg-white shadow-sm border-b px-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img src="src/assests/Devlogo.png" className="h-14" />
                    <h1 className="text-xl font-bold">{examTitle}</h1>
                </div>

                <div className="hidden md:flex flex-1 items-center justify-center px-8">
                    <div className="w-full max-w-xl">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>OVERALL PROGRESS</span>
                            <span>
                                {Math.round(((activeIdx + 1) / questions.length) * 100)}%
                            </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                            <div
                                className="h-2 bg-purple-600 rounded-full"
                                style={{
                                    width: `${((activeIdx + 1) / questions.length) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <p className="text-xs text-gray-400">TIME REMAINING</p>
                        <p className="font-mono font-bold text-lg">
                            {formatTime(timeLeft)}
                        </p>
                    </div>

                    <div className="hidden md:block text-center">
                        <p className="text-xs text-gray-400">CANDIDATE ID</p>
                        <p className="font-mono font-bold">{candidateId}</p>
                    </div>

                    <div className="relative">
                        <div className="w-24 h-16 rounded-lg overflow-hidden bg-black">
                            {cameraError ? (
                                <div className="w-full h-full flex items-center justify-center text-white text-xs">
                                    No Camera
                                </div>
                            ) : (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    className="w-full h-full object-cover scale-x-[-1]"
                                />
                            )}
                        </div>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            {/* MAIN */}
            <div className="flex flex-1 overflow-hidden">
                {/* SIDEBAR */}
                <div className="w-16 bg-[#f0eef6] flex flex-col items-center py-4 gap-3">
                    <p className="text-xs text-purple-700 font-bold">QNS</p>
                    {questions.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIdx(i)}
                            className={`w-10 h-10 rounded-xl font-bold ${i === activeIdx
                                    ? "bg-purple-600 text-white"
                                    : "bg-white border text-gray-600"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                {/* QUESTION PANEL */}
                <div className="w-1/2 p-6 overflow-y-auto">
                    <div className="bg-white p-6 rounded-xl shadow">
                        {questions.length > 0 && (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold">{questions[activeIdx]?.title || "Reverse String"}</h2>
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs capitalize ${
                                            questions[activeIdx]?.difficulty === 'easy' ? 'bg-green-100 text-green-600' :
                                            questions[activeIdx]?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-red-100 text-red-600'
                                        }`}>
                                            {questions[activeIdx]?.difficulty || "Hard"}
                                        </span>
                                        <span className="px-3 py-1 bg-gray-100 text-xs font-bold">
                                            {questions[activeIdx]?.total_marks || questions[activeIdx]?.marks || "10"} PTS
                                        </span>
                                    </div>
                                </div>

                                <h3 className="font-semibold mb-2">Problem Statement</h3>
                                <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                                    {questions[activeIdx]?.problem_description || "Lorem Ipsum..."}
                                </p>

                                <h3 className="font-semibold mb-2">Constraints</h3>
                                <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                                    {questions[activeIdx]?.constraints || "Not specified"}
                                </p>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div>
                                        <h4 className="font-semibold mb-2">Sample Input</h4>
                                        <div className="bg-gray-100 p-3 rounded whitespace-pre-wrap font-mono text-sm">{questions[activeIdx]?.input_format || "N/A"}</div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Expected Output</h4>
                                        <div className="bg-gray-100 p-3 rounded whitespace-pre-wrap font-mono text-sm">{questions[activeIdx]?.output_format || "N/A"}</div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="w-1/2 flex flex-col">
                    <div className="bg-white p-3 border-b">
                        <select 
                            className="border px-3 py-1 rounded"
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                        >
                            {languages.map((lang) => (
                                <option key={lang.lang_id} value={lang.lang_name}>
                                    {lang.lang_name}
                                </option>
                            ))}
                            {languages.length === 0 && <option>Loading...</option>}
                        </select>
                    </div>

                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-[#0f172a] text-white p-4 font-mono outline-none resize-none"
                    />

                    {/* OUTPUT */}
                    <div className="h-40 bg-black text-green-400 p-4 overflow-auto text-sm">
                        <p className="text-gray-400 mb-2">Output & Console</p>
                        <pre>{output || "Run your code to see results"}</pre>
                    </div>

                    {/* CONTROLS */}
                    <div className="bg-white p-4 flex items-center gap-3">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 border rounded px-3 py-2"
                        />

                        <button
                            onClick={handleSend}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Send
                        </button>

                        <button
                            onClick={handleRunCode}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Run Code
                        </button>

                        <button
                            onClick={handleRunTestCases}
                            className="bg-gray-200 px-4 py-2 rounded"
                        >
                            Run Test Cases
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="bg-purple-600 text-white px-4 py-2 rounded"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Congratulations
                        </h2>

                        {/* Message */}
                        <p className="text-gray-600 mb-8 text-lg">
                            Your exam has been completed
                        </p>

                        {/* Button */}
                        <button
                            onClick={() => navigate("/individualoverview")}
                            className="w-full py-4 rounded-2xl text-white font-semibold text-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:opacity-90 transition"
                        >
                            Go to Dashboard →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IndividualCompiler;
