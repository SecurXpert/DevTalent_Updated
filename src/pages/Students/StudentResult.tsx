import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Code2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { FiTarget, FiTrendingUp, FiAward, FiCheckCircle } from "react-icons/fi";
import { resultsData, ResultData } from "../../data/resultsData";

type ProblemCardProps = {
  title: string;
  language: string;
  marks: string;
  code: string;
  testPassed: number;
  testTotal: number;
  status: "All Passed" | "Partially Correct";
};

const ProblemCard: React.FC<ProblemCardProps> = ({
  title,
  language,
  marks,
  code,
  testPassed,
  testTotal,
  status,
}) => {
  const progress = (testPassed / testTotal) * 100;
  const isPassed = status === "All Passed";

  return (
    <div className="w-full rounded-[20px] border border-[#d9d9e8] bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-6 py-5 bg-[#f6f4ff] border-b border-[#e3e1f1]">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#6f63ff] to-[#9333ea] shadow-md">
            <Code2 className="h-5 w-5 text-white" />
          </div>

          <div>
            <h3 className="text-[18px] sm:text-[22px] font-semibold text-[#1f2937] leading-snug">
              {title}
            </h3>
            <span className="inline-block mt-2 rounded-md border border-[#d6d6d6] bg-white px-3 py-1 text-[13px] font-medium text-[#6b7280]">
              {language}
            </span>
          </div>
        </div>

        <div className="self-start sm:self-auto rounded-xl border border-[#dddde6] bg-white px-5 py-3 text-[16px] font-semibold text-[#4b5563] shadow-sm">
          {marks}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 sm:px-6 py-6">
        <p className="mb-4 text-[15px] font-semibold text-[#4b5563]">
          Code Submitted:
        </p>

        <div className="w-full rounded-2xl bg-[#07142b] px-6 py-5 shadow-inner overflow-x-auto">
          <pre className="text-[15px] leading-7 text-white whitespace-pre-wrap font-mono min-w-[250px]">
            <code>{code}</code>
          </pre>
        </div>

        {/* Bottom cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Test Cases */}
          <div className="rounded-2xl border border-[#cfd3ff] bg-[#f6f8ff] px-5 py-5">
            <p className="text-[15px] text-[#6b7280] font-medium">Test Cases</p>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-[40px] leading-none font-bold text-[#4f46e5]">
                {testPassed}
              </span>
              <span className="mb-1 text-[24px] text-[#6b7280]">
                / {testTotal}
              </span>
            </div>

            <div className="mt-5 h-2.5 w-full rounded-full bg-[#cfd5ff] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#4f46e5] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Execution Status */}
          <div className="rounded-2xl border border-[#e4e4ea] bg-[#fafafa] px-5 py-5 flex flex-col justify-center">
            <p className="text-[15px] text-[#6b7280] font-medium">
              Execution Status
            </p>

            <div className="mt-5">
              <span
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[15px] font-semibold border ${
                  isPassed
                    ? "bg-[#e8f9ee] text-[#15803d] border-[#b8ebc9]"
                    : "bg-[#fff5dd] text-[#c67b00] border-[#f4d68a]"
                }`}
              >
                {isPassed ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const result = resultsData.find((r) => r.id === parseInt(id || "0"));

  if (!result) {
    return (
      <div className="w-full p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Result Not Found
          </h2>
          <p className="text-red-600 mb-4">
            The requested result could not be found.
          </p>
          <button
            onClick={() => navigate("/results")}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Score",
      value: result.score,
      icon: <FiTarget size={18} />,
      bg: "linear-gradient(135deg, #615FFF 0%, #4F39F6 100%)",
    },
    {
      title: "Percentage",
      value: `${result.percent}%`,
      icon: <FiTrendingUp size={18} />,
      bg: "linear-gradient(135deg, #AD46FF 0%, #9810FA 100%)",
    },
    {
      title: "Passing Marks",
      value: "60",
      icon: <FiAward size={18} />,
      bg: "linear-gradient(135deg, #00C950 0%, #00A63E 100%)",
    },
    {
      title: "MCQ Accuracy",
      value: `${Math.round((result.mcqCorrect / result.mcqTotal) * 100)}%`,
      icon: <FiCheckCircle size={18} />,
      bg: "linear-gradient(135deg, #2B7FFF 0%, #155DFC 100%)",
    },
  ];

  return (
    <div className="w-full">
      {/* Back */}
      <button
        onClick={() => navigate(`/student/${result.studentId}`)}
        className="flex items-center gap-2 text-purple-600 mb-4"
      >
        <ArrowLeft size={18} />
        Back to student profile
      </button>

      {/* Header Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {result.exam}
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Detailed Result Breakdown & Performance Analysis
            </p>
          </div>

          <span
            className={`${result.status === "Pass" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-4 py-2 rounded-xl text-sm font-medium w-fit`}
          >
            {result.status}
          </span>
        </div>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-5 mt-6">
          {/* Student Details */}
          <div className="bg-gray-50 border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3 text-gray-700 font-medium">
              <User size={16} />
              Student Details
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Name</span>
                <span>{result.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Email</span>
                <span>{result.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Student ID</span>
                <span>{result.studentId}</span>
              </div>
              <div className="flex justify-between">
                <span>Course</span>
                <span>{result.course}</span>
              </div>
            </div>
          </div>

          {/* Exam Details */}
          <div className="bg-gray-50 border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3 text-gray-700 font-medium">
              <Clock size={16} />
              Exam Details
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Exam Type</span>
                <span>{result.examType}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration</span>
                <span>{result.duration}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Taken</span>
                <span>{result.timeTaken}</span>
              </div>
              <div className="flex justify-between">
                <span>Submission</span>
                <span>{result.submission}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="relative rounded-[14px] px-5 py-4 shadow-[0_8px_20px_rgba(0,0,0,0.12)] min-h-[92px] flex flex-col justify-between"
            style={{ background: item.bg }}
          >
            <div className="flex items-start justify-between">
              <p className="text-white/90 text-[15px] font-normal">
                {item.title}
              </p>
              <div className="text-white/90 mt-[2px] flex items-center justify-center">
                {item.icon}
              </div>
            </div>

            <h2 className="text-white text-[28px] leading-none font-semibold mt-2">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Performance Section */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* MCQ Performance */}
        <div className="bg-white border rounded-2xl p-5">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold text-gray-800">MCQ Performance</h3>
            <span className="text-gray-500 text-sm">
              {result.mcqScore}/{result.mcqMaxScore} marks
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-2">Score Percentage</p>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(result.mcqScore / result.mcqMaxScore) * 100}%`,
                background: "linear-gradient(90deg, #00C950 0%, #009966 100%)",
              }}
            />
          </div>

          <div className="flex gap-4 mt-5">
            <div className="flex-1 bg-green-50 border border-green-200 p-4 rounded-xl">
              <p className="text-sm text-gray-600">Correct</p>
              <h2 className="text-xl font-bold text-green-600">
                {result.mcqCorrect}
              </h2>
            </div>

            <div className="flex-1 bg-red-50 border border-red-200 p-4 rounded-xl">
              <p className="text-sm text-gray-600">Incorrect</p>
              <h2 className="text-xl font-bold text-red-600">
                {result.mcqTotal - result.mcqCorrect}
              </h2>
            </div>
          </div>
        </div>

        {/* Coding Performance */}
        <div className="bg-white border rounded-2xl p-5">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Coding Performance</h3>
            <span className="text-gray-500 text-sm">
              {result.codingScore}/{result.codingMaxScore} marks
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-2">Score Percentage</p>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(result.codingScore / result.codingMaxScore) * 100}%`,
                background: "linear-gradient(90deg, #615FFF 0%, #9810FA 100%)",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <p className="text-sm text-gray-600">Problems</p>
              <h2 className="text-xl font-bold text-blue-600">
                {result.codingProblems}
              </h2>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl">
              <p className="text-sm text-gray-600">Test Cases</p>
              <h2 className="text-xl font-bold text-purple-600">
                {result.codingTestCases.passed}/{result.codingTestCases.total}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* MCQ Breakdown */}
      <div className="bg-white border rounded-2xl mt-6 p-5">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold">MCQ Section Breakdown</h3>
          <span className="text-sm text-gray-500">
            {result.mcqCorrect} of {result.mcqTotal} correct
          </span>
        </div>

        {[...Array(result.mcqTotal)].map((_, i) => {
          const isWrong = i >= result.mcqCorrect;

          return (
            <div
              key={i}
              className={`p-4 mb-4 rounded-xl border ${
                isWrong
                  ? "bg-red-50 border-red-300"
                  : "bg-green-50 border-green-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  {isWrong ? (
                    <XCircle className="text-red-500" size={18} />
                  ) : (
                    <CheckCircle className="text-green-500" size={18} />
                  )}
                  <p className="font-medium">
                    {i + 1}. Sample question text here?
                  </p>
                </div>

                <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm w-fit">
                  {isWrong
                    ? `0/${Math.ceil(result.mcqMaxScore / result.mcqTotal)} marks`
                    : `${Math.ceil(result.mcqMaxScore / result.mcqTotal)}/${Math.ceil(result.mcqMaxScore / result.mcqTotal)} marks`}
                </span>
              </div>

              <p className="text-sm mt-2">
                Your Answer:
                <span className="ml-2 px-2 py-1 rounded bg-white">Answer</span>
              </p>

              {isWrong && (
                <p className="text-sm mt-2">
                  Correct Answer:
                  <span className="ml-2 px-2 py-1 rounded bg-green-100 text-green-700">
                    Correct
                  </span>
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Coding Section Breakdown */}
      <div className="mt-6 bg-white border rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 py-5 bg-[#f3f4f6] border-b border-[#e5e7eb]">
          <h2 className="text-[22px] sm:text-[28px] font-bold text-[#1f2937]">
            Coding Section Breakdown
          </h2>
          <p className="text-[16px] sm:text-[18px] text-[#4b5563] font-medium">
            Score:{" "}
            <span className="font-semibold">
              {result.codingScore}/{result.codingMaxScore}
            </span>
          </p>
        </div>

        <div className="space-y-8 p-5 sm:p-6 bg-[#f5f5fb]">
          {result.problems.map((problem, index) => (
            <ProblemCard
              key={index}
              title={problem.title}
              language={problem.language}
              marks={problem.marks}
              code={problem.code}
              testPassed={problem.testPassed}
              testTotal={problem.testTotal}
              status={problem.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultDetails;
