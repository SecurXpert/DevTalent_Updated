import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";
import SelectField from "./SelectField";

const MCQSection: React.FC<{ questions?: any[] }> = ({ questions = [] }) => {
  return (
    <div className="space-y-8">
      {/* MCQ Questions */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          MCQ Questions
        </h2>

        {questions.length > 0 ? (
          questions.map((question, index) => (
            <div
              key={question.id || index}
              className="border border-gray-200 rounded-xl p-6 mb-5"
            >
              {/* Top Labels */}
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                  Question {index + 1}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  MCQ
                </span>
                <span className="text-gray-500 text-sm">
                  {question.marks || 1} marks
                </span>
              </div>

              {/* Question Text */}
              <div className="mb-5">
                <label className="block text-sm text-gray-600 mb-2">
                  Question Text
                </label>
                <div className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-700">
                  {question.questionText ||
                    question.text ||
                    "No question text provided"}
                </div>
              </div>

              {/* Options */}
              <div className="mb-5 space-y-3">
                <label className="block text-sm text-gray-600 mb-2">
                  Options
                </label>
                {(question.options || []).map(
                  (option: any, optionIndex: number) => {
                    const optionText = typeof option === 'string' ? option : option?.text;
                    const isCorrect = question.correctAnswer === optionIndex || 
                                     question.correct_index === optionIndex || 
                                     (question.correct_option_id && typeof option === 'object' && option.id === question.correct_option_id);
                                     
                    return (
                      <div key={optionIndex} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`correct-${question.id || index}`}
                          checked={isCorrect}
                          readOnly
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1 border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-700">
                          {optionText ||
                            `Option ${String.fromCharCode(65 + optionIndex)}`}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Marks */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Marks
                </label>
                <div className="w-32 border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-700">
                  {question.marks || 1}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No MCQ questions available for this exam.
          </div>
        )}
      </div>

    
    </div>
  );
};

const CodingSection: React.FC<{ questions?: any[] }> = ({ questions = [] }) => {
  return (
    <div className="space-y-8">
      {/* Coding Questions */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Coding Questions
        </h2>

        {questions.length > 0 ? (
          questions.map((question, index) => (
            <div
              key={question.id || index}
              className="border border-gray-200 rounded-xl p-6 mb-5"
            >
              {/* Top Labels */}
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm">
                  Question {index + 1}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  Coding
                </span>
                <span className="text-gray-500 text-sm">
                  {question.marks || 10} marks
                </span>
              </div>

              {/* Problem Statement */}
              <div className="mb-5">
                <label className="block text-sm text-gray-600 mb-2">
                  Problem Statement
                </label>
                <div className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-700 min-h-[80px]">
                  {question.problem_description ||
                    question.problem ||
                    question.questionText ||
                    "No problem statement provided"}
                </div>
              </div>

              {/* Input & Output */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Input Format
                  </label>
                  <div className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-700 min-h-[60px]">
                    {question.input_format || question.input || "No input format specified"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Output Format
                  </label>
                  <div className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-700 min-h-[60px]">
                    {question.output_format || question.output || "No output format specified"}
                  </div>
                </div>
              </div>

              {/* Constraints */}
              <div className="mb-5">
                <label className="block text-sm text-gray-600 mb-2">
                  Constraints
                </label>
                <div className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-700">
                  {question.constraints || "No constraints specified"}
                </div>
              </div>

              {/* Sample Input & Output */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Sample Input
                  </label>
                  <div className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-700 min-h-[60px]">
                    {question.sample_input || question.sampleInput || "No sample input provided"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Sample Output
                  </label>
                  <div className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-700 min-h-[60px]">
                    {question.sample_output || question.sampleOutput || "No sample output provided"}
                  </div>
                </div>
              </div>

              {/* Marks */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Marks
                </label>
                <div className="w-32 border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-700">
                  {question.marks || 10}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No coding questions available for this exam.
          </div>
        )}
      </div>

   
    </div>
  );
};

import { API_BASE_URL } from "../../Services/api/api";

interface ExamDetailsProps {
  examData?: any;
}

const ExamDetails: React.FC<ExamDetailsProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get exam data from navigation state
  const examData = location.state?.examData;

  const [fetchedQuestions, setFetchedQuestions] = useState<any[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      const examId = examData?.id || examData?.exam_id;
      if (!examId) return;

      setIsLoadingQuestions(true);
      try {
        const adminToken = localStorage.getItem('adminToken');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

        const isMcq = examData?.type === "MCQ" || examData?.type === "MCQ Only" || examData?.examType === "MCQ Only";
        const endpoint = isMcq
          ? `${API_BASE_URL}/ind/mcq/admin/exams/${examId}/questions?limit=500`
          : `${API_BASE_URL}/ind/coding/admin/exams/${examId}/questions?limit=500`;

        const response = await fetch(endpoint, { headers });
        
        if (response.ok) {
          const data = await response.json();
          setFetchedQuestions(data.items || data || []);
        }
      } catch (err) {
        console.error("Failed to fetch questions details:", err);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [examData]);

  // Extract questions based on type
  const getMCQQuestions = () => {
    if (fetchedQuestions.length > 0) return fetchedQuestions;
    return [];
  };

  const getCodingQuestions = () => {
    if (fetchedQuestions.length > 0) return fetchedQuestions;
    return [];
  };

  const [formData, setFormData] = useState({
    examName: examData?.title || examData?.examName || "",
    course: examData?.course || "Technical",
    description: examData?.description || "",
    duration: parseInt(examData?.duration) || 120,
    totalMarks: examData?.totalMarks || 100,
    passingScore: examData?.passingScore || 60,
    examType: examData?.type || examData?.examType || "Coding Only",
  });

  // Update form when examData changes
  useEffect(() => {
    if (examData) {
      setFormData({
        examName: examData?.title || examData?.examName || "",
        course: examData?.course || "Technical",
        description: examData?.description || "",
        duration: parseInt(examData?.duration) || 120,
        totalMarks: examData?.totalMarks || 100,
        passingScore: examData?.passingScore || 60,
        examType: examData?.type || examData?.examType || "Coding Only",
      });
    }
  }, [examData]);

  const handleBack = () => {
    navigate("/exams");
  };

  return (
    <div className="min-h-screen bg-[#f3f2fb] px-2 py-3 sm:px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px] lg:max-w-[1440px]">
        {/* Back */}
        <button
          onClick={handleBack}
          className="mb-3 flex items-center gap-2 text-[14px] text-[#5b5cf0]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Exams
        </button>

        {/* Header */}
        <h1 className="text-[28px] font-bold text-[#1f2937]">Exam Details</h1>
        <p className="mb-4 text-[14px] text-[#6b7280]">
          View exam information and settings
        </p>

        <div className="space-y-5">
          {/* Card */}
          <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
            <h2 className="mb-4 text-[22px] font-semibold text-[#1f2937]">
              Basic Exam Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Exam Name
                </label>
                <div className="w-full border border-[#d1d5db] rounded-xl px-4 py-3 bg-[#f9fafb] text-[#6b7280]">
                  {formData.examName || "Not specified"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Select Course
                </label>
                <div className="w-full border border-[#d1d5db] rounded-xl px-4 py-3 bg-[#f9fafb] text-[#6b7280]">
                  {formData.course}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Exam Description
                </label>
                <div className="w-full border border-[#d1d5db] rounded-xl px-4 py-3 bg-[#f9fafb] text-[#6b7280] min-h-[100px]">
                  {formData.description || "No description provided"}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Duration (minutes)
                  </label>
                  <div className="w-full border border-[#d1d5db] rounded-xl px-4 py-3 bg-[#f9fafb] text-[#6b7280]">
                    {formData.duration}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Total Marks
                  </label>
                  <div className="w-full border border-[#d1d5db] rounded-xl px-4 py-3 bg-[#f9fafb] text-[#6b7280]">
                    {formData.totalMarks}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Passing Score (%)
                  </label>
                  <div className="w-full border border-[#d1d5db] rounded-xl px-4 py-3 bg-[#f9fafb] text-[#6b7280]">
                    {formData.passingScore}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Exam Type
                  </label>
                  <div className="w-full border border-[#d1d5db] rounded-xl px-4 py-3 bg-[#f9fafb] text-[#6b7280]">
                    {formData.examType}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Questions Section - Dynamic based on exam type */}
          {isLoadingQuestions ? (
            <div className="bg-white border border-[#e1e3ea] rounded-2xl p-6 shadow-sm text-center text-gray-500">
              Loading questions...
            </div>
          ) : (
            <>
              {(formData.examType === "MCQ" || formData.examType === "MCQ Only") && (
                <MCQSection questions={getMCQQuestions()} />
              )}
              {(formData.examType === "Coding" || formData.examType === "Coding Only") && (
                <CodingSection questions={getCodingQuestions()} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;
