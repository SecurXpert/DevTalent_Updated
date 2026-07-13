import React from "react";
import { X } from "lucide-react";
import { ModalWrapperProps } from "../types";

const ModalWrapper: React.FC<ModalWrapperProps> = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-[20px] bg-[#f7f7ff] shadow-2xl">
        {children}
      </div>
      <button
        onClick={onClose}
        className="absolute right-6 top-6 rounded-full p-2 text-white"
      >
        <X size={22} />
      </button>
    </div>
  );
};

export default ModalWrapper;
