import React from "react";
import { X, FileText, Code, Image } from "lucide-react";
import ModalWrapper from "../Shared/ModalWrapper";

interface QuestionChooserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMCQ: () => void;
  onSelectCoding: () => void;
  onSelectImage: () => void;
}

const QuestionChooser: React.FC<QuestionChooserProps> = ({
  isOpen,
  onClose,
  onSelectMCQ,
  onSelectCoding,
  onSelectImage,
}) => {
  if (!isOpen) return null;

  return (
    <ModalWrapper onClose={onClose}>
      <div className="bg-white rounded-[16px] p-6 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-semibold text-[#1f2937]">
            Choose Question Type
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onSelectMCQ}
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FileText size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">MCQ Question</h3>
            </div>
            <p className="text-sm text-gray-600">
              Multiple choice questions with single correct answer options
            </p>
          </button>

          <button
            onClick={onSelectCoding}
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Code size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Coding Question</h3>
            </div>
            <p className="text-sm text-gray-600">
              Programming problems with code editor and test cases
            </p>
          </button>

          <button
            onClick={onSelectImage}
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <Image size={24} className="text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Image Analysis</h3>
            </div>
            <p className="text-sm text-gray-600">
              Questions with image upload and visual analysis requirements
            </p>
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default QuestionChooser;
