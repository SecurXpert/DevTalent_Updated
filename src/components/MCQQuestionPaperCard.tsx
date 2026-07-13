import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Clock, Calendar, AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface Exam {
  id: number;
  title: string;
  window_start: string;
  window_end: string;
  college_name: string;
  duration_minutes: number;
}

interface Option {
  id: number;
  text: string;
  image_url?: string | null;
}

interface Question {
  id?: number;
  question_id?: number;
  text: string;
  image_url?: string | null;
  options: Option[];
}

const MCQQuestionPaperCard: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingExamId, setStartingExamId] = useState<number | null>(null);

  const [examInProgress, setExamInProgress] = useState(false);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examTitle, setExamTitle] = useState("Exam");
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState<string | null>(null);

  const collegeName = localStorage.getItem("userCollege");
  const token = localStorage.getItem("userToken");

  const [attemptedExamIds, setAttemptedExamIds] = useState<Set<number>>(new Set());

  const videoRef = useRef<HTMLVideoElement>(null);

  const STORAGE_KEY = 'ongoingMcqExam';
  const TAB_ATTEMPT_KEY = 'mcqTabAttempts';

  useEffect(() => {
    const saved = localStorage.getItem("attemptedExamIds");
    if (saved) {
      setAttemptedExamIds(new Set(JSON.parse(saved)));
    }
  }, []);

  // Load ongoing exam from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const parsed = JSON.parse(savedState);
      const savedStartTime = new Date(parsed.startTime);
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - savedStartTime.getTime()) / 1000);
      const calculatedTimeLeft = parsed.duration * 60 - elapsed;

      setDuration(parsed.duration);
      setStartTime(parsed.startTime);

      if (calculatedTimeLeft > 0) {
        setAttemptId(parsed.attemptId);
        setStartingExamId(parsed.examId);
        setQuestions(parsed.questions);
        setSelectedAnswers(parsed.selectedAnswers || {});
        setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
        setExamTitle(parsed.examTitle);
        setTimeLeft(calculatedTimeLeft);
        setExamInProgress(true);
      } else {
        // Time already over → auto-submit
        setAttemptId(parsed.attemptId);
        setQuestions(parsed.questions);
        setSelectedAnswers(parsed.selectedAnswers || {});
        handleAutoSubmitDueToTime();
      }
    }
  }, []);

  // Save ongoing exam state
  useEffect(() => {
    if (examInProgress && startTime && duration && attemptId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        attemptId,
        examId: startingExamId,
        startTime,
        duration,
        questions,
        selectedAnswers,
        currentQuestionIndex,
        examTitle
      }));
    }
  }, [selectedAnswers, currentQuestionIndex, examInProgress, attemptId, startingExamId, examTitle, questions, startTime, duration]);

  // Timer countdown
  useEffect(() => {
    if (examInProgress && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && examInProgress) {
      handleAutoSubmitDueToTime();
    }
  }, [timeLeft, examInProgress]);

  // Camera setup with enforcement
  useEffect(() => {
    if (examInProgress && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Camera access error:", err);
          alert("Camera and microphone access is mandatory to take this exam. Please allow access and refresh.");
          // Force user to allow permission
          setExamInProgress(false);
          localStorage.removeItem(STORAGE_KEY);
          window.location.reload();
        });
    }

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [examInProgress]);


  useEffect(() => {
    if (examInProgress) {
      // Block browser back
      window.history.pushState(null, "", window.location.href);
      const handlePopState = () => {
        window.history.pushState(null, "", window.location.href);
        alert("You cannot leave the exam. Stay on this page.");
      };
      window.addEventListener("popstate", handlePopState);

      // Detect multiple tabs
      const channel = new BroadcastChannel('mcq-exam-channel');
      let tabAttempts = parseInt(localStorage.getItem(TAB_ATTEMPT_KEY) || "0");

      const handleStorage = (e: StorageEvent) => {
        if (e.key === TAB_ATTEMPT_KEY) {
          tabAttempts = parseInt(e.newValue || "0");
          if (tabAttempts >= 3) {
            alert("Multiple attempts detected. Exam auto-submitted for security.");
            handleAutoSubmitDueToTabViolation();
          }
        }
      };

      window.addEventListener("storage", handleStorage);

      // Increment attempt count
      tabAttempts++;
      localStorage.setItem(TAB_ATTEMPT_KEY, tabAttempts.toString());
      channel.postMessage({ type: 'tab-opened', count: tabAttempts });

      return () => {
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("storage", handleStorage);
        channel.close();
        localStorage.removeItem(TAB_ATTEMPT_KEY);
      };
    }
  }, [examInProgress]);

 const fetchExams = async () => {
  if (!token) {
    toast.error("No authentication token found. Please login again.");
    setLoading(false);
    return;
  }

  if (!collegeName) {
    toast.error("College name not found in localStorage. Please login again.");
    setLoading(false);
    return;
  }

  console.log("DEBUG → Raw collegeName from storage:", collegeName);
  console.log("DEBUG → Token (first 20 chars):", token.substring(0, 20) + "...");

  try {
    const response = await axios.get(
      "https://api.devtalent.securxperts.com:8000/exam/exams",
      {
        params: {
          college_name: collegeName,     
          // interest: "technical|nontechnical",     
    
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("DEBUG → Exams API response:", response.data);
    setExams(response.data || []);
  } catch (err: any) {
    console.error("EXAMS FETCH FAILED:", err);
    if (err.response) {
      console.error("Response data:", err.response.data);
      console.error("Response status:", err.response.status);
      toast.error(
        `Error ${err.response.status}: ${err.response.data?.detail || "Failed to load exams"}`
      );
    } else {
      toast.error("Network error - cannot reach the server");
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (token && collegeName) {
      fetchExams();
    } else {
      toast.error("Please login again");
      setLoading(false);
    }
  }, []);

  const startExam = async (examId: number, duration: number, title: string) => {
    setStartingExamId(examId);
    setSelectedAnswers({});

    try {
      const startRes = await axios.post(
        "https://api.devtalent.securxperts.com:8000/exam/exams/start/auto",
        { exam_id: examId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newAttemptId = startRes.data.attempt_id || startRes.data.id;
      if (!newAttemptId) throw new Error("Invalid response");

      setAttemptId(newAttemptId);
      setDuration(duration);
      setStartTime(new Date().toISOString());
      setTimeLeft(duration * 60);
      setExamTitle(title);

      const paperRes = await axios.get(
        `https://api.devtalent.securxperts.com:8000/exam/attempts/${newAttemptId}/paper`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const questionsList: Question[] = Array.isArray(paperRes.data)
        ? paperRes.data
        : paperRes.data.questions || [];

      if (questionsList.length === 0) throw new Error("No questions");

      setQuestions(questionsList);
      setExamInProgress(true);

      // Mark as attempted immediately
      const newAttempted = new Set(attemptedExamIds);
      newAttempted.add(examId);
      setAttemptedExamIds(newAttempted);
      localStorage.setItem("attemptedExamIds", JSON.stringify(Array.from(newAttempted)));

    } catch (err: any) {
      setStartingExamId(null);
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to start exam";
      alert(errorMessage);

      if (errorMessage.toLowerCase().includes("already") || 
          errorMessage.toLowerCase().includes("time over") || 
          errorMessage.toLowerCase().includes("window") ||
          errorMessage.toLowerCase().includes("attempted")) {
        const newAttempted = new Set(attemptedExamIds);
        newAttempted.add(examId);
        setAttemptedExamIds(newAttempted);
        localStorage.setItem("attemptedExamIds", JSON.stringify(Array.from(newAttempted)));
      }
    }
  };

  const selectOptionByIndex = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: questions[questionIndex].options[optionIndex].id
    }));
  };

 const handleSubmit = async () => {
  if (!attemptId) {
    toast.error("No exam attempt found");
    return;
  }

  if ((window as any).isSubmitting) return;
  (window as any).isSubmitting = true;

  try {
    console.log("Submitting answers...");
    console.log("Questions length:", questions.length);
    console.log("Selected answers:", selectedAnswers);
    console.log("Questions array:", questions);

    const answersPayload = Object.entries(selectedAnswers)
      .map(([questionIndexStr, chosenOptionId]) => {
        const index = Number(questionIndexStr);
        const question = questions[index];

        console.log(`DEBUG: Processing entry - questionIndexStr: ${questionIndexStr}, index: ${index}, chosenOptionId: ${chosenOptionId}`);
        console.log(`DEBUG: Question at index ${index}:`, question);

        // Safety checks
        if (!question) {
          console.warn(`Question not found for index ${index} — skipping`);
          return null;
        }

        if (typeof chosenOptionId !== 'number') {
          console.warn(`Invalid chosen option for question ${index} — skipping`);
          return null;
        }

        const result = {
          question_id: question.question_id || question.id,  // Handle both question_id and id field names
          chosen_option_id: chosenOptionId
        };

        console.log(`DEBUG: Result for question ${index}:`, result);
        return result;
      })
      .filter((item): item is { question_id: number; chosen_option_id: number } => item !== null);

    console.log("Final payload to send:", JSON.stringify({ answers: answersPayload }, null, 2));

    if (answersPayload.length === 0) {
      toast.error("No valid answers to submit.");
      (window as any).isSubmitting = false;
      return;
    }

    console.log("Payload to send:", JSON.stringify({ answers: answersPayload }, null, 2));

    const response = await axios.post(
      `https://api.devtalent.securxperts.com:8000/exam/attempts/${attemptId}/submit`,
      { answers: answersPayload },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Submit success:", response.data);
    toast.success("Exam submitted successfully!");
    resetExamAfterSubmit();

  } catch (err: any) {
    console.error("Submit failed:", err.response?.data || err.message);
    toast.error(
      err.response?.data?.detail ||
      err.response?.data?.message ||
      "Failed to submit exam"
    );
  } finally {
    (window as any).isSubmitting = false;
  }
};


  const handleAutoSubmitDueToTime = async () => {
    alert("Time Over! Exam auto-submitted.");
    if (attemptId) {
      try {
        await axios.post(
          `https://api.devtalent.securxperts.com:8000/exam/attempts/${attemptId}/submit`,
          { answers: [] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (e) { }
    }
    resetExamAfterSubmit();
  };

  const handleAutoSubmitDueToTabViolation = async () => {
    if (attemptId) {
      try {
        await axios.post(
          `https://api.devtalent.securxperts.com:8000/exam/attempts/${attemptId}/submit`,
          { answers: [] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (e) { }
    }
    alert("Security violation detected. Exam auto-submitted.");
    resetExamAfterSubmit();
  };

  const resetExamAfterSubmit = () => {
    // Mark as completed
    if (startingExamId || attemptId) {
      const examIdToMark = startingExamId || exams.find(e => e.title === examTitle)?.id;
      if (examIdToMark) {
        const newAttempted = new Set(attemptedExamIds);
        newAttempted.add(examIdToMark);
        setAttemptedExamIds(newAttempted);
        localStorage.setItem("attemptedExamIds", JSON.stringify(Array.from(newAttempted)));
      }
    }

    // Cleanup
    setExamInProgress(false);
    setAttemptId(null);
    setQuestions([]);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeft(0);
    setDuration(0);
    setStartTime(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TAB_ATTEMPT_KEY);

    // Redirect to home
    fetchExams();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const formatDateTime = (dateStr: string) => {
    return format(new Date(dateStr), "dd MMM yyyy, hh:mm a");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-blue-600">Loading exams...</div>
      </div>
    );
  }

  if (examInProgress && questions.length > 0) {
    const q = questions[currentQuestionIndex];

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 flex flex-col md:flex-row justify-between items-center gap-6 relative">
            <div className="text-left">
              <h1 className="text-3xl font-bold text-gray-800">{examTitle}</h1>
              <p className="text-lg text-gray-600 mt-1">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>

            {/* CAMERA - Always visible */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-12 z-20">
              <div className="bg-white rounded-full shadow-2xl p-3 border-4 border-green-500">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
              <p className="text-xs text-center text-gray-600 mt-2 font-medium">Live View (Required)</p>
            </div>

            <div className="text-right">
              <div className="text-5xl font-bold text-red-600 flex items-center justify-end gap-3">
                <Clock className="w-12 h-12" />
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-gray-500">Time Remaining</p>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 leading-relaxed">
              {q.text}
            </h2>

            {q.image_url && (
              <div className="mb-8 flex justify-center">
                <img src={q.image_url} alt="Question" className="max-w-full h-auto rounded-lg shadow-md" />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {q.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === option.id;
                const label = ["A.", "B.", "C.", "D."][idx] || `${idx + 1}.`;

                return (
                  <button
                    key={option.id}
                    onClick={() => selectOptionByIndex(currentQuestionIndex, idx)}
                    className={`p-6 rounded-xl border-2 text-left text-lg transition-all flex items-center gap-4
                      ${isSelected
                        ? "border-blue-600 bg-blue-50 shadow-xl font-semibold"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                  >
                    <span className="font-bold text-xl text-blue-700 min-w-[2.5rem]">{label}</span>
                    <span className="flex-1">{option.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {Object.keys(selectedAnswers).length} / {questions.length} Answered
              </p>
            </div>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-10 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-xl flex items-center gap-3"
              >
                <CheckCircle className="w-7 h-7" />
                Final Submit
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-8 bg-gray-200 rounded-full h-5 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-blue-600 transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Exam List View
  return (
    <div className="min-h-screen from-blue-50 via-indigo-50 to-purple-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">MCQ'S</h1>
        </div>

        {exams.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <p className="text-2xl text-gray-600">No active exams right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exams.map((exam) => {
              const now = new Date();
              const start = new Date(exam.window_start);
              const end = new Date(exam.window_end);
              const isActive = now >= start;
              const isEnded = now > end;
              const isAttempted = attemptedExamIds.has(exam.id);

              return (
                <div
                  key={exam.id}
                  className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300"
                >
                  <div className="p-6 space-y-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-bold text-gray-800">{exam.title}</h3>
                      <span className="bg-[#33329C] text-white px-4 py-2 rounded-full text-sm font-bold">
                        {exam.duration_minutes} Mins
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar className="w-5 h-5 text-[#33329C]" />
                      <span className="text-base">
                        Start: {formatDateTime(exam.window_start)}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 text-gray-700">
                      <Clock className="w-5 h-5 text-[#33329C] mt-0.5" />
                      <div className="text-base">
                        Duration {exam.duration_minutes} mins<br />
                        1 Question. 10 marks
                      </div>
                    </div>

                    {isAttempted ? (
                      <button disabled className="w-full py-5 bg-gradient-to-r from-[#29287D] to-[#3D0B46] text-white font-bold text-xl rounded-2xl cursor-not-allowed opacity-80 shadow-lg">
                        Exam Completed
                      </button>
                    ) : isEnded ? (
                      <div className="w-full py-5 bg-gray-200 text-gray-500 font-bold text-xl rounded-2xl text-center">
                        Exam Ended
                      </div>
                    ) : isActive ? (
                      <button
                        onClick={() => startExam(exam.id, exam.duration_minutes, exam.title)}
                        disabled={startingExamId === exam.id}
                        className="w-full py-5 bg-gradient-to-r from-indigo-700 to-purple-800 text-white font-bold text-xl rounded-2xl hover:from-indigo-800 hover:to-purple-900 disabled:opacity-70 shadow-lg transition-all"
                      >
                        {startingExamId === exam.id ? "Please wait..." : "Start Exam Now"}
                      </button>
                    ) : (
                      <div className="w-full py-5 bg-gray-200 text-gray-500 font-bold text-xl rounded-2xl text-center">
                        Not Started Yet
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MCQQuestionPaperCard;



