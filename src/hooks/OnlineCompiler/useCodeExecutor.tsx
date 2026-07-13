import { useState, useRef, useEffect, RefObject } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useCodeExecutor = (
  examId: string,
  userId: string,
  token: string,
  currentQuestion: any,
  activeIdx: number,
  outputEndRef: RefObject<HTMLDivElement>,
  TIMER_STORAGE_KEY: string
) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [language, setLanguage] = useState("python");
  const [customInput, setCustomInput] = useState("");
  const [fileName, setFileName] = useState(".java");
  const [outputs, setOutputs] = useState<Record<number, string>>({});
  const [testResultsMap, setTestResultsMap] = useState<Record<number, any[]>>({});
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitPopupOpen, setIsSubmitPopupOpen] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (currentQuestion) {
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
      if (fileName !== "") {
        setFileName("");
      }
    }
  }, [answers, activeIdx, language]);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [outputs]);

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

  const appendOutput = (text: string) => {
    setOutputs((prev) => ({
      ...prev,
      [activeIdx]: (prev[activeIdx] || "") + text,
    }));
  };

  const runLocallyWithWebSocket = () => {
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
    setOutputs((prev) => ({ ...prev, [activeIdx]: "\n" }));
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

  const runTestCases = async () => {
    const currentCode = answers[activeIdx] || "";
    if (!currentQuestion || !currentCode.trim()) {
      toast.error("Write some code first");
      return;
    }

    const payload = JSON.stringify([{
      exam_question_id: parseInt(currentQuestion.exam_question_index),
      code: currentCode.trim(),
    }]);

    appendOutput("Running test cases...");

    try {
      const response = await fetch(
        `https://apicompiler.devtalent.securxperts.com:8000/interpreter/test_cases?language=${language}&current_user=${userId}&exam_id=${examId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: payload,
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Test failed");

      setTestResultsMap((prev) => ({ ...prev, [activeIdx]: data }));
      
      const allPassed = data.every((test: any) => test.result?.every((r: any) => r.success));
      toast.success(allPassed ? "All test cases passed!" : "Some test cases failed");
    } catch (err: any) {
      appendOutput(`\nError: ${err.message}`);
      toast.error("Failed to run test cases");
    }
  };

  const submitCode = async (isAutoSubmit = false) => {
    if (isSubmitPopupOpen && !isAutoSubmit) return;
    const currentCode = answers[activeIdx] || "";
    if (!currentQuestion || !currentCode.trim()) {
      toast.error("Write some code first");
      return;
    }

    const executeSubmit = async () => {
      toast.loading("Submitting your exam...", { id: "submit-loading" });
      const payload = JSON.stringify([{
        exam_question_id: parseInt(currentQuestion.exam_question_index),
        code: (answers[activeIdx] || "").trim(),
      }]);

      try {
        const response = await fetch(
          `https://apicompiler.devtalent.securxperts.com:8000/interpreter/submit?language=${language}&exam_id=${examId}&candidate_id=${userId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: payload,
          }
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "result already submitted");

        localStorage.removeItem(TIMER_STORAGE_KEY);
        toast.dismiss("submit-loading");
        
        if (isAutoSubmit) {
          toast.error("Exam time ended. Redirecting...");
          setTimeout(() => navigate("/overview"), 3000);
        } else {
          setShowSuccessModal(true);
        }
      } catch (err: any) {
        setIsSubmitPopupOpen(false);
        toast.error(err.message || "Submission failed", { id: "submit-loading" });
      }
    };

    if (isAutoSubmit) {
      await executeSubmit();
      return;
    }

    setIsSubmitPopupOpen(true);
    toast.custom(
      (t) => (
        <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm mx-auto border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Submit Exam?</h3>
          <p className="text-sm text-gray-600 mb-6">This will end your exam and submit all answers.</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                toast.dismiss(t);
                setIsSubmitPopupOpen(false);
              }}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t);
                setIsSubmitPopupOpen(false);
                await executeSubmit();
              }}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition shadow-lg"
            >
              Yes, Submit
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  };

  return {
    answers, setAnswers,
    language, setLanguage,
    customInput, setCustomInput,
    fileName, setFileName,
    outputs,
    testResultsMap,
    runLocallyWithWebSocket,
    sendInput,
    saveCode,
    runTestCases,
    submitCode,
    showSuccessModal,
    setShowSuccessModal
  };
};
