import React from "react";
import { Clock, CheckSquare, Send, FileText, Award, Download, Share2 } from "lucide-react";

interface ExamInfoTabProps {
  exam: any;
}

export const ExamInfoTab: React.FC<ExamInfoTabProps> = ({ exam }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column: Exam Information */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
        <h3 className="text-xl font-bold text-gray-900 mb-8">
          Exam Information
        </h3>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-2xl flex justify-between items-center px-6 py-4">
            <span className="text-gray-500 text-sm font-medium">
              Student ID
            </span>
            <span className="font-bold text-gray-900 font-mono text-sm">
              {exam.raw?.student_id || "N/A"}
            </span>
          </div>
          <div className="bg-gray-50 rounded-2xl flex justify-between items-center px-6 py-4">
            <span className="text-gray-500 text-sm font-medium">Course ID</span>
            <span className="font-bold text-gray-900 font-mono text-sm">
              {exam.courseId || "N/A"}
            </span>
          </div>
          <div className="bg-gray-50 rounded-2xl flex justify-between items-center px-6 py-4">
            <span className="text-gray-500 text-sm font-medium">Exam ID</span>
            <span className="font-bold text-gray-900 font-mono text-sm">
              {exam.raw?.exam_id || "N/A"}
            </span>
          </div>
          <div className="bg-gray-50 rounded-2xl flex justify-between items-center px-6 py-4">
            <span className="text-gray-500 text-sm font-medium">
              Attempt ID
            </span>
            <span className="font-bold text-gray-900 font-mono text-sm">
              {exam.raw?.attempt_id || "N/A"}
            </span>
          </div>
          <div className="bg-gray-50 rounded-2xl flex justify-between items-center px-6 py-4">
            <span className="text-gray-500 text-sm font-medium">Exam Type</span>
            <span className="font-bold text-gray-900 font-mono text-sm">
              {exam.type}
            </span>
          </div>
          <div className="bg-gray-50 rounded-2xl flex justify-between items-center px-6 py-4">
            <span className="text-gray-500 text-sm font-medium">Exam Date</span>
            <span className="font-bold text-gray-900 font-mono text-sm">
              {exam.date}
            </span>
          </div>
          <div className="bg-gray-50 rounded-2xl flex justify-between items-center px-6 py-4">
            <span className="text-gray-500 text-sm font-medium">Exam Time</span>
            <span className="font-bold text-gray-900 font-mono text-sm">
              {exam.time}
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Timeline & Certificate */}
      <div className="flex flex-col gap-6">
        {/* Exam Timeline */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
          <h3 className="text-xl font-bold text-gray-900 mb-8">
            Exam Timeline
          </h3>
          <div className="relative pl-3">
            <div className="absolute left-[31px] top-4 bottom-4 w-px bg-purple-200"></div>

            <div className="relative flex gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#523de1] text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  Exam Started
                </h4>
                <p className="text-gray-400 text-xs mt-0.5">
                  {exam.date} at {exam.time}
                </p>
              </div>
            </div>

            <div className="relative flex gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#523de1] text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  Questions Answered
                </h4>
                <p className="text-gray-400 text-xs mt-0.5">
                  {exam.stats.attempted} of {exam.stats.total} answered
                </p>
              </div>
            </div>

            <div className="relative flex gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#523de1] text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  Exam Submitted
                </h4>
                <p className="text-gray-400 text-xs mt-0.5">
                  Auto-submitted on completion
                </p>
              </div>
            </div>

            <div className="relative flex gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#523de1] text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  Result Generated
                </h4>
                <p className="text-gray-400 text-xs mt-0.5">
                  Instantly evaluated
                </p>
              </div>
            </div>

            <div className="relative flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#523de1] text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  Certificate Issued
                </h4>
                <p className="text-gray-400 text-xs mt-0.5">
                  Available for download
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Available! */}
        <div className="bg-gradient-to-r from-[#523de1] to-blue-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-bl-full transform translate-x-10 -translate-y-10"></div>

          <div className="flex items-center gap-3 mb-3 relative z-10">
            <Award className="w-6 h-6" />
            <h3 className="text-xl font-bold">Certificate Available!</h3>
          </div>
          <p className="text-purple-100 text-sm mb-6 relative z-10">
            Congratulations! Your certificate is ready to download and share.
          </p>
          <div className="flex gap-3 relative z-10">
            <button className="bg-white text-[#523de1] px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition shadow-sm">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition backdrop-blur-sm">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
