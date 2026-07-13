import React from "react";
import { X, FileText, Clock3, Calendar, Users } from "lucide-react";
import { ExamItem } from "../types";
import { statusBadge } from "../utils";
import ModalWrapper from "./ModalWrapper";

interface ViewExamModalProps {
  viewExam: ExamItem | null;
  setViewExam: (exam: ExamItem | null) => void;
  setEditExam: (exam: ExamItem) => void;
}

const ViewExamModal: React.FC<ViewExamModalProps> = ({
  viewExam,
  setViewExam,
  setEditExam,
}) => {
  if (!viewExam) return null;

  return (
    <ModalWrapper onClose={() => setViewExam(null)}>
      <div className="rounded-t-[20px] bg-[#f3f2fb] px-6 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[28px] font-bold text-[#1f2937]">
              Exam Details
            </h2>
            <p className="text-[14px] text-[#6b7280]">View exam information</p>
          </div>
          <button onClick={() => setViewExam(null)} className="text-[#6b7280]">
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="bg-white px-8 py-8">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[14px] text-[#6b7280]">
              <FileText size={16} />
              Exam Name
            </p>
            <h3 className="text-[22px] font-semibold text-[#1f2937]">
              {viewExam.title}
            </h3>
          </div>

          <div />

          <div>
            <p className="mb-2 text-[14px] text-[#6b7280]">Exam Type</p>
            <p className="text-[20px] text-[#1f2937]">{viewExam.type}</p>
          </div>

          <div>
            <p className="mb-2 text-[14px] text-[#6b7280]">Total Questions</p>
            <p className="text-[20px] text-[#1f2937]">
              {viewExam.questions} questions
            </p>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 text-[14px] text-[#6b7280]">
              <Clock3 size={16} />
              Duration
            </p>
            <p className="text-[20px] text-[#1f2937]">{viewExam.duration}</p>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 text-[14px] text-[#6b7280]">
              <Calendar size={16} />
              Created Date
            </p>
            <p className="text-[20px] text-[#1f2937]">{viewExam.date}</p>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 text-[14px] text-[#6b7280]">
              <Users size={16} />
              Enrolled Students
            </p>
            <p className="text-[20px] text-[#1f2937]">
              {viewExam.enrolled} students
            </p>
          </div>

          <div>
            <p className="mb-2 text-[14px] text-[#6b7280]">Status</p>
            <span
              className={`rounded-full px-4 py-2 text-[14px] font-medium ${statusBadge(
                viewExam.status,
              )}`}
            >
              {viewExam.status}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t border-[#e5e7eb] bg-white px-5 py-5">
        <button
          onClick={() => setViewExam(null)}
          className="rounded-[14px] border border-[#d9dde5] bg-white px-3 py-3 text-[16px] text-[#374151]"
        >
          Close
        </button>
        <button
          onClick={() => {
            setEditExam(viewExam);
            setViewExam(null);
          }}
          className="rounded-[14px] bg-gradient-to-r from-[#5b5cf0] to-[#a21caf] px-3 py-3 text-[16px] text-white shadow-lg"
        >
          Edit Exam
        </button>
      </div>
    </ModalWrapper>
  );
};

export default ViewExamModal;
