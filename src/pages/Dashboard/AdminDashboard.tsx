import React, { useEffect, useState, useRef } from "react";
import { Download, Filter, Users, FileText, CheckCircle2, DollarSign, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "@/pages/Services/api/api";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import FilterModal from "../../components/filtermodal";
import CourseDistribution from "./CourseDistribution";
import ExamParticipation from "./ExamParticipation";
import { DashboardResponse } from "./AdminDashboardComponents/types";
import { Card } from "./AdminDashboardComponents/SharedUI";
import { StatCardsGrid } from "./AdminDashboardComponents/StatCardsGrid";
import { PerformanceOverview } from "./AdminDashboardComponents/PerformanceOverview";
import { StudentPerformanceMetrics } from "./AdminDashboardComponents/StudentPerformanceMetrics";
import { RecentActivityOverview } from "./AdminDashboardComponents/RecentActivityOverview";

const validateDashboardResponse = (data: any): data is DashboardResponse => {
  return (
    data &&
    Array.isArray(data.stats) &&
    Array.isArray(data.registrations) &&
    Array.isArray(data.examActivity) &&
    Array.isArray(data.upcomingExams)
  );
};

const mockDashboardApi = async (): Promise<DashboardResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: [
          {
            title: "Total Registered students",
            value: "2,847",
            change: "12% from last month",
            positive: true,
            icon: Users,
            color: "from-[#615FFF] to-[#9810FA]",
          },
          {
            title: "Active " + "Examinations",
            value: "24",
            change: "3 new this week",
            positive: true,
            icon: FileText,
            color: "from-[#2B7FFF] to-[#4F39F6]",
          },
          {
            title: "Exams Completed Today",
            value: "156",
            change: "8% from yesterday",
            positive: true,
            icon: CheckCircle2,
            color: "from-[#00C950] to-[#009966]",
          },
          {
            title: "Total Revenue",
            value: "$45,280",
            change: "15% from last month",
            positive: true,
            icon: DollarSign,
            color: "from-[#AD46FF] to-[#E60076]",
          },
        ],
        registrations: [
          {
            id: 1,
            name: "Sarah Johnson",
            course: "Computer Science",
            date: "12/03",
            initials: "SJ",
          },
          {
            id: 2,
            name: "Michael Chen",
            course: "Data Science",
            date: "11/03",
            initials: "MC",
          },
          {
            id: 3,
            name: "Emily Rodriguez",
            course: "Software Engineering",
            date: "11/03",
            initials: "ER",
          },
          {
            id: 4,
            name: "James Wilson",
            course: "Information Technology",
            date: "10/03",
            initials: "JW",
          },
          {
            id: 5,
            name: "Olivia Brown",
            course: "Computer Science",
            date: "10/03",
            initials: "OB",
          },
        ],
        examActivity: [
          {
            id: 1,
            title: "Data Structures Final",
            enrolled: 45,
            completed: 42,
            avg: "88%",
          },
          {
            id: 2,
            title: "Python Programming Quiz",
            enrolled: 67,
            completed: 65,
            avg: "92%",
          },
          {
            id: 3,
            title: "Database Management",
            enrolled: 38,
            completed: 35,
            avg: "85%",
          },
          {
            id: 4,
            title: "Web Development",
            enrolled: 52,
            completed: 50,
            avg: "90%",
          },
        ],
        upcomingExams: [
          {
            id: 1,
            title: "Advanced Algorithms",
            date: "2026-03-15",
            time: "10:00 AM",
            students: 56,
            status: "Scheduled",
          },
          {
            id: 2,
            title: "Machine Learning Basics",
            date: "2026-03-17",
            time: "2:00 PM",
            students: 42,
            status: "Scheduled",
          },
          {
            id: 3,
            title: "Cloud Computing",
            date: "2026-03-20",
            time: "11:00 AM",
            students: 38,
            status: "Scheduled",
          },
        ],
      });
    }, 700);
  });
};



export default function AdminDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [dateFilter, setDateFilter] = useState("Today");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleDateFilterChange = (filterType: string, value: string) => {
    if (filterType === "date") {
      setDateFilter(value);
      toast.success(`Dashboard data filtered by: ${value}`);
    }
  };

  const handleExportReport = async () => {
    if (!dashboardRef.current) return;
    toast.info("Generating PDF report, please wait...");
    
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f5f3ff",
        logging: false
      });
      
      const imgData = canvas.toDataURL("image/png");
      
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Create a PDF with custom dimensions to perfectly fit the entire dashboard on one continuous page
      const pdf = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
      pdf.save("Admin_Dashboard_Report.pdf");
      toast.success("Report exported successfully!");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to export report. Please try again.");
    }
  };

  const performanceData = [
    { month: "Sep", avgScore: 72, passRate: 78 },
    { month: "Oct", avgScore: 75, passRate: 81 },
    { month: "Nov", avgScore: 73, passRate: 79 },
    { month: "Dec", avgScore: 78, passRate: 85 },
    { month: "Jan", avgScore: 80, passRate: 88 },
    { month: "Feb", avgScore: 82, passRate: 90 },
    { month: "Mar", avgScore: 81, passRate: 87 },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await mockDashboardApi();

        if (!validateDashboardResponse(response)) {
          throw new Error("Invalid dashboard response");
        }
        
        const newApiErrors: string[] = [];
        
        const filterQuery = `?time_filter=${encodeURIComponent(dateFilter)}`;

        // Fetch completed exams count
        try {
          const adminToken = localStorage.getItem('adminToken');
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          if (adminToken) {
            headers['Authorization'] = `Bearer ${adminToken}`;
          }

          const countRes = await fetch(`${API_BASE_URL}/ind/coding/admin/today/completed-count${filterQuery}`, {
            headers,
          });

          if (countRes.ok) {
            const countData = await countRes.json();

            // Log to see the structure if needed
            // console.log("Completed exams API response:", countData);

            // Extract the actual count value from the response
            let finalCount = "0";
            if (typeof countData === "number" || typeof countData === "string") {
              finalCount = String(countData);
            } else if (countData && typeof countData === "object") {
              finalCount = String(countData.count ?? countData.completed_count ?? countData.total ?? "0");
            }

            const completedCardIndex = response.stats.findIndex(s => s.title === "Exams Completed Today");
            if (completedCardIndex !== -1) {
              response.stats[completedCardIndex].value = finalCount;
            }
          }
        } catch (e) {
          console.error("Error fetching completed exams count:", e);
        }

        // Fetch registered students count and recent registrations
        try {
          const adminToken = localStorage.getItem('adminToken');
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          if (adminToken) {
            headers['Authorization'] = `Bearer ${adminToken}`;
          }

          const studentsRes = await fetch(`${API_BASE_URL}/student/students${filterQuery}`, {
            headers,
          });

          if (studentsRes.ok) {
            const studentsData = await studentsRes.json();

            // Extract registered students count
            let studentCount = "0";
            if (studentsData && typeof studentsData.count === "number") {
              studentCount = String(studentsData.count);
            } else if (studentsData && Array.isArray(studentsData.students)) {
              studentCount = String(studentsData.students.length);
            }

            const registeredCardIndex = response.stats.findIndex(s => s.title === "Total Registered students");
            if (registeredCardIndex !== -1) {
              response.stats[registeredCardIndex].value = studentCount;
            }

            // Extract recent registrations (up to 5)
            if (studentsData && Array.isArray(studentsData.students)) {
              // Helper to calculate initials
              const getInitials = (name: string) => {
                const parts = name.trim().split(/\s+/);
                if (parts.length === 0 || !parts[0]) return "?";
                if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
                return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
              };

              // Helper to format date (e.g. "2026-06-23T07:43:31" -> "23/06")
              const formatDate = (dateStr: string) => {
                try {
                  const d = new Date(dateStr);
                  if (isNaN(d.getTime())) return "";
                  const day = String(d.getDate()).padStart(2, '0');
                  const month = String(d.getMonth() + 1).padStart(2, '0');
                  return `${day}/${month}`;
                } catch {
                  return "";
                }
              };

              // Sort by registered_date descending to get the most recent registrations
              const sortedStudents = [...studentsData.students].sort((a, b) => {
                const dateA = new Date(a.registered_date || 0).getTime();
                const dateB = new Date(b.registered_date || 0).getTime();
                return dateB - dateA;
              });

              const recentRegistrations = sortedStudents.slice(0, 5).map((student: any) => ({
                id: student.id,
                name: student.full_name || "Unknown Student",
                course: student.college_name || "N/A",
                date: formatDate(student.registered_date) || "N/A",
                initials: getInitials(student.full_name || "Unknown"),
              }));

              response.registrations = recentRegistrations;
            }
          } else {
            newApiErrors.push(`Students API failed: ${studentsRes.status}`);
          }
        } catch (e: any) {
          newApiErrors.push(`Students fetch error: ${e.message}`);
        }

        // Fetch recent exam activity
        try {
          const adminToken = localStorage.getItem('adminToken');
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          if (adminToken) {
            headers['Authorization'] = `Bearer ${adminToken}`;
          }

          const examResultsRes = await fetch(`${API_BASE_URL}/student/scorecard/admin/exam-results${filterQuery}&limit=200`, {
            headers,
          });

          if (examResultsRes.ok) {
            const resultsData = await examResultsRes.json();
            
            if (resultsData && Array.isArray(resultsData.items)) {
              // Group by course_name + exam_kind
              const examStats = new Map<string, { title: string, completed: number, totalPercentage: number }>();
              
              for (const item of resultsData.items) {
                const courseName = item.course_name || "Unknown Course";
                const kind = item.exam_kind ? item.exam_kind.toUpperCase() : "EXAM";
                const key = `${courseName} (${kind})`;
                
                if (!examStats.has(key)) {
                  examStats.set(key, {
                    title: key,
                    completed: 0,
                    totalPercentage: 0,
                  });
                }
                const stats = examStats.get(key)!;
                stats.completed += 1;
                stats.totalPercentage += (item.percentage || 0);
              }

              const recentActivity = Array.from(examStats.values())
                .sort((a, b) => b.completed - a.completed) // sort by most active
                .slice(0, 3) // show top 3
                .map((stats, idx) => ({
                  id: idx + 1,
                  title: stats.title,
                  enrolled: stats.completed, // We don't have enrolled data, so mock it as completed
                  completed: stats.completed,
                  avg: `${Math.round(stats.totalPercentage / stats.completed)}%`,
                }));

              if (recentActivity.length > 0) {
                response.examActivity = recentActivity;
              }
            }
          } else {
            newApiErrors.push(`Exam Results API failed: ${examResultsRes.status}`);
          }
        } catch (e: any) {
          newApiErrors.push(`Exam Results fetch error: ${e.message}`);
        }

        // Fetch active examinations count (mapped exams summary)
        try {
          const adminToken = localStorage.getItem('adminToken');
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          if (adminToken) {
            headers['Authorization'] = `Bearer ${adminToken}`;
          }

          const mappedExamsRes = await fetch(`${API_BASE_URL}/ind/coding/admin/mapped-exams/summary${filterQuery}`, {
            headers,
          });

          if (mappedExamsRes.ok) {
            const mappedExamsData = await mappedExamsRes.json();

            const activeCardIndex = response.stats.findIndex(s => s.title === "Active Examinations");
            if (activeCardIndex !== -1) {
              const total = mappedExamsData.total_mapped_exams ?? 0;
              const mcq = mappedExamsData.total_mcq_mapped_exams ?? 0;
              const coding = mappedExamsData.total_coding_mapped_exams ?? 0;

              response.stats[activeCardIndex].value = String(total);
              response.stats[activeCardIndex].change = "Total Active";
              response.stats[activeCardIndex].extraStats = [
                { label: "MCQ", value: String(mcq) },
                { label: "Coding", value: String(coding) }
              ];
            }
          } else {
            const errText = await mappedExamsRes.text();
            newApiErrors.push(`Mapped Exams API failed: ${mappedExamsRes.status} ${errText}`);
            console.error("Mapped Exams API failed:", mappedExamsRes.status, errText);
          }
        } catch (e: any) {
          newApiErrors.push(`Mapped Exams fetch error: ${e.message}`);
          console.error("Error fetching mapped exams summary:", e);
        }

        // Fetch subscriptions data for Total Revenue
        try {
          const adminToken = localStorage.getItem('adminToken');
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          if (adminToken) {
            headers['Authorization'] = `Bearer ${adminToken}`;
          }

          const subsRes = await fetch(`${API_BASE_URL}/student/admin/subscriptions${filterQuery}`, {
            headers,
          });

          if (subsRes.ok) {
            const subsData = await subsRes.json();
            const revenueCardIndex = response.stats.findIndex(s => s.title === "Total Revenue");
            if (revenueCardIndex !== -1 && subsData.summary && subsData.summary.total_revenue !== undefined) {
              const formattedRevenue = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(subsData.summary.total_revenue);

              response.stats[revenueCardIndex].value = formattedRevenue;
            }
          } else {
            const errText = await subsRes.text();
            newApiErrors.push(`Subscriptions API failed: ${subsRes.status} ${errText}`);
            console.error("Subscriptions API failed:", subsRes.status, errText);
          }
        } catch (e: any) {
          newApiErrors.push(`Subscriptions fetch error: ${e.message}`);
          console.error("Error fetching subscriptions for revenue:", e);
        }

        if (newApiErrors.length > 0) {
          setApiErrors(newApiErrors);
        }

        setData(response);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [dateFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3ff] p-2 sm:p-3 laptop:p-4 xl:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6d28d9] mx-auto"></div>
          <p className="mt-4 text-[#5d677a]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#f5f3ff] p-2 sm:p-3 laptop:p-4 xl:p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-8 text-center">
          <p className="text-lg font-semibold text-red-600">Error</p>
          <p className="mt-2 text-red-500">{error || "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f3ff]" ref={dashboardRef}>
      <div className="flex flex-col">
        <div className="mb-4 sm:mb-6 laptop:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[20px] sm:text-[24px] laptop:text-[28px] font-bold text-[#1c2434]">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-[13px] sm:text-[14px] laptop:text-[15px] text-[#5d677a]">
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3" data-html2canvas-ignore="true">
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-3 sm:px-4 py-2 text-[13px] sm:text-[14px] font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <Filter size={18} className="text-gray-500" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button 
              onClick={handleExportReport}
              className="flex items-center gap-2 rounded-xl bg-[#4f46e5] px-3 sm:px-4 py-2 text-[13px] sm:text-[14px] font-medium text-white hover:bg-[#4338ca] transition-all shadow-sm shadow-[#4f46e5]/30"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          </div>
        </div>

        {apiErrors.length > 0 && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
            <h3 className="flex items-center gap-2 text-red-800 font-semibold mb-2">
              <AlertCircle size={18} />
              Live Data Sync Issues
            </h3>
            <ul className="list-disc pl-5 text-sm text-red-600 space-y-1">
              {apiErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-red-500">
              Because the live fetch failed, the dashboard is currently displaying static fallback data.
            </p>
          </div>
        )}

        <div data-html2canvas-ignore="true">
          <FilterModal isOpen={showFilters} onFilterChange={handleDateFilterChange} />
        </div>
      </div>

      <StatCardsGrid stats={data.stats} />

      <PerformanceOverview performanceData={performanceData}>
        <Card className="p-4 sm:p-5 laptop:p-6 xl:p-7">
          <CourseDistribution />
        </Card>
      </PerformanceOverview>

      <div className="mt-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full">
          <ExamParticipation />
        </div>

        <StudentPerformanceMetrics />
      </div>

      <RecentActivityOverview 
        registrations={data.registrations} 
        examActivity={data.examActivity} 
      />

    </div>
  );
}
