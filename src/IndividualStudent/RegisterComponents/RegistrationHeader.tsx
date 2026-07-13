import React from "react";
import { GraduationCap } from "lucide-react";

export const RegistrationHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-[#7B2CBF] to-[#3C096C] p-6 text-white">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <GraduationCap size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Create Your Account</h2>
          <p className="text-xs opacity-90">
            Join thousands of students advancing their skills
          </p>
        </div>
      </div>
    </div>
  );
};
