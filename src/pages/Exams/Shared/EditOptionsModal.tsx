import React from "react";
import { X, Code, FileText } from "lucide-react";
import { ExamItem } from "../types";

interface EditOptionsModalProps {
  exam: ExamItem | null;
  onClose: () => void;
  onEditMCQ: () => void;
  onEditCoding: () => void;
}

const EditOptionsModal: React.FC<EditOptionsModalProps> = ({
  exam,
  onClose,
  onEditMCQ,
  onEditCoding,
}) => {
  if (!exam) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Edit Options
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose what to edit for "{exam.title}"
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            This is a mixed exam with both MCQ and Coding questions. 
            Select which section you'd like to edit:
          </p>

          <div className="space-y-3">
            <button
              onClick={onEditMCQ}
              className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Edit MCQ Questions</h3>
                <p className="text-sm text-gray-500">Modify multiple choice questions and options</p>
              </div>
            </button>

            <button
              onClick={onEditCoding}
              className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Edit Coding Questions</h3>
                <p className="text-sm text-gray-500">Modify programming problems and solutions</p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOptionsModal;
