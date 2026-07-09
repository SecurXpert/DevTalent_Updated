import React from "react";
import { Calendar, Clock, Hourglass, FileText } from "lucide-react";

interface DashboardHeaderProps {
  studentName: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ studentName }) => {
  return (
    <div className="rounded-3xl overflow-hidden bg-[#0A0520] text-white relative shadow-2xl flex flex-col md:flex-row mt-3">
      {/* Left side content */}
      <div className="relative z-20 p-6 md:p-8 flex-1">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {studentName.split(" ")[0]}!</h1>
        <p className="text-gray-400 text-sm mb-6">Here's your learning progress overview</p>

        {/* Glassmorphism Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl max-w-xl">
          <p className="text-xs text-gray-400 font-medium mb-2">Next Exam</p>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Data Structures & Algorithms</h2>
            <span className="bg-[#2d1b61] text-white text-xs px-3 py-1 rounded-md font-semibold">Technical</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-300 text-xs mb-5">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>25 May, 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>10: 00 AM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Hourglass className="w-3.5 h-3.5" />
              <span>90 Minutes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>60 Marks</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 font-medium mb-2">Starts In</p>

          <div className="flex items-center gap-2 sm:gap-4 mb-5">
            {/* Days */}
            <div className="text-center">
              <div className="bg-transparent border border-white/20 rounded-lg text-xl font-light w-[50px] h-[50px] flex items-center justify-center">
                01
              </div>
              <p className="text-[10px] text-white font-bold mt-1.5 uppercase">Days</p>
            </div>

            <span className="text-white text-lg font-bold mb-4">•</span>

            {/* Hours */}
            <div className="text-center">
              <div className="bg-transparent border border-white/20 rounded-lg text-xl font-light w-[50px] h-[50px] flex items-center justify-center">
                14
              </div>
              <p className="text-[10px] text-white font-bold mt-1.5 uppercase">Hours</p>
            </div>

            <span className="text-white text-lg font-bold mb-4">:</span>

            {/* Minutes */}
            <div className="text-center">
              <div className="bg-transparent border border-white/20 rounded-lg text-xl font-light w-[50px] h-[50px] flex items-center justify-center">
                22
              </div>
              <p className="text-[10px] text-white font-bold mt-1.5 uppercase">Minutes</p>
            </div>

            <span className="text-white text-lg font-bold mb-4">:</span>

            {/* Seconds */}
            <div className="text-center">
              <div className="bg-transparent border border-white/20 rounded-lg text-xl font-light w-[50px] h-[50px] flex items-center justify-center">
                30
              </div>
              <p className="text-[10px] text-white font-bold mt-1.5 uppercase">Seconds</p>
            </div>
          </div>

          <button className="w-full bg-[#3B2875] hover:bg-[#4a3490] text-white font-medium py-2.5 rounded-xl transition shadow-lg text-sm">
            Start Exam
          </button>
        </div>
      </div>

      {/* Right side placeholder gradient/image */}
      <div className="hidden lg:block w-[45%] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0520] via-[#0A0520]/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop"
          alt="Student studying"
          className="w-full h-full object-cover object-left opacity-90"
        />
      </div>
    </div>
  );
};
