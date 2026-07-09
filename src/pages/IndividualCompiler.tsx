import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const IndividualCompiler: React.FC = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState(
        "def mergklists(lists):\n    # write your solution here",
    );
    const [input, setInput] = useState("10 25 15");
    const [output, setOutput] = useState<string>("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [activeIdx, setActiveIdx] = useState(0);
    const questions = [1, 2, 3, 4];

    const [timeLeft, setTimeLeft] = useState(3600);
    const candidateId = "CP-2024-9XBR";

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

    const handleRunCode = () => {
        setOutput("Running code...\n");

        // Fake execution
        setTimeout(() => {
            setOutput((prev) => prev + "Output: Code executed successfully ✔\n");
        }, 1000);
    };

    const handleRunTestCases = () => {
        setOutput("Running test cases...\n");

        setTimeout(() => {
            setOutput(
                (prev) =>
                    prev +
                    "Test Case 1: Passed ✔\nTest Case 2: Passed ✔\nAll test cases passed! 🎉\n",
            );
        }, 1200);
    };

    const handleSubmit = () => {
        setOutput((prev) => prev + "\nExam Submitted Successfully 🎉\n");
        setShowSuccessModal(true);
    };

    // ====================================================

    return (
        <div className="h-screen flex flex-col bg-[#f5f6fb]">
            {/* HEADER */}
            <div className="h-[90px] bg-white shadow-sm border-b px-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img src="src/assests/Devlogo.png" className="h-14" />
                    <h1 className="text-xl font-bold">STM CODING 1</h1>
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
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Reverse String</h2>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                                    Hard
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-xs font-bold">
                                    15 PTS
                                </span>
                            </div>
                        </div>

                        <h3 className="font-semibold mb-2">Problem Statement</h3>
                        <p className="text-gray-600 mb-4">
                            Lorem Ipsum Lorem Ipsum Lorem Ipsum
                        </p>

                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-gray-600 mb-4">
                            Lorem Ipsum Lorem Ipsum Lorem Ipsum
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div>
                                <h4 className="font-semibold mb-2">Sample Input</h4>
                                <div className="bg-gray-100 p-3 rounded">10, 25, 15</div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Expected Output</h4>
                                <div className="bg-gray-100 p-3 rounded">25</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="w-1/2 flex flex-col">
                    <div className="bg-white p-3 border-b">
                        <select className="border px-3 py-1 rounded">
                            <option>Python 3.10</option>
                            <option>Java</option>
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
