import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Devlogo from "../assests/Devlogo.png";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  XCircle,
  TrendingUp,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  Code,
  Target,
  Award,
  LineChart as LineChartIcon
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell
} from 'recharts';
import { API_BASE_URL } from "@/pages/Services/api/api";

const Results = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [coursePerformanceData, setCoursePerformanceData] = useState<any[]>([]);
  const [recentActivityData, setRecentActivityData] = useState<any[]>([]);
  const [resultsData, setResultsData] = useState<any[]>([]);
  
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sortOrder, setSortOrder] = useState('Latest');

  const [summary, setSummary] = useState({
    totalExams: 0,
    passedExams: 0,
    failedExams: 0,
    averageScore: 0,
  });

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
        
        // 1. Fetch user's subscriptions to get their courses
        const subResponse = await fetch(`${API_BASE_URL}/student/subscription/current`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        let courseIds: number[] = [];
        let courseMap = new Map<number, string>();

        if (subResponse.ok) {
          const subData = await subResponse.json();
          const subs = Array.isArray(subData) ? subData : (subData ? [subData] : []);
          const activeSubs = subs.filter((s: any) => s.status === 'active' || s.status === 'Success');
          
          activeSubs.forEach((sub: any) => {
             if (sub.selected_courses && Array.isArray(sub.selected_courses)) {
                sub.selected_courses.forEach((c: any) => {
                   const cId = c.course_id || c.id || c;
                   if (cId && !courseIds.includes(cId)) {
                      courseIds.push(cId);
                      courseMap.set(cId, c.course_name || `Course ${cId}`);
                   }
                });
             }
          });
        }

        // 2. Fetch catalog to ensure we have course names if they weren't in the subscription
        if (courseIds.length > 0) {
          const coursesResponse = await fetch(`${API_BASE_URL}/admin/catalog/courses`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (coursesResponse.ok) {
             const coursesData = await coursesResponse.json();
             const list = Array.isArray(coursesData) ? coursesData : (coursesData.data || coursesData.items || []);
             list.forEach((c: any) => {
                if (courseMap.has(c.id)) {
                   courseMap.set(c.id, c.name);
                }
             });
          }
        }

        // 3. Fetch performance and exams for each course
        let totalAttempted = 0;
        let totalPassed = 0;
        let totalAvg = 0;
        let performanceList = [];
        let allExamsList: any[] = [];

        for (const cId of courseIds) {
           const perfResponse = await fetch(`${API_BASE_URL}/student/scorecard/courses/${cId}/performance`, {
              headers: { "Authorization": `Bearer ${token}` }
           });
           if (perfResponse.ok) {
              const perfData = await perfResponse.json();
              
              totalAttempted += perfData.total_exams_attempted || 0;
              totalPassed += perfData.total_exams_passed || 0;
              totalAvg += perfData.average_percentage || 0;

              performanceList.push({
                 name: courseMap.get(cId) || `Course ${cId}`,
                 score: perfData.average_percentage || 0,
                 ...perfData
              });
           }

           const examsResponse = await fetch(`${API_BASE_URL}/student/scorecard/courses/${cId}/exams`, {
              headers: { "Authorization": `Bearer ${token}` }
           });
           if (examsResponse.ok) {
              const examsData = await examsResponse.json();
              const exams = Array.isArray(examsData) ? examsData : [];
              
              exams.forEach((exam: any) => {
                 const createdDate = exam.created_at ? new Date(exam.created_at) : new Date();
                 allExamsList.push({
                    id: exam.id || Math.random(),
                    courseName: courseMap.get(cId) || `Course ${cId}`,
                    type: exam.exam_kind || "MCQ",
                    title: `Exam ${exam.exam_id || exam.id || ""}`,
                    status: exam.is_passed ? "Passed" : "Failed",
                    marksEarned: exam.obtained_score || 0,
                    totalMarks: exam.total_score || 0,
                    score: exam.percentage || 0,
                    stats: {
                       total: exam.total_questions || 0,
                       attempted: exam.attempted_questions || 0,
                       correct: exam.correct_count || 0,
                       wrong: Math.max(0, (exam.attempted_questions || 0) - (exam.correct_count || 0))
                    },
                    date: createdDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                    time: createdDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                    createdAt: createdDate.getTime(),
                    raw: exam,
                    courseId: cId
                 });
              });
           }
        }

        setCoursePerformanceData(performanceList);
        
        allExamsList.sort((a, b) => b.createdAt - a.createdAt);
        setResultsData(allExamsList);

        const recentExams = [...allExamsList].sort((a, b) => a.createdAt - b.createdAt).slice(-7);
        setRecentActivityData(recentExams.map((ex, i) => ({
           name: `Exam ${i + 1}`,
           score: ex.score
        })));
        
        let failed = totalAttempted - totalPassed;
        if (failed < 0) failed = 0;

        setSummary({
           totalExams: totalAttempted,
           passedExams: totalPassed,
           failedExams: failed,
           averageScore: performanceList.length > 0 ? Math.round(totalAvg / performanceList.length) : 0
        });

        setLoading(false);

      } catch (err) {
        console.error("Error fetching performance", err);
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);




  const filteredAndSortedResults = resultsData
    .filter(result => {
      // 1. Search text
      if (searchTerm && !result.courseName.toLowerCase().includes(searchTerm.toLowerCase()) && !result.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      // 2. Course
      if (courseFilter !== 'All Courses' && result.courseName !== courseFilter) return false;
      // 3. Type
      if (typeFilter !== 'All Types') {
        const t = typeFilter.toLowerCase();
        if (t === 'mcq' && result.type?.toLowerCase() !== 'mcq') return false;
        if (t === 'coding' && result.type?.toLowerCase() !== 'coding') return false;
      }
      // 4. Status
      if (statusFilter !== 'All Status' && result.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'Latest') return b.createdAt - a.createdAt;
      return a.createdAt - b.createdAt;
    });

  const uniqueCourses = Array.from(new Set(resultsData.map(r => r.courseName))).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b">
        <div className="flex items-center">
          <img src={Devlogo} alt="DevTalent Logo" className="h-8 object-contain" />
        </div>
        <button
          onClick={() => navigate("/studentdashboard")}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-purple-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Results</h1>
          <p className="text-gray-500">
            View your completed exams, track your performance, and download your scorecards.
          </p>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Exams */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4 hover:border-purple-500 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{summary.totalExams}</div>
              <div className="text-sm font-medium text-gray-700">Total Exams</div>
              <div className="text-xs text-gray-400">All attempts</div>
            </div>
          </div>

          {/* Passed Exams */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4 hover:border-purple-500 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">{summary.passedExams}</div>
              <div className="text-sm font-medium text-gray-700">Passed Exams</div>
              <div className="text-xs text-gray-400">63% success rate</div>
            </div>
          </div>

          {/* Failed Exams */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4 hover:border-purple-500 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">{summary.failedExams}</div>
              <div className="text-sm font-medium text-gray-700">Failed Exams</div>
              <div className="text-xs text-gray-400">Needs improvement</div>
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4 hover:border-purple-500 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">{summary.averageScore}%</div>
              <div className="text-sm font-medium text-gray-700">Average Score</div>
              <div className="text-xs text-gray-400">Across all exams</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border flex flex-wrap items-center gap-4 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search exams or courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <BookOpen className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select 
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border rounded-xl text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer min-w-[140px]"
              >
                <option value="All Courses">All Courses</option>
                {uniqueCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="relative">
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border rounded-xl text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer min-w-[130px]"
              >
                <option value="All Types">All Types</option>
                <option value="MCQ">MCQ</option>
                <option value="Coding">Coding</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="relative">
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border rounded-xl text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer min-w-[130px]"
              >
                <option value="All Status">All Status</option>
                <option value="Passed">Passed</option>
                <option value="Failed">Failed</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="relative">
              <ArrowUpDown className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border border-purple-200 text-purple-600 rounded-xl text-sm hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer min-w-[120px]"
              >
                <option value="Latest">Latest</option>
                <option value="Oldest">Oldest</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-purple-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          Showing <span className="font-semibold text-gray-900">{filteredAndSortedResults.length}</span> results
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedResults.map((result) => (
            <div key={result.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col relative pt-1 hover:border-purple-500 hover:-translate-y-1 transition-all duration-300">
              {/* Top border color line */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${result.status === 'Passed' && result.score > 80 ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                  result.status === 'Passed' ? 'bg-blue-500' : 'bg-orange-500'
                }`}></div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <BookOpen className="w-3 h-3" />
                    {result.courseName}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium ${result.type === 'MCQ' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                    {result.type === 'MCQ' ? <BookOpen className="w-3 h-3" /> : <Code className="w-3 h-3" />}
                    {result.type}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 mb-4">{result.title}</h3>

                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${result.status === 'Passed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {result.status === 'Passed' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {result.status}
                  </span>
                  <div className="text-right">
                    <div className="font-bold text-xl leading-none">{result.marksEarned}/{result.totalMarks}</div>
                    <div className="text-xs text-gray-500">Marks</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Score</span>
                    <span className={`font-bold ${result.status === 'Passed' && result.score > 80 ? 'text-blue-600' :
                        result.status === 'Passed' ? 'text-blue-500' : 'text-orange-500'
                      }`}>{result.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${result.status === 'Passed' && result.score > 80 ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                          result.status === 'Passed' ? 'bg-blue-500' : 'bg-orange-500'
                        }`}
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center text-center bg-gray-50 rounded-xl py-3 px-2 mb-4">
                  <div>
                    <div className="font-bold text-gray-900">{result.stats.total}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Total</div>
                  </div>
                  <div>
                    <div className="font-bold text-purple-500">{result.stats.attempted}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Attempted</div>
                  </div>
                  <div>
                    <div className="font-bold text-green-500">{result.stats.correct}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Correct</div>
                  </div>
                  <div>
                    <div className="font-bold text-red-500">{result.stats.wrong}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Wrong</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400 mb-6">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full border border-gray-300 flex items-center justify-center">📅</span>
                    {result.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full border border-gray-300 flex items-center justify-center">🕒</span>
                    {result.time}
                  </div>
                </div>

                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => navigate('/scorecard', { state: { exam: result } })}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View Scorecard
                  </button>
                  <button className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center hover:bg-purple-100 transition">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Insights Section */}
        <div className="mb-6 flex items-center gap-3 mt-12">
          <div className="w-10 h-10 rounded-full bg-[#523de1] flex items-center justify-center shadow-md shadow-blue-200">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">Performance Insights</h2>
            <p className="text-sm text-gray-500">Your learning analytics at a glance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pass Rate Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border hover:border-purple-500 transition-all duration-300 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="text-purple-600">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-gray-700">Pass Rate</h3>
            </div>

            <div className="flex items-center justify-center gap-8 mb-6 flex-1">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 transform -rotate-90">
                  <defs>
                    <linearGradient id="passGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <circle cx="56" cy="56" r="44" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-50" />
                  <circle cx="56" cy="56" r="44" stroke="url(#passGradient)" strokeWidth="12" fill="transparent" strokeDasharray="276" strokeDashoffset={276 - (276 * (summary.totalExams > 0 ? Math.round((summary.passedExams / summary.totalExams) * 100) : 0)) / 100} strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#523de1] mb-1">{summary.totalExams > 0 ? Math.round((summary.passedExams / summary.totalExams) * 100) : 0}%</div>
                <div className="text-sm text-gray-500">Pass Rate</div>
                <div className="text-xs text-gray-400">{summary.passedExams} of {summary.totalExams} exams</div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
              <span className="text-sm text-gray-500">Avg Score</span>
              <span className="font-bold text-gray-900">{summary.averageScore}%</span>
            </div>
          </div>

          {/* Course Performance Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border hover:border-purple-500 transition-all duration-300 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="text-purple-600">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-gray-700">Course Performance</h3>
            </div>
            <div className="flex-1 w-full min-h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={coursePerformanceData} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" axisLine={false} tickLine={true} tick={{ fontSize: 10, fill: '#9ca3af' }} domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={true} tick={{ fontSize: 10, fill: '#6b7280' }} width={110} />
                  <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
                    {coursePerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="url(#barGradient)" />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="barGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border hover:border-purple-500 transition-all duration-300 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="text-purple-600">
                <LineChartIcon className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-gray-700">Recent Activity</h3>
            </div>
            <div className="flex-1 w-full min-h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recentActivityData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={true} tick={{ fontSize: 10, fill: '#9ca3af' }} tickMargin={8} />
                  <YAxis axisLine={false} tickLine={true} tick={{ fontSize: 10, fill: '#9ca3af' }} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#6366f1' }} activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Results;
