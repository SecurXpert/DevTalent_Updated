import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Printer, Share2, Download, 
  CheckCircle2, BarChart2, FileText, 
  Trophy, CheckCircle, XCircle, Zap, BookOpen, ShieldCheck,
  Clock, CheckSquare, Send, Award
} from 'lucide-react';

const ViewScorecard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const exam = location.state?.exam;
  const [activeTab, setActiveTab] = useState('Overview');

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">No Scorecard Data Available</h2>
          <button 
            onClick={() => navigate('/student-results')}
            className="text-white bg-[#523de1] px-6 py-2.5 rounded-full transition shadow-sm"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* Top Navigation */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <button 
          onClick={() => navigate('/student-results')}
          className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 px-4 py-2 rounded-full transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Results
        </button>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition">
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#523de1] rounded-full hover:bg-blue-700 transition shadow-sm">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-8 px-6">
        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)] relative overflow-hidden mb-6">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-blue-500"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Left: Circular Progress */}
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <circle cx="80" cy="80" r="64" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                  <circle cx="80" cy="80" r="64" stroke="url(#scoreGradient)" strokeWidth="12" fill="transparent" strokeDasharray="402" strokeDashoffset={402 - (402 * exam.score) / 100} strokeLinecap="round" />
                </svg>
                <div className="absolute flex items-center justify-center">
                  <span className="text-5xl font-bold text-[#523de1]">{exam.score}%</span>
                </div>
              </div>
              <div className={`mt-4 px-6 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${exam.status === 'Passed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {exam.status === 'Passed' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {exam.status}
              </div>
            </div>

            {/* Middle: Info */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-purple-500 font-medium text-sm mb-1">{exam.courseName}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">{exam.title}</h1>
              
              <div className="mb-6 flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-5xl font-bold text-[#523de1]">{exam.marksEarned}</span>
                <span className="text-3xl font-bold text-purple-300">/</span>
                <span className="text-5xl font-bold text-purple-300">{exam.totalMarks}</span>
              </div>
              <p className="text-gray-400 text-sm font-medium mb-6">Marks Obtained</p>

              <div className="bg-green-50/80 border border-green-100 rounded-xl py-3 px-4 inline-flex items-center gap-2 text-green-700 text-sm font-medium">
                <span>🎉</span>
                {exam.status === 'Passed' ? "Excellent work! You've successfully passed the assessment." : "Don't give up! Review the material and try again."}
              </div>
            </div>

            {/* Right: Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center w-28 h-28">
                <span className="text-3xl font-bold text-gray-700 mb-1">{exam.stats.total}</span>
                <span className="text-xs text-gray-500 font-medium">Total Q's</span>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 flex flex-col items-center justify-center w-28 h-28">
                <span className="text-3xl font-bold text-purple-400 mb-1">{exam.stats.attempted}</span>
                <span className="text-xs text-purple-300 font-medium">Attempted</span>
              </div>
              <div className="bg-green-50/50 rounded-2xl p-4 flex flex-col items-center justify-center w-28 h-28">
                <span className="text-3xl font-bold text-green-500 mb-1">{exam.stats.correct}</span>
                <span className="text-xs text-green-400 font-medium">Correct</span>
              </div>
              <div className="bg-red-50/50 rounded-2xl p-4 flex flex-col items-center justify-center w-28 h-28">
                <span className="text-3xl font-bold text-red-500 mb-1">{exam.stats.wrong}</span>
                <span className="text-xs text-red-400 font-medium">Incorrect</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button 
            onClick={() => setActiveTab('Overview')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition shadow-sm ${activeTab === 'Overview' ? 'bg-[#523de1] text-white' : 'bg-white text-gray-500 hover:text-gray-700 border border-gray-100'}`}
          >
            <BarChart2 className="w-4 h-4" />
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('Analytics')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition shadow-sm ${activeTab === 'Analytics' ? 'bg-[#523de1] text-white' : 'bg-white text-gray-500 hover:text-gray-700 border border-gray-100'}`}
          >
            <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center"><div className="w-1.5 h-1.5 bg-current rounded-full"></div></div>
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('Exam Info')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition shadow-sm ${activeTab === 'Exam Info' ? 'bg-[#523de1] text-white' : 'bg-white text-gray-500 hover:text-gray-700 border border-gray-100'}`}
          >
            <FileText className="w-4 h-4" />
            Exam Info
          </button>
        </div>

        {activeTab === 'Analytics' && (
          <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
            <h3 className="text-xl font-bold text-gray-900 mb-8">Detailed Metrics</h3>
            <div className="flex flex-col">
              <div className="flex justify-between py-5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Total Questions</span>
                <span className="font-bold text-gray-700">{exam.stats.total}</span>
              </div>
              <div className="flex justify-between py-5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Attempted Questions</span>
                <span className="font-bold text-purple-600">{exam.stats.attempted}</span>
              </div>
              <div className="flex justify-between py-5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Correct Answers</span>
                <span className="font-bold text-green-600">{exam.stats.correct}</span>
              </div>
              <div className="flex justify-between py-5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Incorrect Answers</span>
                <span className="font-bold text-red-600">{exam.stats.wrong}</span>
              </div>
              <div className="flex justify-between py-5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Obtained Score</span>
                <span className="font-bold text-purple-600">{exam.marksEarned} marks</span>
              </div>
              <div className="flex justify-between py-5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Total Score</span>
                <span className="font-bold text-gray-700">{exam.totalMarks} marks</span>
              </div>
              <div className="flex justify-between py-5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Passing Percentage</span>
                <span className="font-bold text-orange-500">{exam.raw?.pass_percentage || 60}%</span>
              </div>
              <div className="flex justify-between py-5">
                <span className="text-gray-500 font-medium">Your Percentage</span>
                <span className={`font-bold ${exam.status === 'Passed' ? 'text-green-600' : 'text-red-600'}`}>{exam.score}%</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
            <h3 className="text-lg font-bold text-gray-900 mb-8">Performance Summary</h3>
            
            <div className="space-y-6 mb-12">
              {/* Attempt Rate */}
              <div className="flex items-center">
                <div className="w-40 text-sm font-medium text-gray-500">Attempt Rate</div>
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${exam.stats.total > 0 ? Math.round((exam.stats.attempted / exam.stats.total) * 100) : 0}%` }}></div>
                  </div>
                  <div className="w-12 text-right font-bold text-gray-700 text-sm">{exam.stats.total > 0 ? Math.round((exam.stats.attempted / exam.stats.total) * 100) : 0}%</div>
                </div>
              </div>

              {/* Correct Answer Rate */}
              <div className="flex items-center">
                <div className="w-40 text-sm font-medium text-gray-500">Correct Answer Rate</div>
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 rounded-full" style={{ width: `${exam.stats.attempted > 0 ? Math.round((exam.stats.correct / exam.stats.attempted) * 100) : 0}%` }}></div>
                  </div>
                  <div className="w-12 text-right font-bold text-gray-700 text-sm">{exam.score}%</div>
                </div>
              </div>

              {/* Score Achieved */}
              <div className="flex items-center">
                <div className="w-40 text-sm font-medium text-gray-500">Score Achieved</div>
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${exam.score}%` }}></div>
                  </div>
                  <div className="w-12 text-right font-bold text-gray-700 text-sm">{exam.score}%</div>
                </div>
              </div>

              {/* Pass Requirement */}
              <div className="flex items-center">
                <div className="w-40 text-sm font-medium text-gray-500">Pass Requirement</div>
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex items-center">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${exam.raw?.pass_percentage || 60}%` }}></div>
                    <div className="h-3 w-1 bg-white"></div>
                  </div>
                  <div className="w-12 text-right font-bold text-gray-700 text-sm">{exam.raw?.pass_percentage || 60}%</div>
                </div>
              </div>
            </div>

            {/* Accuracy Meter */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-4">Accuracy Meter</h4>
              <div className="relative pt-1">
                <div className="flex h-3 mb-4 overflow-hidden text-xs bg-gray-100 rounded-full">
                  <div style={{ width: `${exam.stats.attempted > 0 ? Math.round((exam.stats.correct / exam.stats.attempted) * 100) : 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
                  <span>0%</span>
                  <span className="text-gray-600">{exam.stats.attempted > 0 ? Math.round((exam.stats.correct / exam.stats.attempted) * 100) : 0}% accurate</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Personalized Feedback */}
            <div className="bg-green-50/30 rounded-3xl p-6 border border-green-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Personalized Feedback</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Outstanding performance! You scored 75%, well above the passing threshold. Your dedication to mastering {exam.courseName} is clearly showing. Keep up this excellent momentum!
              </p>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.04)] flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Achievements</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Exam Completed</span>
                </div>
                
                <div className="bg-yellow-50 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">First Attempt</span>
                </div>
                
                <div className="bg-green-50 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Course Completed</span>
                </div>
                
                <div className="bg-blue-50 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Verified Result</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'Exam Info' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Exam Information */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
              <h3 className="text-xl font-bold text-gray-900 mb-8">Exam Information</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-2xl flex justify-between items-center px-6 py-4">
                  <span className="text-gray-500 text-sm font-medium">Student ID</span>
                  <span className="font-bold text-gray-900 font-mono text-sm">{exam.raw?.student_id || 'N/A'}</span>
                </div>
                <div className="bg-gray-50 rounded-2xl flex justify-between items-center px-6 py-4">
                  <span className="text-gray-500 text-sm font-medium">Course ID</span>
                  <span className="font-bold text-gray-900 font-mono text-sm">{exam.courseId || 'N/A'}</span>
                </div>
                <div className="bg-gray-50 rounded-2xl flex justify-between items-center px-6 py-4">
                  <span className="text-gray-500 text-sm font-medium">Exam ID</span>
                  <span className="font-bold text-gray-900 font-mono text-sm">{exam.raw?.exam_id || 'N/A'}</span>
                </div>
                <div className="bg-gray-50 rounded-2xl flex justify-between items-center px-6 py-4">
                  <span className="text-gray-500 text-sm font-medium">Attempt ID</span>
                  <span className="font-bold text-gray-900 font-mono text-sm">{exam.raw?.attempt_id || 'N/A'}</span>
                </div>
                <div className="bg-gray-50 rounded-2xl flex justify-between items-center px-6 py-4">
                  <span className="text-gray-500 text-sm font-medium">Exam Type</span>
                  <span className="font-bold text-gray-900 font-mono text-sm">{exam.type}</span>
                </div>
                <div className="bg-gray-50 rounded-2xl flex justify-between items-center px-6 py-4">
                  <span className="text-gray-500 text-sm font-medium">Exam Date</span>
                  <span className="font-bold text-gray-900 font-mono text-sm">{exam.date}</span>
                </div>
                <div className="bg-gray-50 rounded-2xl flex justify-between items-center px-6 py-4">
                  <span className="text-gray-500 text-sm font-medium">Exam Time</span>
                  <span className="font-bold text-gray-900 font-mono text-sm">{exam.time}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Timeline & Certificate */}
            <div className="flex flex-col gap-6">
              {/* Exam Timeline */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
                <h3 className="text-xl font-bold text-gray-900 mb-8">Exam Timeline</h3>
                <div className="relative pl-3">
                  <div className="absolute left-[31px] top-4 bottom-4 w-px bg-purple-200"></div>
                  
                  <div className="relative flex gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-[#523de1] text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Exam Started</h4>
                      <p className="text-gray-400 text-xs mt-0.5">{exam.date} at {exam.time}</p>
                    </div>
                  </div>

                  <div className="relative flex gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-[#523de1] text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <CheckSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Questions Answered</h4>
                      <p className="text-gray-400 text-xs mt-0.5">{exam.stats.attempted} of {exam.stats.total} answered</p>
                    </div>
                  </div>

                  <div className="relative flex gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-[#523de1] text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Exam Submitted</h4>
                      <p className="text-gray-400 text-xs mt-0.5">Auto-submitted on completion</p>
                    </div>
                  </div>

                  <div className="relative flex gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-[#523de1] text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Result Generated</h4>
                      <p className="text-gray-400 text-xs mt-0.5">Instantly evaluated</p>
                    </div>
                  </div>

                  <div className="relative flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#523de1] text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Certificate Issued</h4>
                      <p className="text-gray-400 text-xs mt-0.5">Available for download</p>
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
        )}
      </main>
    </div>
  );
};

export default ViewScorecard;
