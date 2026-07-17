import React, { useState, useEffect } from "react";
import { Calendar, Clock, Hourglass, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  studentName: string;
  course?: string;
  courseExams?: any[];
  codingExams?: any[];
  attemptedExamIds?: Set<number>;
  subscription?: any;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  studentName, 
  course = "Technical", 
  courseExams = [],
  codingExams = [], 
  attemptedExamIds = new Set(),
  subscription
}) => {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Determine the end date from the subscription object. Default to a future date if none is found for demo purposes, 
    // but ideally use the exact expiry.
    const endDateStr = subscription?.end_at || subscription?.end_date || subscription?.expiry_date;
    if (!endDateStr) return;

    const expiryTime = new Date(endDateStr).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = expiryTime - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [subscription]);

  // Combine and find the first unattempted exam
  const allAvailableExams = [
    ...courseExams.map(e => ({ ...e, type: "MCQ" })),
    ...codingExams.map(e => ({ ...e, type: "Coding" }))
  ];

  const unattemptedExams = allAvailableExams.filter(e => !attemptedExamIds.has(e.id || e.exam_id));
  
  // Sort by created_at (oldest first, or however you want to prioritize)
  unattemptedExams.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());

  const nextExam = unattemptedExams.length > 0 ? unattemptedExams[0] : null;

  const handleStartExam = () => {
    if (!nextExam) return;
    if (nextExam.type === "MCQ") {
      navigate("/mcq-exam", { state: { examId: nextExam.id } });
    } else {
      navigate("/individualcompiler", { state: { examId: nextExam.id } });
    }
  };
  return (
    <div className="rounded-3xl overflow-hidden bg-[#0A0520] text-white relative shadow-2xl flex flex-col md:flex-row mt-3">
      {/* Left side content */}
      <div className="relative z-20 p-6 md:p-8 flex-1">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {studentName.split(" ")[0]}!</h1>
        <p className="text-gray-400 text-sm mb-6">Here's your learning progress overview</p>

        {/* Glassmorphism Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl max-w-xl">
          <p className="text-xs text-gray-400 font-medium mb-2">Next Exam</p>

          {nextExam ? (
            <>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {nextExam.title || nextExam.exam_name || nextExam.name || "Upcoming Exam"}
                </h2>
                <span className={`text-white text-xs px-3 py-1 rounded-md font-semibold ${nextExam.type === 'Coding' ? 'bg-blue-600' : 'bg-[#2d1b61]'}`}>
                  {nextExam.type}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-300 text-xs mb-5">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {nextExam.created_at ? new Date(nextExam.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "TBA"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Hourglass className="w-3.5 h-3.5" />
                  <span>{nextExam.duration_minutes || nextExam.duration || 60} Minutes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{nextExam.question_count || 0} Questions</span>
                </div>
              </div>
            </>
          ) : (
            <div className="mb-5 mt-2">
              <h2 className="text-lg font-semibold text-gray-300">No upcoming exams</h2>
              <p className="text-xs text-gray-400 mt-1">You have attempted all available exams for your current courses.</p>
            </div>
          )}

          <p className="text-xs text-gray-400 font-medium mb-2">Subscription Expires In</p>

          <div className="flex items-center gap-2 sm:gap-4 mb-5">
            {/* Days */}
            <div className="text-center">
              <div className="bg-transparent border border-white/20 rounded-lg text-xl font-light w-[50px] h-[50px] flex items-center justify-center">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <p className="text-[10px] text-white font-bold mt-1.5 uppercase">Days</p>
            </div>

            <span className="text-white text-lg font-bold mb-4">•</span>

            {/* Hours */}
            <div className="text-center">
              <div className="bg-transparent border border-white/20 rounded-lg text-xl font-light w-[50px] h-[50px] flex items-center justify-center">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <p className="text-[10px] text-white font-bold mt-1.5 uppercase">Hours</p>
            </div>

            <span className="text-white text-lg font-bold mb-4">:</span>

            {/* Minutes */}
            <div className="text-center">
              <div className="bg-transparent border border-white/20 rounded-lg text-xl font-light w-[50px] h-[50px] flex items-center justify-center">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <p className="text-[10px] text-white font-bold mt-1.5 uppercase">Minutes</p>
            </div>

            <span className="text-white text-lg font-bold mb-4">:</span>

            {/* Seconds */}
            <div className="text-center">
              <div className="bg-transparent border border-white/20 rounded-lg text-xl font-light w-[50px] h-[50px] flex items-center justify-center">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <p className="text-[10px] text-white font-bold mt-1.5 uppercase">Seconds</p>
            </div>
          </div>

          <button 
            disabled={!nextExam}
            onClick={handleStartExam}
            className={`w-full font-medium py-2.5 rounded-xl transition shadow-lg text-sm ${!nextExam ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-[#3B2875] hover:bg-[#4a3490] text-white'}`}
          >
            {nextExam ? "Start Exam" : "No Exams Available"}
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
