import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Devlogo from "../assests/Devlogo.png";
import { API_BASE_URL } from "@/pages/Services/api/api";
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  Award,
  CreditCard,
  FileSearch,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface StudentSidebarLayoutProps {
  children: React.ReactNode;
}

export default function StudentSidebarLayout({ children }: StudentSidebarLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [studentName, setStudentName] = useState("Rahul Sharma");
  const [subscription, setSubscription] = useState<any>(null);

  const [course] = useState(() => {
    return localStorage.getItem("registeredCourse") || "Technical";
  });

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
        if (!token) return;

        let studentId = "";
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          studentId = String(
            payload.user_id || payload.id || payload.candidate_id || payload.sub || ""
          );
        } catch (e) {
          console.error("Error decoding token for student ID", e);
        }

        const endpoint = studentId
          ? `${API_BASE_URL}/student/students/${studentId}`
          : `${API_BASE_URL}/student/students`;

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const studentData = await response.json();
          const student = Array.isArray(studentData) ? studentData[0] : studentData;
          if (student && student.full_name) {
            setStudentName(student.full_name);
          }
        }
      } catch (error) {
        console.error("Error fetching student info:", error);
      }
    };

    const fetchSubscription = async () => {
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
          let subs: any[] = [];
          if (Array.isArray(data)) {
            subs = data;
          } else if (data && Array.isArray(data.items)) {
            subs = data.items;
          } else if (data && Array.isArray(data.data)) {
            subs = data.data;
          } else if (data) {
            subs = [data];
          }

          if (subs.length > 0) {
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
          }
        }
      } catch (error) {
        console.error("Error fetching subscription in sidebar:", error);
      }
    };

    fetchStudentInfo();
    fetchSubscription();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const navItems = [
    { name: "Dashboard", path: "/studentdashboard", icon: LayoutDashboard },
    {
      name: "Start Exam",
      action: () => {
        let targetCourseId = "1";
        const currentCourse = localStorage.getItem("registeredCourse") || course;
        
        if (subscription?.selected_courses?.length > 0) {
          const matchedCourse = subscription.selected_courses.find((c: any) =>
            c.course_name?.toLowerCase().includes(currentCourse.toLowerCase())
          );
          if (matchedCourse) {
            targetCourseId = String(matchedCourse.course_id);
          } else {
            targetCourseId = String(subscription.selected_courses[0].course_id);
          }
        } else {
          targetCourseId = currentCourse === "Technical" ? "1" : "2";
        }
        
        localStorage.setItem("selectedCourseId", targetCourseId);
        handleNavigation(`/individualterms/${targetCourseId}`);
      },
      icon: ClipboardList,
    },
    { name: "Select Course", path: "/performance", icon: BookOpen }, // Typo fixed from 'Select Cource' in old code, wait, I will use "Select Course"
    { name: "Certificates", path: "/certificate", icon: Award },
    { name: "Payments", path: "/payments", icon: CreditCard },
    { name: "Results", path: "/student-results", icon: FileSearch },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-100 h-24">
          <img
            src={Devlogo}
            alt="logo"
            className="w-[72px] h-[72px] mx-auto lg:mx-0 object-contain"
          />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={20} className="text-gray-700" />
          </button>
        </div>

        <div className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto pb-6">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = item.path ? isActive(item.path) : false;
            return (
              <button
                key={index}
                onClick={item.action || (() => handleNavigation(item.path!))}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition ${
                  active
                    ? "bg-[#5B32A9] text-white shadow-md"
                    : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-white" : "text-gray-500"}`} />
                <span className="font-medium text-[15px]">{item.name}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
              window.scrollTo(0, 0);
            }}
            className="w-full flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition"
          >
            <LogOut className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-[15px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 lg:ml-64 bg-gradient-to-br from-purple-50 via-white to-purple-100 min-h-screen relative flex flex-col">
        {/* NAVBAR - only show on Dashboard. On other pages, show a mobile-only top navbar to allow menu toggling */}
        {location.pathname.toLowerCase() === "/studentdashboard" ? (
          <nav className="fixed top-0 left-0 lg:left-64 right-0 bg-white shadow-sm border-b z-40">
            <div className="flex justify-between lg:justify-end items-center px-4 sm:px-6 h-20 sm:h-24">
              <div className="flex items-center gap-3 lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <Menu size={24} />
                </button>
                <img
                  src={Devlogo}
                  alt="logo"
                  className="w-12 h-12 object-contain"
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleNavigation("/profile")}
                  className="flex items-center gap-2 font-medium text-gray-700 hover:text-purple-700 transition"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{studentName}</span>
                </button>

                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </nav>
        ) : (
          <nav className="lg:hidden sticky top-0 bg-white shadow-sm border-b z-40 h-16 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <Menu size={24} />
              </button>
              <img
                src={Devlogo}
                alt="logo"
                className="w-10 h-10 object-contain"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => handleNavigation("/profile")}
                className="flex items-center gap-2 font-medium text-gray-700 hover:text-purple-700 transition"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">{studentName}</span>
              </button>
            </div>
          </nav>
        )}

        {/* INNER CONTENT */}
        <div className={`${location.pathname.toLowerCase() === "/studentdashboard" ? "pt-24 sm:pt-24" : ""} flex-1 flex flex-col`}>
          {children}
        </div>
      </div>
    </div>
  );
}
