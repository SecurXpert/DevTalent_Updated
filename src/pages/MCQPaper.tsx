import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Clock, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Devlogo from "../assests/Devlogo.png";
import { API_BASE_URL } from "@/pages/Services/api/api";

interface Option {
  id: number;
  text: string;
  image_url?: string;
}

interface Question {
  id: number;
  question_id?: number;
  text: string;
  image_url?: string;
  options: Option[];
}

const MCQPaper: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");

  // Get exam data from navigation state
  const examDataFromState = location.state?.examData;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [duration, setDuration] = useState(0);
  const [examTitle, setExamTitle] = useState("Exam");
  const [userId, setUserId] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [cameraError, setCameraError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Decode JWT to get user ID and college name
  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const extractedUserId = String(
        payload.user_id ||
        payload.id ||
        payload.candidate_id ||
        payload.sub ||
        "",
      );
      setUserId(extractedUserId);

      // Get college name from token or localStorage
      const extractedCollegeName = payload.college_name ||
        payload.college ||
        localStorage.getItem("userCollege") ||
        "";
      setCollegeName(extractedCollegeName);
    } catch (err) {
      console.error("Invalid token");
      setUserId("");
      setCollegeName("");
    }
  }, [token, navigate]);

  // Fetch paper
  useEffect(() => {
    const fetchPaper = async () => {
      try {
        // Check if we have exam details from state
        if (examDataFromState) {
          setExamTitle(examDataFromState.title || "MCQ Exam");
          const durationMinutes = examDataFromState.duration || 10;
          setDuration(durationMinutes);
          setTimeLeft(durationMinutes * 60);
          setHasStarted(true);
        } else {
          // Fallback to fetch exam details if state is missing
          const examRes = await axios.get(
            `${API_BASE_URL}/exam/exams`,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          console.log("Exams API Response:", examRes.data);

          // Find the exam that matches the current attempt
          const currentExam = Array.isArray(examRes.data) ? examRes.data[0] : examRes.data;

          if (currentExam) {
            const dynamicTitle = currentExam.title || "MCQ Exam";
            setExamTitle(dynamicTitle);

            const durationMinutes = currentExam.duration_minutes || 10;
            setDuration(durationMinutes);
            setTimeLeft(durationMinutes * 60);
            setHasStarted(true);
          }
        }

        // Use questions from state
        let paper: Question[] = [];
        const hasQuestionsInState = examDataFromState && examDataFromState.questions && 
          (Array.isArray(examDataFromState.questions) ? examDataFromState.questions.length > 0 : Object.keys(examDataFromState.questions).length > 0);
          
        if (hasQuestionsInState) {
          paper = Array.isArray(examDataFromState.questions) 
            ? examDataFromState.questions 
            : Object.values(examDataFromState.questions);
        } else if (examDataFromState && examDataFromState.examId) {
          // Fallback to fetching questions directly using the examId
          const qRes = await axios.get(
            `${API_BASE_URL}/ind/mcq/student/exams/${examDataFromState.examId}/questions?limit=500`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          
          if (Array.isArray(qRes.data)) {
            paper = qRes.data;
          } else if (qRes.data && Array.isArray(qRes.data.questions)) {
            paper = qRes.data.questions;
          } else if (qRes.data && typeof qRes.data === 'object') {
            // It might be a Record object
            paper = Object.values(qRes.data);
          }
        }
        
        if (!paper || paper.length === 0) {
          console.error("Parsed paper is empty or invalid. examDataFromState:", examDataFromState);
          throw new Error("No questions found in exam data.");
        }
        
        setQuestions(Array.isArray(paper) ? paper.flat() : paper);
      } catch (err: any) {
        console.error("Paper fetch error:", err);
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);
        alert(err.response?.data?.detail || "Failed to fetch exam paper");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [attemptId]);

  // Timer countdown
  useEffect(() => {
    console.log("Timer effect running, timeLeft:", timeLeft, "duration:", duration);
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && questions.length > 0 && duration > 0 && hasStarted) {
      handleAutoSubmit();
    }
  }, [timeLeft, duration, questions.length, hasStarted]);

  // Camera enforcement - start only after loading is complete
  useEffect(() => {
    if (!loading && questions.length > 0) {
      const startCamera = async () => {
        try {
          setCameraError(false);
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false, // Only request video to reduce permission issues
          });

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera access error:", err);
          setCameraError(true);
          // Show a more user-friendly error message
          setTimeout(() => {
            alert("Camera access could not be obtained. You can continue with the exam, but camera proctoring will not be available.");
          }, 1000);
        }
      };

      startCamera();

      return () => {
        if (videoRef.current?.srcObject) {
          (videoRef.current.srcObject as MediaStream)
            .getTracks()
            .forEach((track) => track.stop());
        }
      };
    }
  }, [loading, questions.length]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const selectOption = (questionIndex: number, optionId: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionId }));
  };

  const handleSubmit = async () => {
    const examId = location.state?.examData?.examId || attemptId;
    const courseId = location.state?.examData?.courseId || parseInt(localStorage.getItem("selectedCourseId") || "0") || 0;
    if (!examId) return;

    const submittedAnswers = Object.entries(selectedAnswers).map(
      ([qIdx, chosenOptionId]) => ({
        question_id:
          questions[Number(qIdx)].question_id || questions[Number(qIdx)].id,
        selected_option_id: chosenOptionId,
      }),
    );

    try {
      await axios.post(
        `${API_BASE_URL}/ind/mcq/student/exams/${examId}/submit`,
        { course_id: courseId, answers: submittedAnswers },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to submit exam");
    }
  };

  const handleAutoSubmit = async () => {
    setShowSuccessModal(true);
    const examId = location.state?.examData?.examId || attemptId;
    const courseId = location.state?.examData?.courseId || parseInt(localStorage.getItem("selectedCourseId") || "0") || 0;
    try {
      await axios.post(
        `${API_BASE_URL}/ind/mcq/student/exams/${examId}/submit`,
        { course_id: courseId, answers: [] },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch { }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const q = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#f6f5fb]">
      {/* HEADER */}
      <div className="bg-white shadow-sm px-3 md:px-4 py-2 md:py-3 flex items-center justify-between flex-wrap gap-2">
        {/* Left */}
        <div className="flex items-center gap-2">
          {/* <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
            TD
          </div> */}

          <img
            src={Devlogo}
            alt="DevTalent Logo"
            className="h-16 w-16 object-contain"
          />
          <h1 className="text-sm font-semibold">Welcome To Exam Portal</h1>
        </div>

        {/* Center */}
        <div className="text-center hidden lg:block">
          <p className="text-xs text-gray-400">College</p>
          <p className="text-sm font-semibold">{collegeName || "Loading..."}</p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-400">TIME REMAINING</p>
            <p className="text-sm font-semibold">{formatTime(timeLeft)}</p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-400">CANDIDATE ID</p>
            <p className="text-sm font-semibold">{userId || "Loading..."}</p>
          </div>

          <div className="relative pt-1">
            <div className="w-16 h-12 sm:w-20 sm:h-16 rounded-lg overflow-hidden bg-black">
              {cameraError ? (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <svg className="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">Camera Off</span>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              )}
            </div>
            {!cameraError && (
              <span className="absolute top-2 left-20 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-3 md:px-6 py-4 md:py-6">
        {/* EXAM TITLE */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold">{examTitle}</h2>
          {/* <p className="text-gray-500 text-sm">Linux operating systems</p> */}
        </div>

        {/* PROGRESS */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>
              Questions {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span>
              {Math.round(
                ((currentQuestionIndex + 1) / questions.length) * 100,
              )}
              %
            </span>
          </div>

          <div className="h-2 md:h-3 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* QUESTION CARD */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <p className="font-semibold mb-3">
            Question {currentQuestionIndex + 1}
          </p>

          {/* <span className="inline-block bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-sm mb-4">
            Introduction to linux
          </span> */}

          <h3 className="text-lg font-semibold mb-6">{q.text}</h3>

          <div className="space-y-4">
            {(() => {
              let optionsToRender: any[] = [];
              if (Array.isArray(q.options)) {
                optionsToRender = q.options;
              } else if (Array.isArray(q.choices)) {
                optionsToRender = q.choices;
              } else if (q.option_1 || q.option_a || q.option1) {
                // Handle flat option structures
                const flatOptions = [];
                for (let i = 1; i <= 6; i++) {
                  const letter = String.fromCharCode(96 + i); // a, b, c, d
                  const text = q[`option_${i}`] || q[`option${i}`] || q[`option_${letter}`] || q[`option${letter}`];
                  if (text) flatOptions.push({ id: i, text: text });
                }
                optionsToRender = flatOptions;
              } else if (typeof q.options === 'object' && q.options !== null) {
                // If options is a record object
                optionsToRender = Object.entries(q.options).map(([k, v]: any) => ({ id: k, text: v.text || v }));
              }
              
              if (optionsToRender.length === 0) {
                 return <p className="text-red-500">No options available for this question. (Debug info: {JSON.stringify(q)})</p>;
              }

              return optionsToRender.map((opt, idx) => {
              const selected = selectedAnswers[currentQuestionIndex] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => selectOption(currentQuestionIndex, opt.id)}
                  className={`w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg border transition
 
                  ${selected ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:bg-gray-50"}
                `}
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-left">{opt.text}</span>
                </button>
              );
            })})()}
          </div>

          {/* NAVIGATION */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 md:mt-8">
            <button
              onClick={() =>
                setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
              }
              disabled={currentQuestionIndex === 0}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border text-gray-500 disabled:opacity-50"
            >
              ‹ Previous
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() =>
                  setCurrentQuestionIndex(currentQuestionIndex + 1)
                }
                className="w-full sm:w-auto px-6 py-2 rounded-lg bg-indigo-600 text-white"
              >
                Next ›
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-green-600 text-white"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center animate-fadeIn">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Congratulations!!
            </h2>

            {/* Message */}
            <p className="text-gray-600 mb-8">
              Your exam has been successfully completed.
            </p>

            {/* Button */}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/overview");
              }}
              className="w-full py-3 rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:opacity-90 transition"
            >
              Go to Dashboard →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MCQPaper;