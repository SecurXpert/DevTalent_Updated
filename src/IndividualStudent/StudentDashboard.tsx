import { useNavigate } from "react-router-dom";
import Devlogo from "../assests/Devlogo.png";
import FilterIcon from "../assests/icon.png";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/pages/Services/api/api";
import { TrendingUp } from "lucide-react";
import { Dot } from "lucide-react";
import {
  Link,
  PlayCircle,
  BarChart3,
  Award,
  FileText,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import {
  User,
  LogOut,
  BookOpen,
  CheckCircle,
  Clock,
  Calendar,
  Trophy,
  Medal,
  Circle,
  CheckCircle2,
} from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [course, setCourse] = useState(() => {
    return localStorage.getItem("registeredCourse") || "Technical";
  });
  const [time, setTime] = useState("All Time");
  const [studentName, setStudentName] = useState("Rahul Sharma");
  const [subscription, setSubscription] = useState<any>(null);
  const [allSubscriptions, setAllSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchActiveSubscription = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/student/subscription/current`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched active subscription in dashboard:", data);
          let subs = Array.isArray(data) ? data : (data ? [data] : []);
          setAllSubscriptions(subs);

          if (subs.length > 0) {
            // Filter active subscriptions and sort to find the one expiring first
            const activeSubs = subs.filter((s: any) => s.status === 'active' || s.status === 'Success');
            const targetSubs = activeSubs.length > 0 ? activeSubs : subs;

            targetSubs.sort((a: any, b: any) => new Date(a.end_at).getTime() - new Date(b.end_at).getTime());
            
            const storedPlanId = localStorage.getItem("selectedPlanId");
            let sub = targetSubs[0];
            if (storedPlanId) {
              const matched = targetSubs.find((s: any) => String(s.subscription_id) === String(storedPlanId));
              if (matched) sub = matched;
            }
            
            setSubscription(sub);
            localStorage.setItem("selectedPlanId", String(sub.subscription_id));

            // If they have coding exams (coding_total > 0), they are registered for Technical
            if (sub.coding_total > 0) {
              setCourse("Technical");
              localStorage.setItem("registeredCourse", "Technical");
            } else if (sub.mcq_total > 0) {
              // If only MCQ exams are present, it could be Non-Technical or Technical (depending on selection)
              setCourse(localStorage.getItem("registeredCourse") || "Non-Technical");
            }
          }
        }

        // Decode token to get student ID
        let studentId = "";
        try {
          if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            studentId = String(
              payload.user_id || payload.id || payload.candidate_id || payload.sub || ""
            );
          }
        } catch (e) {
          console.error("Error decoding token for student ID", e);
        }

        const endpoint = studentId
          ? `${API_BASE_URL}/student/students/${studentId}`
          : `${API_BASE_URL}/student/students`;

        // Fetch student info
        const studentResponse = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (studentResponse.ok) {
          const studentData = await studentResponse.json();
          const student = Array.isArray(studentData) ? studentData[0] : studentData;
          if (student && student.full_name) {
            setStudentName(student.full_name);
          }
        }
      } catch (error) {
        console.error("Error fetching subscription in dashboard:", error);
      }
    };

    fetchActiveSubscription();
  }, []);

  const calculateDaysRemaining = (endAt: string) => {
    if (!endAt) return 0;
    const end = new Date(endAt).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysRemaining = subscription ? calculateDaysRemaining(subscription.end_at) : 0;

  let activeCoursesCount = 0;
  if (subscription) {
    const planStr = (subscription.plan_name || subscription.plan_type || "").toLowerCase();
    if (planStr.includes("triple")) activeCoursesCount = 3;
    else if (planStr.includes("dual")) activeCoursesCount = 2;
    else activeCoursesCount = 1;
  }

  const completedExams = subscription ? ((subscription.coding_used || 0) + (subscription.mcq_used || 0)) : 0;
  const pendingExams = subscription ? ((subscription.coding_remaining || 0) + (subscription.mcq_remaining || 0)) : 0;
  const totalExams = completedExams + pendingExams;
  const examCompletionPercent = totalExams > 0 ? Math.round((completedExams / totalExams) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4 sm:px-8 pt-24 pb-10">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="flex justify-between items-center px-6 py-3">
          <img
            src={Devlogo}
            alt="logo"
            style={{ width: "72px", height: "72px", opacity: 1 }}
          />

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 font-medium text-gray-700"
            >
              <User className="w-4 h-4" />
              {studentName}
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-red-500 hover:text-red-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <div className="mb-6 mt-10">
        <h1 className="text-2xl font-bold">Welcome back, {studentName.split(" ")[0]}!</h1>
        <p className="text-gray-500">Here's your learning progress overview</p>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-5 rounded-xl shadow-xl flex justify-between items-center">
          <BookOpen />
          <div className="text-right">
            <p className="text-2xl font-bold">{activeCoursesCount}</p>
            <p className="text-sm">Active Courses</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-5 rounded-xl shadow-xl flex justify-between items-center">
          <CheckCircle />
          <div className="text-right">
            <p className="text-2xl font-bold">{completedExams}</p>
            <p className="text-sm">Completed Exams</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-5 rounded-xl shadow-xl flex justify-between items-center">
          <Clock />
          <div className="text-right">
            <p className="text-2xl font-bold">{pendingExams}</p>
            <p className="text-sm">Pending Exams</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-5 rounded-xl shadow-xl flex justify-between items-center">
          <Calendar />
          <div className="text-right">
            <p className="text-2xl font-bold">{subscription ? daysRemaining : 0}</p>
            <p className="text-sm">Days Remaining</p>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* PERFORMANCE CARD */}
          <div className="rounded-2xl shadow-xl border border-purple-200 overflow-hidden bg-white">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-purple-200 to-purple-100 px-6 py-5">
              <h2 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
                <Trophy className="w-5 h-5 text-purple-600" />
                Performance Metrics
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Your examination performance at a glance
              </p>
            </div>

            {/* CONTENT */}
            <div className="p-6 space-y-6">
              {/* STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div
                  className="rounded-xl py-8 text-center shadow-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124, 58, 237, 0.5) 0%, #FAF5FF 100%)",
                  }}
                >
                  <p className="text-4xl font-bold text-purple-700">82%</p>
                  <p className="text-gray-600 text-sm mt-1">Avg Score</p>
                </div>

                <div
                  className="rounded-xl py-8 text-center shadow-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(11, 176, 121, 0.5) 10%, #F0FDF4 100%)",
                  }}
                >
                  <p className="text-4xl font-bold text-green-700">12</p>
                  <p className="text-gray-600 text-sm mt-1">Passed</p>
                </div>

                <div
                  className="rounded-xl py-8 text-center shadow-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(245, 158, 11, 0.5) 0%, #FFF7ED 100%)",
                  }}
                >
                  <p className="text-4xl font-bold text-orange-500">100%</p>
                  <p className="text-gray-600 text-sm mt-1">Pass Rate</p>
                </div>
              </div>

              {/* CURRENT LEVEL */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    <Medal className="w-5 h-5 text-purple-600" />
                    Current Level
                  </p>

                  <p className="text-orange-500 text-sm mt-1">
                    Congratulations! You've reached the highest level
                  </p>
                </div>

                <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium w-fit">
                  L4 - Advanced
                </span>
              </div>
            </div>
          </div>

          {/* PROGRESS */}
          {/* OVERALL PROGRESS */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
            <h2 className="flex items-center gap-2 font-semibold text-lg mb-4">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Overall Progress
            </h2>

            {/* Progress Label */}
            <div className="flex justify-between text-sm mb-2">
              <p className="text-gray-700">Exam Completion</p>
              <p className="text-purple-600 font-semibold">{examCompletionPercent}%</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-purple-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-700" style={{ width: `${examCompletionPercent}%` }} />
            </div>

            <div className="border-t my-4"></div>

            {/* Stats */}
            <div className="flex justify-between text-center">
              <div>
                <p className="text-3xl font-bold text-green-500">{completedExams}</p>
                <p className="text-gray-500 text-sm">Completed</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-orange-500">{pendingExams}</p>
                <p className="text-gray-500 text-sm">Pending</p>
              </div>
            </div>
          </div>
          {/* TECHNICAL COURSE */}
          {course === "Technical" && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Technical Course</h2>
                <p className="text-gray-500 text-sm">6 / 10 exams</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden mb-5">
                <div className="h-full bg-purple-700 w-[60%]" />
              </div>

              {/* Subjects */}
              <div className="space-y-3">
                {/* ITEM */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <CheckCircle className="text-green-500 w-5 h-5" />
                  <div>
                    <p className="font-medium text-gray-800">
                      Data Structures & Algorithms
                    </p>
                    <p className="text-green-600 text-sm">Score: 69%</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <CheckCircle className="text-green-500 w-5 h-5" />
                  <div>
                    <p className="font-medium text-gray-800">
                      Object-Oriented Programming
                    </p>
                    <p className="text-green-600 text-sm">Score: 67%</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <CheckCircle className="text-green-500 w-5 h-5" />
                  <div>
                    <p className="font-medium text-gray-800">
                      Database Management Systems
                    </p>
                    <p className="text-green-600 text-sm">Score: 79%</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-5">
                <button
                  onClick={() => {
                    navigate("/technical");
                    window.scrollTo(0, 0);
                  }}
                  className="text-purple-600 font-medium hover:underline"
                >
                  View All Exams →
                </button>
              </div>
            </div>
          )}
          {/* NON-TECHNICAL COURSE */}
          {course === "Non-Technical" && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Non-Technical Course</h2>
                <p className="text-gray-500 text-sm">6 / 10 exams</p>
              </div>

              {/* PROGRESS BAR */}
              <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden mb-5">
                <div className="h-full bg-purple-700 w-[60%]" />
              </div>

              {/* SUBJECT LIST */}
              <div className="space-y-4">
                {/* ITEM */}
                <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-4">
                  <CheckCircle className="text-green-500 w-5 h-5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Communication Skills
                    </p>
                    <p className="text-green-600 text-sm">Score: 74%</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-4">
                  <CheckCircle className="text-green-500 w-5 h-5" />
                  <div>
                    <p className="font-medium text-gray-900">Logical Reasoning</p>
                    <p className="text-green-600 text-sm">Score: 73%</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-4">
                  <CheckCircle className="text-green-500 w-5 h-5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Quantitative Aptitude
                    </p>
                    <p className="text-green-600 text-sm">Score: 84%</p>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="text-center mt-6">
                <button
                  onClick={() => {
                    navigate("/non-technical");
                    window.scrollTo(0, 0);
                  }}
                  className="text-purple-600 font-medium hover:underline"
                >
                  View All Exams →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* FILTERS */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div
              className="text-black p-4"
              style={{
                background:
                  "linear-gradient(90deg, rgba(124, 58, 237, 0.5) 0%, #FAF5FF 50%, #F5F3FF 100%)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    opacity: 1,
                    borderRadius: "12px",
                    background:
                      "linear-gradient(180deg, #7C3AED 0%, #6D28D9 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "6px",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={FilterIcon}
                    alt="Filters Icon"
                    style={{
                      width: "20px",
                      height: "20px",
                      opacity: 1,
                    }}
                  />
                </div>
                <div>
                  <h2 className="font-semibold">Filters</h2>
                  <p
                    className="text-sm opacity-80"
                    style={{ color: "#6B7280" }}
                  >
                    Customize stats view
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-6">
              {/* COURSE TYPE */}
              <div>
                <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  Course Type
                </p>

                <div className="space-y-3">
                  {["All Courses", "Technical", "Non-Technical"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setCourse(item)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition
          ${course === item
                          ? "bg-purple-600 text-white shadow-md border-purple-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${course === item ? "bg-white" : "bg-purple-500"
                            }`}
                        ></span>
                        {item}
                      </div>

                      {course === item && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* DIVIDER */}
              <div className="border-t"></div>

              {/* PURCHASED PLANS DROPDOWN */}
              <div>
                <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  Purchased Plans
                </p>

                <div className="relative">
                  <select
                    value={subscription?.subscription_id || ""}
                    onChange={(e) => {
                      const selected = allSubscriptions.find(sub => String(sub.subscription_id) === e.target.value);
                      if (selected) {
                        setSubscription(selected);
                        localStorage.setItem("selectedPlanId", String(selected.subscription_id));
                        if (selected.coding_total > 0) {
                          setCourse("Technical");
                          localStorage.setItem("registeredCourse", "Technical");
                        } else if (selected.mcq_total > 0) {
                          setCourse(localStorage.getItem("registeredCourse") || "Non-Technical");
                        }
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none shadow-sm"
                  >
                    {allSubscriptions.length === 0 && (
                      <option value="">No active plans</option>
                    )}
                    {allSubscriptions.map((sub, idx) => (
                      <option key={sub.subscription_id || idx} value={sub.subscription_id}>
                        {sub.plan_name || "Unnamed Plan"} - {sub.plan_type || "Unknown Type"}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* SELECTED COURSES */}
              <div className="mt-3 text-sm font-medium text-gray-700">
                Selected Courses:{" "}
                {subscription?.selected_courses && subscription.selected_courses.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {subscription.selected_courses.map((c: any, index: number) => (
                      <span key={index} className="text-purple-700 bg-purple-100 px-3 py-1 rounded-full text-xs">
                        {c.course_name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 italic font-normal ml-1">Not selected</span>
                )}
              </div>

              {/* APPLY BUTTON */}
              {(() => {
                const planType = subscription?.plan_type?.toLowerCase() || "";
                const selectedCount = subscription?.selected_courses?.length || 0;
                const isMaxReached = 
                  (planType === "single" && selectedCount >= 1) ||
                  (planType === "dual" && selectedCount >= 2) ||
                  (planType === "triple" && selectedCount >= 3);

                return (
                  <button 
                    disabled={isMaxReached}
                    onClick={() => {
                      if (!isMaxReached) {
                        navigate("/performance", { state: { subscription_id: subscription?.subscription_id } });
                        window.scrollTo(0, 0);
                      }
                    }}
                    className={`w-full py-3 rounded-xl shadow-md transition ${
                      isMaxReached 
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                        : "bg-purple-700 text-white hover:opacity-90"
                    }`}
                  >
                    Select Courses
                  </button>
                );
              })()}
            </div>
          </div>

          {/* QUICK LINKS */}
          {/* QUICK LINKS */}
          <div className="bg-white rounded-2xl shadow-xl border border-purple-200 overflow-hidden">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-purple-200 to-purple-100 px-5 py-4 flex items-center gap-2">
              <Link className="text-purple-700 w-5 h-5" />
              <h2 className="font-semibold text-purple-800">Quick Links</h2>
            </div>

            {/* LIST */}
            <div className="p-4 space-y-3">
              {/* ITEM */}
              <div
                className="flex items-center justify-between bg-gray-50 border rounded-xl px-4 py-3 hover:bg-purple-50 transition cursor-pointer"
                onClick={() => {
                  const targetCourseId = course === "Technical" ? "1" : course === "Non-Technical" ? "2" : "1";
                  localStorage.setItem("selectedCourseId", targetCourseId);
                  navigate(`/individualterms/${targetCourseId}`);
                  window.scrollTo(0, 0);
                }}
              >
                <div className="flex items-center gap-3">
                  <PlayCircle className="text-purple-600 w-5 h-5" />
                  <p className="font-medium text-gray-800">Start Exam</p>
                </div>
                <ChevronRight className="text-purple-500 w-5 h-5" />
              </div>

              <div
                className="flex items-center justify-between bg-gray-50 border rounded-xl px-4 py-3 hover:bg-purple-50 transition cursor-pointer"
                onClick={() => {
                  navigate("/performance");
                  window.scrollTo(0, 0);
                }}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="text-purple-600 w-5 h-5" />
                  <p className="font-medium text-gray-800">Course selection</p>
                </div>
                <ChevronRight className="text-purple-500 w-5 h-5" />
              </div>

              <div
                className="flex items-center justify-between bg-gray-50 border rounded-xl px-4 py-3 hover:bg-purple-50 transition cursor-pointer"
                onClick={() => {
                  navigate("/student-results");
                  window.scrollTo(0, 0);
                }}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="text-purple-600 w-5 h-5" />
                  <p className="font-medium text-gray-800">Results</p>
                </div>
                <ChevronRight className="text-purple-500 w-5 h-5" />
              </div>

              <div
                className="flex items-center justify-between bg-gray-50 border rounded-xl px-4 py-3 hover:bg-purple-50 transition cursor-pointer"
                onClick={() => {
                  navigate("/certificate");
                  window.scrollTo(0, 0);
                }}
              >
                <div className="flex items-center gap-3">
                  <Award className="text-purple-600 w-5 h-5" />
                  <p className="font-medium text-gray-800">Certificates</p>
                </div>
                <ChevronRight className="text-purple-500 w-5 h-5" />
              </div>

              <div
                className="flex items-center justify-between bg-gray-50 border rounded-xl px-4 py-3 hover:bg-purple-50 transition cursor-pointer"
                onClick={() => {
                  navigate("/payments");
                  window.scrollTo(0, 0);
                }}
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-purple-600 w-5 h-5" />
                  <p className="font-medium text-gray-800">Payments</p>
                </div>
                <ChevronRight className="text-purple-500 w-5 h-5" />
              </div>
            </div>
          </div>

          {/* SUBSCRIPTION */}
          {/* ACTIVE SUBSCRIPTION */}
          <div className="bg-white rounded-2xl shadow-xl border border-purple-200 overflow-hidden">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-purple-200 to-purple-100 px-5 py-4 flex items-center gap-2">
              <CreditCard className="text-purple-700 w-5 h-5" />
              <h2 className="font-semibold text-purple-800">
                Active Subscription
              </h2>
            </div>

            {/* CONTENT */}
            <div className="p-5 space-y-4 text-gray-700">
              {subscription ? (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Plan</p>
                    <p className="font-semibold text-gray-900">{subscription.plan_name || subscription.plan_type || "Course Plan"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Courses</p>
                    <p className="font-medium text-gray-800">
                      {course}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Validity</p>
                    <p className={`font-semibold ${daysRemaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {daysRemaining} days remaining
                    </p>
                    <p className="text-sm text-gray-500">Expires: {subscription.end_at ? new Date(subscription.end_at).toLocaleDateString() : 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-semibold flex items-center gap-2 ${subscription.status === 'active' || subscription.status === 'Success' ? 'text-green-600' : 'text-yellow-600'}`}>
                      <span className={`w-2 h-2 rounded-full ${subscription.status === 'active' || subscription.status === 'Success' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                      {subscription.status ? subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1) : 'Active'}
                    </p>
                  </div>

                  {/* BUTTON */}
                  <button className="w-full mt-3 border rounded-xl py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                    <FileText className="w-4 h-4" />
                    Download Invoice
                  </button>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-2">No active subscription found</p>
                  <button onClick={() => navigate("/certificate")} className="text-purple-600 font-medium hover:underline text-sm">
                    Upgrade Plan
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* UPGRADE */}
          {/* UPGRADE CARD */}
          <div
            className="rounded-2xl p-6 shadow-xl text-center border border-yellow-400"
            style={{
              background:
                "linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, #FEF9C2 100%)",
            }}
          >
            {/* ICON */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-yellow-500 flex items-center justify-center shadow-md">
              <Award className="text-white w-6 h-6" />
            </div>

            {/* TITLE */}
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Unlock Advanced
            </h3>

            {/* DESCRIPTION */}
            <p className="text-gray-500 text-sm mb-5">
              Get access to L4 Advanced certification
              <br />
              and premium exams
            </p>

            {/* BUTTON */}
            <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold py-3 rounded-xl shadow hover:opacity-90 transition">
              Upgrade Now
            </button>
          </div>
          {/* RECENT ACTIVITY */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            {/* TITLE */}
            <h2 className="text-lg font-semibold mb-5">Recent Activity</h2>

            {/* LIST */}
            <div className="space-y-4">
              {/* ITEM */}
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 mt-2 bg-green-500 rounded-full"></span>
                <div>
                  <p className="font-medium text-gray-800">
                    Data Structures & Algorithms
                  </p>
                  <p className="text-sm text-gray-500">
                    Completed - Score: 69%
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 mt-2 bg-green-500 rounded-full"></span>
                <div>
                  <p className="font-medium text-gray-800">
                    Object-Oriented Programming
                  </p>
                  <p className="text-sm text-gray-500">
                    Completed - Score: 67%
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 mt-2 bg-green-500 rounded-full"></span>
                <div>
                  <p className="font-medium text-gray-800">
                    Database Management Systems
                  </p>
                  <p className="text-sm text-gray-500">
                    Completed - Score: 79%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
