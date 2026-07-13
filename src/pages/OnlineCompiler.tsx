// src/pages/OnlineCompiler.tsx
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AceEditor from "react-ace";
import axios from "axios";
import { toast } from "sonner";
import {
  Loader2,
  Clock,
  Play,
  Code2,
  FileText,
  Camera,
  User,
} from "lucide-react";
import Devlogo from "../assests/Devlogo.png";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-php";
import "ace-builds/src-noconflict/theme-textmate"; // Light theme
import { API_BASE_URL } from "@/pages/Services/api/api";

export default function OnlineCompiler() {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId } = location.state || {};
  const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");

  const [questions, setQuestions] = useState<any[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [examTitle, setExamTitle] = useState("Coding Exam");
  const [userId, setUserId] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState(false);
  const [fileName, setFileName] = useState(".java");

  const ws = useRef<WebSocket | null>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  const currentQuestion = questions[activeIdx];
  const [examStartedAt, setExamStartedAt] = useState<number | null>(null);

  // Add these state variables at the top with your other useState
  const [duration, setDuration] = useState<number>(0); // Total duration in minutes
  const [timeLeft, setTimeLeft] = useState<number>(0); // Remaining seconds
  const [isTimeUp, setIsTimeUp] = useState(false);
  const TIMER_STORAGE_KEY = `exam_timer_${examId}_${userId}`;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitPopupOpen, setIsSubmitPopupOpen] = useState(false);
  const [outputs, setOutputs] = useState<Record<number, string>>({});
  const [testResultsMap, setTestResultsMap] = useState<Record<number, any[]>>(
    {},
  );
  const [testResults, setTestResults] = useState<any[] | null>(null);

  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);
  const [languagesList, setLanguagesList] = useState<{lang_id: number, lang_name: string, description: string}[]>([]);
  const buildPayload = (extra: Record<string, any> = {}) => {
    const currentCode = answers[activeIdx] || "";

    const payload: any = {
      code: currentCode.trim(),
      language,
      ...extra,
    };

    if (language === "java") {
      payload.file_name = fileName?.trim() || ".java";
    }

    return payload;
  };

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("https://apicompiler.devtalent.securxperts.com:8000/languages/", {
          method: "GET",
          headers: {
            "accept": "application/json",
          }
        });
        if (response.ok) {
          const data = await response.json();
          setLanguagesList(data);
        }
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };
    fetchLanguages();
  }, []);

  // Add this useEffect inside your OnlineCompiler component (anywhere after the other useEffects)

  const handleTimeUp = async () => {
    localStorage.removeItem(TIMER_STORAGE_KEY);
    toast.warning("Time's up! Submitting your answers...");
    await submitCode();
    toast.error("Exam time ended. Redirecting...");
    setTimeout(() => navigate("/overview"), 3000);
  };

  // Now your timer useEffect (this one already uses handleTimeUp)
  useEffect(() => {
    if (!questions.length || duration === 0 || !userId || !examId) return;

    const totalSeconds = duration * 60;
    const saved = localStorage.getItem(TIMER_STORAGE_KEY);

    let remainingSeconds: number;

    if (saved) {
      const savedData = JSON.parse(saved);
      const elapsed = Math.floor((Date.now() - savedData.startedAt) / 1000);
      remainingSeconds = Math.max(totalSeconds - elapsed, 0);
    } else {
      remainingSeconds = totalSeconds;
      localStorage.setItem(
        TIMER_STORAGE_KEY,
        JSON.stringify({
          startedAt: Date.now(),
          totalSeconds,
        }),
      );
    }

    setTimeLeft(remainingSeconds);
    setExamStartedAt(Date.now());

    if (remainingSeconds <= 0) {
      setIsTimeUp(true);
      handleTimeUp(); // Now safe — declared above
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem(TIMER_STORAGE_KEY);
          setIsTimeUp(true);
          handleTimeUp(); // Safe here too
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions.length, duration, userId, examId]); // Note: remove handleTimeUp from deps if not needed

  // Now add the anti-tab-switching useEffect (safe to reference handleTimeUp)
  useEffect(() => {
    let tabSwitchCount = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount++;

        if (tabSwitchCount === 1) {
          toast.warning(
            "Warning: Switching tabs is not allowed during the exam!",
          );
        } else if (tabSwitchCount >= 2) {
          toast.error(
            "Multiple tab switches detected. Auto-submitting exam for security reasons.",
          );
          handleTimeUp(); // Now this works — no initialization error
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "t" || e.key === "n" || e.key === "w")
      ) {
        e.preventDefault();
        toast.error("Opening new tabs is disabled during the exam.");
        toast.warning(
          "This attempt has been recorded. Exam will auto-submit on repeated violation.",
        );
        tabSwitchCount++;

        if (tabSwitchCount >= 2) {
          toast.error("Violation detected. Auto-submitting your exam.");
          handleTimeUp();
        }
      }
    };

    const handleAuxClick = (e: MouseEvent) => {
      if (e.button === 1 || (e.ctrlKey && e.button === 0)) {
        e.preventDefault();
        toast.error("Opening links in new tabs is disabled.");
        tabSwitchCount++;
        if (tabSwitchCount >= 2) {
          toast.error("Violation detected. Auto-submitting your exam.");
          handleTimeUp();
        }
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (e.ctrlKey || e.shiftKey) {
        e.preventDefault();
        toast.error("Right-click actions are restricted during the exam.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("auxclick", handleAuxClick);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("auxclick", handleAuxClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // Add this useEffect after fetchExamDetails() is called
  useEffect(() => {
    if (!questions.length || duration === 0 || !userId || !examId) return;

    const totalSeconds = duration * 60;
    const saved = localStorage.getItem(TIMER_STORAGE_KEY);

    let remainingSeconds: number;

    if (saved) {
      const savedData = JSON.parse(saved);
      const elapsed = Math.floor((Date.now() - savedData.startedAt) / 1000);
      remainingSeconds = Math.max(totalSeconds - elapsed, 0);
    } else {
      remainingSeconds = totalSeconds;
      // Save start time
      localStorage.setItem(
        TIMER_STORAGE_KEY,
        JSON.stringify({
          startedAt: Date.now(),
          totalSeconds,
        }),
      );
    }

    setTimeLeft(remainingSeconds);
    setExamStartedAt(Date.now());

    if (remainingSeconds <= 0) {
      setIsTimeUp(true);
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem(TIMER_STORAGE_KEY); // Clean up
          setIsTimeUp(true);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [questions.length, duration, userId, examId]);

  useEffect(() => {
    if (!loading && questions.length > 0) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraError(false);
        } catch (err) {
          console.error("Camera access denied or not available", err);
          setCameraError(true);
          toast.error("Camera access is required for proctoring.");
        }
      };

      startCamera();

      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (
            videoRef.current.srcObject as MediaStream
          ).getTracks();
          tracks.forEach((track) => track.stop());
        }
      };
    }
  }, [loading, questions.length]);

  // Auto-submit when time is up
  // const handleTimeUp = async () => {
  //   localStorage.removeItem(TIMER_STORAGE_KEY);
  //   toast.warning("Time's up! Submitting your answers...");
  //   await submitCode();
  //   toast.error("Exam time ended. Redirecting...");
  //   setTimeout(() => navigate("/overview"), 3000);
  // };
  // Format seconds → MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  useEffect(() => {
    if (!duration || !userId || !examId) return;

    const TIMER_STORAGE_KEY = `exam_timer_${examId}_${userId}`;
    const totalSeconds = duration * 60;

    // Load or initialize start time
    let saved = localStorage.getItem(TIMER_STORAGE_KEY);
    let startedAt: number;

    if (saved) {
      startedAt = JSON.parse(saved).startedAt;
    } else {
      startedAt = Date.now();
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify({ startedAt }));
    }

    // Function to calculate remaining time
    const updateTime = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(totalSeconds - elapsed, 0);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setIsTimeUp(true);
        handleTimeUp();
        return false; // stop interval
      }
      return true;
    };

    // Initial update so timer shows correct value immediately
    if (!updateTime()) return;

    // Start interval
    const timer = setInterval(() => {
      if (!updateTime()) clearInterval(timer);
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timer);
  }, [duration, userId, examId]);

  // Decode JWT
  useEffect(() => {
    if (!token) {
      toast.error("Please login");
      navigate("/");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(
        String(
          payload.user_id ||
          payload.id ||
          payload.candidate_id ||
          payload.sub ||
          "",
        ),
      );
    } catch (err) {
      console.error("Invalid token");
    }
  }, [token, navigate]);

  // Fetch exam
  useEffect(() => {
    if (!examId || !token) {
      toast.error("No exam selected");
      navigate("/overview");
      return;
    }
    fetchExamDetails();
  }, [examId, token]);

  const fetchExamDetails = async () => {
    try {
      const examDataFromState = location.state?.examData;
      let data: any = null;

      if (examDataFromState && examDataFromState.questions &&
        (Array.isArray(examDataFromState.questions) ? examDataFromState.questions.length > 0 : Object.keys(examDataFromState.questions).length > 0)) {
        data = examDataFromState;
      } else {
        throw new Error("No questions found in exam data. Please restart the exam.");
      }

      setExamTitle(data.title || "Coding Challenge");

      // Extract duration from exam details
      setDuration(data.duration || 60); // fallback to 60 mins if not present

      const rawQuestions = data.questions || {};
      let questionsArray = [];
      if (Array.isArray(rawQuestions)) {
        questionsArray = rawQuestions;
      } else if (rawQuestions.questions && Array.isArray(rawQuestions.questions)) {
        questionsArray = rawQuestions.questions;
      } else if (typeof rawQuestions === 'object') {
        questionsArray = Object.values(rawQuestions);
      }

      const formatted = questionsArray.map((q: any, index: number) => {
        const details = q.details || q;
        return {
          exam_question_index: String(index),
          question_bank_id: q.question_bank_id || q.question_id || q.id,
          score: q.score || q.marks || 10,
          title: details.title || q.title || "Untitled",
          question: details.question || q.problem_description || q.text || q.question || "No statement",
          description: details.description || q.description || "",
          sample_inputs: details.sample_inputs || q.input_format || q.sample_inputs || "",
          sample_outputs: details.sample_outputs || q.output_format || q.sample_outputs || "",
          test_cases: details.test_cases || q.sample_testcases || q.test_cases || [],
        };
      });

      setQuestions(formatted);
      toast.success(`Loaded ${formatted.length} question(s)`);
    } catch (err: any) {
      console.error("Failed to load coding exam", err);
      toast.error("Failed to load exam");
      navigate("/overview");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (currentQuestion) {
      // Only set boilerplate if no answer exists for this question
      if (!answers[activeIdx]) {
        setAnswers((prev) => ({
          ...prev,
          [activeIdx]: getBoilerplate(currentQuestion.title),
        }));
      }
      setCustomInput(currentQuestion.sample_inputs || "");
    }
  }, [currentQuestion, language, activeIdx]);

  const getBoilerplate = (title: string) => {
    const templates: Record<string, string> = {
      python: `# ${title}\n\n# Write your code here\n`,
      java: `// ${title}\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}`,
      php: `<?php\n// ${title}\n// Write your code here\n?>`,
    };
    return templates[language] || "";
  };

  useEffect(() => {
    if (language === "java") {
      setFileName(".java");
    } else {
      setFileName("");
    }
  }, [language]);

  useEffect(() => {
    if (language !== "java") return;

    const currentCode = answers[activeIdx] || "";

    const match = currentCode.match(/public\s+class\s+([A-Za-z_]\w*)/);

    if (match && match[1]) {
      const detectedName = match[1] + ".java";

      if (fileName !== detectedName) {
        setFileName(detectedName);
      }
    } else {
      // If class name removed, reset cleanly
      if (fileName !== "") {
        setFileName("");
      }
    }
  }, [answers, activeIdx, language]);

  // Auto-scroll output
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  // WebSocket Run Locally
  const runLocallyWithWebSocket = () => {
    // remove test case results so console mode returns
    setTestResultsMap((prev) => {
      const updated = { ...prev };
      delete updated[activeIdx];
      return updated;
    });
    const currentCode = answers[activeIdx] || "";
    if (!currentCode.trim()) {
      toast.error("Write some code first");
      return;
    }

    setOutputs((prev) => ({
      ...prev,
      [activeIdx]: "\n",
    }));
    if (ws.current) ws.current.close();

    const wsUrl = `wss://apicompiler.devtalent.securxperts.com:8000/interactive-compiler/${language}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      appendOutput("\n");
      ws.current?.send(JSON.stringify(buildPayload()));
    };

    ws.current.onmessage = (event) => appendOutput(event.data);
    ws.current.onerror = () => appendOutput("\nError: Connection failed.");
    ws.current.onclose = () => appendOutput("\nExecution finished.");
  };

  const sendInput = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      toast.warning("Program not running!");
      return;
    }
    if (!customInput.trim()) return;
    ws.current.send(customInput.trim() + "\n");
    appendOutput(`→ ${customInput.trim()}\n`);
    setCustomInput("");
  };

  const appendOutput = (text: string) => {
    setOutputs((prev) => ({
      ...prev,
      [activeIdx]: (prev[activeIdx] || "") + text,
    }));
  };
  // Save code to local storage
  const saveCode = () => {
    const currentCode = answers[activeIdx] || "";
    const saveData = {
      examId,
      questionIndex: activeIdx,
      code: currentCode,
      language,
      timestamp: new Date().toISOString(),
    };

    const storageKey = `saved_code_${examId}_${activeIdx}_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(saveData));
    toast.success("Code saved successfully!");
  };

  useEffect(() => {
    return () => ws.current?.close();
  }, []);

  // Run Test Cases & Submit (unchanged)
  const runTestCases = async () => {
    const currentCode = answers[activeIdx] || "";
    if (!currentQuestion || !currentCode.trim()) {
      toast.error("Write some code first");
      return;
    }

    const payload = JSON.stringify([
      {
        exam_question_id: parseInt(currentQuestion.exam_question_index),
        code: currentCode.trim(),
      },
    ]);

    console.log("=== DEBUG: Test Cases API Call ===");
    console.log("Current Question:", currentQuestion);
    console.log("Question Bank ID:", currentQuestion.question_bank_id);
    console.log("Exam Question Index:", currentQuestion.exam_question_index);
    console.log(
      "Final exam_question_id:",
      parseInt(currentQuestion.exam_question_index),
    );
    console.log("Payload:", payload);
    console.log(
      "API URL:",
      `https://apicompiler.devtalent.securxperts.com:8000/interpreter/test_cases?language=${language}&current_user=${userId}&exam_id=${examId}`,
    );

    setOutput("Running test cases...");

    try {
      const response = await fetch(
        `https://apicompiler.devtalent.securxperts.com:8000/interpreter/test_cases?language=${language}&current_user=${userId}&exam_id=${examId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        },
      );
      const data = await response.json();

      console.log("=== DEBUG: Test Cases API Response ===");
      console.log("Response status:", response.status);
      console.log("Response data:", data);
      console.log("Data type:", typeof data);
      console.log("Is array?", Array.isArray(data));
      if (Array.isArray(data) && data.length > 0) {
        console.log("First test structure:", data[0]);
        console.log("First test has result?", "result" in data[0]);
        if ("result" in data[0]) {
          console.log("Result structure:", data[0].result);
        }
      }

      if (!response.ok) throw new Error(data.message || "Test failed");

      setTestResultsMap((prev) => ({
        ...prev,
        [activeIdx]: data,
      }));
      setOutput(""); // clear old text
      const allPassed = data.every((test: any) =>
        test.result?.every((r: any) => r.success),
      );
      toast.success(
        allPassed ? "All test cases passed!" : "Some test cases failed",
      );
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
      toast.error("Failed to run test cases");
    }
  };

  const submitCode = async () => {
    if (isSubmitPopupOpen) return;
    const currentCode = answers[activeIdx] || "";
    if (!currentQuestion || !currentCode.trim()) {
      toast.error("Write some code first");
      return;
    }
    setIsSubmitPopupOpen(true);

    toast.custom(
      (t) => (
        <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm mx-auto border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Submit Exam?</h3>
          <p className="text-sm text-gray-600 mb-6">
            This will end your exam and submit all answers.
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                toast.dismiss(t);
                setIsSubmitPopupOpen(false); // ✅ reset
              }}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t);
                setIsSubmitPopupOpen(false); // ✅ reset immediately

                toast.loading("Submitting your exam...", {
                  id: "submit-loading",
                });
                const payload = JSON.stringify([
                  {
                    exam_question_id: parseInt(
                      currentQuestion.exam_question_index,
                    ),
                    code: (answers[activeIdx] || "").trim(),
                  },
                ]);

                console.log("=== DEBUG: Submit API Call ===");
                console.log("Current Question:", currentQuestion);
                console.log(
                  "Question Bank ID:",
                  currentQuestion.question_bank_id,
                );
                console.log(
                  "Exam Question Index:",
                  currentQuestion.exam_question_index,
                );
                console.log(
                  "Final exam_question_id:",
                  parseInt(currentQuestion.exam_question_index),
                );
                console.log("Payload:", payload);
                console.log(
                  "API URL:",
                  `https://apicompiler.devtalent.securxperts.com:8000/interpreter/submit?language=${language}&exam_id=${examId}&candidate_id=${userId}`,
                );

                try {
                  const response = await fetch(
                    `https://apicompiler.devtalent.securxperts.com:8000/interpreter/submit?language=${language}&exam_id=${examId}&candidate_id=${userId}`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: payload,
                    },
                  );

                  const data = await response.json();
                  if (!response.ok)
                    throw new Error(data.message || "result already submitted");

                  // Clean up timer on successful submit
                  localStorage.removeItem(TIMER_STORAGE_KEY);
                  toast.dismiss("submit-loading");
                  setShowSuccessModal(true);
                } catch (err: any) {
                  setIsSubmitPopupOpen(false); // ✅ allow retry
                  toast.error(err.message || "Submission failed", {
                    id: "submit-loading",
                  });
                }
              }}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition shadow-lg"
            >
              Yes, Submit
            </button>
          </div>
        </div>
      ),
      { duration: 10000 },
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-6" />
          <p className="text-2xl text-gray-800">Loading Exam...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="p-10 text-center text-3xl text-gray-800">
        No Questions
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#f5f6fb] overflow-hidden flex flex-col">
      {/* HEADER */}
      <div className="h-[90px] bg-white shadow-sm border-b px-3 sm:px-4 py-3 flex items-center justify-between shrink-0">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <img
            src={Devlogo}
            alt="DevTalent Logo"
            className="h-16 w-16 object-contain"
          />
          <h1 className="text-xl font-bold">{examTitle}</h1>
        </div>

        {/* CENTER - Progress Bar */}
        <div className="hidden md:flex flex-1 items-center justify-center px-8">
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-400">OVERALL PROGRESS</p>
              <span className="text-xs text-gray-400 font-bold">
                {Math.round(((activeIdx + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
              <div
                className="h-full bg-purple-600 rounded-full"
                style={{
                  width: `${((activeIdx + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Timer */}
          <div className="text-center">
            <p className="text-xs text-gray-400">TIME REMAINING</p>
            <p className="font-mono font-bold text-lg">
              {formatTime(timeLeft)}
            </p>
          </div>

          {/* Candidate */}
          <div className="text-center hidden md:block">
            <p className="text-xs text-gray-400">CANDIDATE ID</p>
            <p className="font-mono font-bold">{userId}</p>
          </div>

          {/* Webcam */}
          <div className="relative  pt-2">
            <div className="w-20 h-20 sm:w-28 sm:h-20 rounded-lg overflow-hidden bg-black">
              {cameraError ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="text-gray-500" />
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
            <span className="absolute top-3 left-24 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div
        className="
  flex-1
  min-h-0
  grid
  grid-cols-1
  md:grid-cols-[60px_1fr]
  lg:grid-cols-[70px_1fr_1.2fr]
"
      >
        {/* LEFT SIDEBAR (QNS) */}
        <div className="bg-[#f0eef6] flex md:flex-col flex-row overflow-x-auto md:overflow-y-auto md:h-full min-h-0 items-center py-2 md:py-4 gap-2 md:gap-3 px-2 md:px-0">
          <p className="hidden md:block text-xs font-bold text-purple-700">
            QNS
          </p>
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`min-w-[36px] h-9 md:w-10 md:h-10 rounded-xl font-bold text-sm ${i === activeIdx
                ? "bg-purple-600 text-white"
                : "bg-white border text-gray-600"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* LEFT PANEL (QUESTION) */}
        <div className="p-3 sm:p-4 md:p-6 overflow-y-auto min-h-0">
          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
              <h2 className="text-lg font-bold">{currentQuestion.title}</h2>
              <div className="flex gap-2">
                {/* <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                  Hard
                </span> */}
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold">
                  {currentQuestion.score} PTS
                </span>
              </div>
            </div>

            <h3 className="font-semibold mb-2">Problem Statement</h3>
            <p className="text-gray-600 mb-4">{currentQuestion.question}</p>

            {currentQuestion.description && (
              <>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 mb-4">
                  {currentQuestion.description}
                </p>
              </>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <h4 className="font-semibold mb-2">Sample Input</h4>
                <div className="bg-gray-100 p-3 rounded">
                  {currentQuestion.sample_inputs}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Expected Output</h4>
                <div className="bg-gray-100 p-3 rounded">
                  {currentQuestion.sample_outputs}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col bg-[#0f172a] min-h-0">
          {/* LANGUAGE */}
          {/* LANGUAGE + FILE NAME */}
          <div className="bg-white p-3 flex items-center gap-4 flex-wrap">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              {languagesList.length > 0 ? (
                languagesList.map((lang) => (
                  <option key={lang.lang_id} value={lang.lang_name.toLowerCase()}>
                    {lang.lang_name} {lang.description ? `(${lang.description})` : ""}
                  </option>
                ))
              ) : (
                <>
                  <option value="python">Python 3.10</option>
                  <option value="java">Java</option>
                  <option value="php">PHP</option>
                </>
              )}
            </select>

            {language === "java" && (
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="px-3 py-2 border rounded w-56"
                placeholder=".java"
              />
            )}
          </div>

          {/* EDITOR */}
          <div className="flex-1 min-h-0">
            <AceEditor
              mode={language}
              theme="textmate"
              value={answers[activeIdx] || ""}
              onChange={(newCode) => {
                setAnswers((prev) => ({ ...prev, [activeIdx]: newCode }));
              }}
              width="100%"
              height="100%"
              fontSize={14}
              showPrintMargin={false}
              setOptions={{ tabSize: 4 }}
            />
          </div>

          {/* OUTPUT */}
          <div className="h-[150px] sm:h-[180px] bg-black text-green-400 p-3 sm:p-4 overflow-auto text-xs sm:text-sm shrink-0">
            <p className="text-sm mb-2">Output & Console</p>
            {testResultsMap[activeIdx] ? (
              <div className="space-y-4">
                {testResultsMap[activeIdx].map((test: any, index: number) => (
                  <div
                    key={index}
                    className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-xs"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-bold text-white">
                        Test Case {index + 1}
                      </p>
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold ${test.result?.every((r: any) => r.success)
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                          }`}
                      >
                        {test.result?.every((r: any) => r.success)
                          ? "PASSED"
                          : "FAILED"}
                      </span>
                    </div>

                    <div className="space-y-2 text-green-400">
                      {test.result?.map((result: any, resultIndex: number) => (
                        <div
                          key={resultIndex}
                          className="border-t border-gray-700 pt-2"
                        >
                          <div className="text-xs text-gray-400 mb-1">
                            Sub-test {resultIndex + 1}
                          </div>

                          <div>
                            <span className="text-gray-400">
                              actual_inputs:
                            </span>
                            <pre className="whitespace-pre-wrap break-words">
                              {JSON.stringify(
                                result.actual_inputs || test.actual_inputs,
                                null,
                                2,
                              )}
                            </pre>
                          </div>

                          <div>
                            <span className="text-gray-400">
                              expected_outputs:
                            </span>
                            <pre className="whitespace-pre-wrap break-words">
                              {JSON.stringify(
                                result.expected_outputs ||
                                test.expected_outputs,
                                null,
                                2,
                              )}
                            </pre>
                          </div>

                          <div>
                            <span className="text-gray-400">
                              actual_outputs:
                            </span>
                            <pre className="whitespace-pre-wrap break-words">
                              {JSON.stringify(
                                result.actual_outputs || test.actual_outputs,
                                null,
                                2,
                              )}
                            </pre>
                          </div>

                          <div>
                            <span className="text-gray-400">
                              execution_time:
                            </span>
                            <pre>
                              {JSON.stringify(
                                result.execution_time || test.execution_time,
                                null,
                                2,
                              )}
                            </pre>
                          </div>

                          {!result.success && (
                            <div>
                              <span className="text-red-400">error:</span>
                              <pre className="text-red-400 whitespace-pre-wrap break-words">
                                {result.error || "Test failed"}
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <pre>{outputs[activeIdx] || "Run your code to see results"}</pre>
            )}{" "}
            <div ref={outputEndRef} />
          </div>

          {/* INPUT + BUTTONS */}
          <div className="bg-white p-4 shrink-0">
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="flex-1 border px-3 py-2 rounded"
                placeholder="10 25 15"
              />
              <button
                onClick={sendInput}
                className="px-4 bg-green-600 text-white rounded"
              >
                Send
              </button>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <button
                onClick={runLocallyWithWebSocket}
                className="px-3 sm:px-5 py-2 text-sm bg-green-500 text-white rounded-lg"
              >
                Run Code
              </button>

              <button
                onClick={saveCode}
                className="px-5 py-2 bg-yellow-500 text-white rounded-lg"
              >
                Save
              </button>

              <button
                onClick={runTestCases}
                className="px-5 py-2 bg-gray-200 rounded-lg"
              >
                Run Test Cases
              </button>

              <button
                onClick={submitCode}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
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
}
