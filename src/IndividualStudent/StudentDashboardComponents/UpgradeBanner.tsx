import React from "react";
import { Crown, CheckCircle } from "lucide-react";

export const UpgradeBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1E1B4B] to-[#312E81] rounded-3xl p-8 shadow-2xl border border-indigo-500/20 group">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-indigo-500/20 transition-all duration-700"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 group-hover:bg-purple-500/20 transition-all duration-700"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 text-center md:text-left">
          {/* BADGE */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-medium mb-6">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span>Premium Plan</span>
          </div>

          {/* HEADINGS */}
          <div className="space-y-2 mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Unlock Your True Potential
            </h2>
            <h3 className="text-xl text-indigo-200 font-medium flex items-center justify-center md:justify-start gap-2">
              L4 Advanced Certification
            </h3>
          </div>

          {/* DESCRIPTION */}
          <p className="text-[#E5E7EB] text-[15px] leading-relaxed mb-6 max-w-xs md:max-w-md mx-auto md:mx-0">
            Get access to L4 Advanced certification and premium exams
          </p>

          {/* BUTTON */}
          <button className="bg-gradient-to-r from-[#FACC15] to-[#D97706] text-[#111827] font-semibold py-2.5 px-8 rounded-xl shadow-md hover:opacity-90 transition min-w-[200px]">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};
