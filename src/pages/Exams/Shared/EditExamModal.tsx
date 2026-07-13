import React from "react";
import { X, FileText, Clock3, Calendar } from "lucide-react";
import { ExamItem } from "../types";
import InputField from "./InputField";
import SelectField from "./SelectField";
import ModalWrapper from "./ModalWrapper";

interface EditExamModalProps {
  editExam: ExamItem | null;
  setEditExam: (exam: ExamItem | null) => void;
  handleSaveEdit: () => void;
}

const EditExamModal: React.FC<EditExamModalProps> = ({
  editExam,
  setEditExam,
  handleSaveEdit,
}) => {
  if (!editExam) return null;

  return (
    <ModalWrapper onClose={() => setEditExam(null)}>
      <div className="rounded-t-[20px] bg-[#f3f2fb] px-6 pig-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[28px] font-bold text-[#1f2937]">Edit Exam</h2>
            <p className="text-[14px] text-[#6b7280]">
              Update exam information
            </p>
          </div>
          <button onClick={() => setEditExam(null)} className="text-[#6b7280]">
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="bg-white px-pig-8">
        <div className="space-y-6">
          <InputField
            label="Exam Name"
            value={editExam.title}
            onChange={(value) => setEditExam({ ...editExam, title: value })}
            icon={<FileText size={16} />}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField
              label="Exam Type"
              value={editExam.type}
              onChange={(value) => setEditExam({ ...editExam, type: value })}
              options={["MCQ", "Coding", "Image Analysis"]}
            />
            <InputField
              label="Total Questions"
              value={editExam.questions}
              onChange={(value) =>
                setEditExam({ ...editExam, questions: Number(value || 0) })
              }
              type="number"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              label="Duration (minutes)"
              value={editExam.duration}
              onChange={(value) =>
                setEditExam({ ...editExam, duration: value })
              }
              icon={<Clock3 size={16} />}
            />
            <InputField
              label="Created Date"
              value={editExam.date}
              onChange={(value) => setEditExam({ ...editExam, date: value })}
              icon={<Calendar size={16} />}
            />
          </div>

          <div className="max-w-[320px]">
            <SelectField
              label="Status"
              value={editExam.status}
              onChange={(value) =>
                setEditExam({ ...editExam, status: value as any })
              }
              options={["Active", "Draft", "Closed"]}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t border-[#e5e7eb] bg-white px-6 pig-5">
        <button
          onClick={() => setEditExam(null)}
          className="rounded-[14px] border border-[#d9dde5] bg-white px- pig-3 text-[16px] text-[#374151]"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveEdit}
          className="rounded-[14px] bg-gradient-to-r from-[#5b5cf0] to-[#a21caf] px- pig-3 text-[16px] text-white shadow-lg"
        >
          Save Changes
        </button>
      </div>
    </ModalWrapper>
  );
};

export default EditExamModal;
