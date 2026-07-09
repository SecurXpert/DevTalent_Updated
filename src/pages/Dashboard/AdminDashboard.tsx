import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Users,
  FileText,
  CheckCircle2,
  DollarSign,
  Award,
  TrendingUp,
  Download,
  Filter,
  Clock,
  Calendar,
} from "lucide-react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import FilterModal from "../../components/filtermodal";
import CourseDistribution from "./CourseDistribution";
import ExamParticipation from "./ExamParticipation";

type StatCard = {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
  icon: React.ElementType;
  color: string;
};

type Registration = {
  id: number;
  name: string;
  course: string;
  date: string;
  initials: string;
};

type ExamActivity = {
  id: number;
  title: string;
  enrolled: number;
  completed: number;
  avg: string;
};

type UpcomingExam = {
  id: number;
  title: string;
  date: string;
  time: string;
  students: number;
  status: string;
};

type DashboardResponse = {
  stats: StatCard[];
  registrations: Registration[];
  examActivity: ExamActivity[];
  upcomingExams: UpcomingExam[];
};

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

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border-2 border-gray-200 bg-white  ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
      <div>
        <h2 className="text-[14px] sm:text-[15px] laptop:text-[17px] font-bold text-[#1c2434]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-[11px] sm:text-[12px] laptop:text-[12px] text-[#5d677a]">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

function MiniProgress({
  label,
  students,
  percent,
  color,
  width,
}: {
  label: string;
  students: string;
  percent: string;
  color: string;
  width: string;
}) {
  return (
    <div className="mb-3 sm:mb-4 laptop:mb-5">
      <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
        <span className="text-[12px] sm:text-[14px] laptop:text-[16px] font-medium text-[10px]">
          {label}
        </span>
        <div className="text-right">
          <span className="mr-2 text-[11px] sm:text-[13px] laptop:text-[15px] text-[12px]">
            {students}
          </span>
          <span className="text-[12px] sm:text-[14px] laptop:text-[16px] font-semibold text-[#1c2434]">
            {percent}
          </span>
        </div>
      </div>
      <div className="h-2 sm:h-3 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
        <div className={`h-full rounded-full ${color} ${width}`}></div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(true);

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

        // Fetch completed exams count
        try {
          const adminToken = localStorage.getItem('adminToken');
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          if (adminToken) {
            headers['Authorization'] = `Bearer ${adminToken}`;
          }

          const countRes = await fetch('http://192.168.0.103:8000/ind/coding/admin/today/completed-count', {
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

        setData(response);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

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
    <div className="bg-[#f5f3ff]">
      <div className="flex flex-col">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="font-semibold leading-tight text-[#182033] text-[29px]">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-[10px] sm:text-[11px] laptop:text-[13px] xl:text-[14px] text-[#5d677a]">
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex h-[30px] items-center gap-1 border-2 border-gray-100 rounded-[9px] bg-white px-2 text-[11px] font-medium text-black shadow sm:h-[32px] sm:px-3"
            >
              <Filter size={15} />
              Filters
            </button>

            <button className="flex h-[30px] items-center gap-2 rounded-[8px] bg-gradient-to-r from-[#6d28d9] to-[#9333ea] px-1 text-[11px] font-medium text-white shadow-[0_8px_20px_rgba(124,58,237,0.28)] sm:h-[30px] sm:px-2">
              <Download size={15} />
              Export Report
            </button>
          </div>
        </div>

        <FilterModal isOpen={showFilters} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-3 laptop:gap-3 xl:gap-4 mt-5 laptop:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="p-1 sm:p-3 laptop:p-3 xl:p-2">
              <div className="flex items-start justify-between gap-1 sm:gap-2 laptop:gap-1 xl:gap-4">
                <div className="flex-1 min-w-0">
                  <p className=" py-1 p-2 max-w-[100px] sm:max-w-[150px] laptop:max-w-[150px] xl:max-w-[170px] font-Inter-medium leading-[1.35] text-[14px]">
                    {item.title}
                  </p>
                  <h3 className=" p-1 mt-1 sm:mt-3 laptop:mt-1 text-[10px] sm:text-[15px] laptop:text-[18px] gap-1 xl:text-[20px] font-bold leading-none text-[#172033]">
                    {item.value}
                  </h3>
                  <p className="mt-2 sm:mt-3 laptop:mt-4 text-[16px] sm:text-[11px] laptop:text-[15px] gap-1 xl:text-[11px] font-medium text-[#09a64b] flex items-end">
                    <TrendingUp size={20} /> {item.change}
                  </p>
                </div>

                <div
                  className={`flex h-[24px] w-[24px] sm:h-[24px] sm:w-[28px] laptop:h-[40px] laptop:w-[40px] xl:h-[52px] xl:w-[52px] items-center justify-center rounded-lg sm:rounded-xl laptop:rounded-xl xl:rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg flex-shrink-0`}
                >
                  <Icon size={20} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-3 sm:mt-4 laptop:mt-5 grid grid-cols-2 gap-3 sm:gap-4 laptop:grid-cols-2 xl:grid-cols-4">
        <Card className="p-1 sm:p-2 laptop:p-3 xl:p-4">
          <div className="mb-1 sm:mb-2 laptop:mb-3 flex items-center justify-between">
            <div
              className="flex h-6 w-6 sm:h-8 sm:w-8 laptop:h-10 laptop:w-10 items-center justify-center rounded-lg sm:rounded-xl laptop:rounded-xl text-white shadow-md"
              style={{
                background: "linear-gradient(135deg, #00C950 0%, #009966 100%)",
              }}
            >
              <Award size={20} />
            </div>
            <span className="text-[10px] sm:text-[11px] laptop:text-[13px] font-semibold text-[#09a64b] flex items-center gap-1">
              <TrendingUp size={12} /> 2.3%
            </span>
          </div>
          <p className="font-Inter-regular text-[12px] sm:text-[10px] laptop:text-[14px] text-[12px]">
            Pass Rate
          </p>
          <h3 className="mt-1 text-[12px] sm:text-[14px] laptop:text-[10px] xl:text-[18px] font-bold text-[#172033]">
            87.5%
          </h3>
        </Card>

        <Card className="p-1 sm:p-2 laptop:p-3 xl:p-4">
          <div className="mb-1 sm:mb-2 laptop:mb-3 flex items-center justify-between">
            <div
              className="flex h-6 w-6 sm:h-8 sm:w-8 laptop:h-10 laptop:w-10 items-center justify-center rounded-lg sm:rounded-xl laptop:rounded-xl text-white shadow-md"
              style={{
                background: "linear-gradient(135deg, #615FFF 0%, #9810FA 100%)",
              }}
            >
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] sm:text-[11px] laptop:text-[13px] font-semibold text-[#4f46e5] flex items-center gap-1">
              <TrendingUp size={12} /> 1.8%
            </span>
          </div>
          <p className="  font-Inter-regular text-[12px] sm:text-[10px] laptop:text-[14px] text-[12px]">
            Avg. Score
          </p>
          <h3 className="mt-1 text-[12px] sm:text-[14px] laptop:text-[10px] xl:text-[18px] font-bold text-[#172033]">
            81.2%
          </h3>
        </Card>

        <Card className="p-1 sm:p-2 laptop:p-3 xl:p-4">
          <div className="mb-1 sm:mb-2 laptop:mb-3 flex items-center justify-between">
            <div
              className="flex h-6 w-6 sm:h-8 sm:w-8 laptop:h-10 laptop:w-10 items-center justify-center rounded-lg sm:rounded-xl laptop:rounded-xl text-white shadow-md"
              style={{
                background: "linear-gradient(135deg, #2B7FFF 0%, #0092B8 100%)",
              }}
            >
              <Users size={20} />
            </div>
            <span className="text-[10px] sm:text-[11px] laptop:text-[13px] font-semibold text-[#2563eb] flex items-center gap-1">
              <TrendingUp size={12} /> 3.1%
            </span>
          </div>
          <p className="font-Inter-regular text-[12px] sm:text-[10px] laptop:text-[14px] text-[12px]">
            Participation
          </p>
          <h3 className="mt-1 text-[12px] sm:text-[14px] laptop:text-[10px] xl:text-[18px] font-bold text-[#172033]">
            92.3%
          </h3>
        </Card>

        <Card className="p-1 sm:p-2 laptop:p-3 xl:p-4">
          <div className="mb-1 sm:mb-2 laptop:mb-3 flex items-center justify-between">
            <div
              className="flex h-6 w-6 sm:h-8 sm:w-8 laptop:h-10 laptop:w-10 items-center justify-center rounded-lg sm:rounded-xl laptop:rounded-xl text-white shadow-md"
              style={{
                background: "linear-gradient(135deg, #AD46FF 0%, #E60076 100%)",
              }}
            >
              <IoMdCheckmarkCircleOutline size={20} />
            </div>
            <span className="text-[10px] sm:text-[11px] laptop:text-[13px] font-semibold text-[#a21caf] flex items-center gap-1">
              <TrendingUp size={12} /> 0.9%
            </span>
          </div>
          <p className="font-Inter-regular text-[12px] sm:text-[10px] laptop:text-[14px] text-[12px]">
            Completion Rate
          </p>
          <h3 className="mt-1 text-[12px] sm:text-[14px] laptop:text-[10px] xl:text-[18px] font-bold text-[#172033]">
            94.8%
          </h3>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 laptop:grid-cols-2 xl:grid-cols-[2fr_1fr]">
        <Card className="p-2 sm:p-5 laptop:p-2 xl:p-6">
          <SectionTitle
            title="Student Registrations & Performance "
            subtitle="Monthly trends with pass rate overlay"
            action={
              <TrendingUp
                className="text-xl font-bold text-[#12b553]"
                size={20}
              />
            }
          />

          <div className="w-full h-[250px] sm:h-[300px] laptop:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px" }}
                />

                {/* Avg Score */}
                <Area
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="url(#colorScore)"
                  name="Avg Score"
                />

                {/* Pass Rate */}
                <Area
                  type="monotone"
                  dataKey="passRate"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorPass)"
                  name="Pass Rate"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 sm:mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-[14px] sm:text-[16px]">
            <div className="flex items-center gap-2 text-[#4f46e5]">
              {/* <span className="h-[3px] w-5 rounded-full bg-[#4f46e5]"></span> */}
              {/* Avg Score */}
            </div>
            <div className="flex items-center gap-2 text-[#10b981]">
              {/* <span className="h-[3px] w-5 rounded-full bg-[#10b981]"></span> */}
              {/* Pass Rate */}
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 laptop:p-6 xl:p-7">
          <CourseDistribution />
        </Card>
      </div>

      <div className="mt-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full">
          <ExamParticipation />
        </div>

        <Card className="p-6 sm:p-6 laptop:p-4 xl:p-4">
          <SectionTitle
            title="Performance Distribution"
            subtitle="Students by performance level"
          />

          <div className="mt-2 sm:mt-2 laptop:mt-4 xl:mt-4">
            <MiniProgress
              label="Excellent (90-100%)"
              students="156 students"
              percent="18%"
              color="bg-[#11c14d]"
              width="w-[18%]"
            />
            <MiniProgress
              label="Good (80-89%)"
              students="342 students"
              percent="40%"
              color="bg-[#3b82f6]"
              width="w-[40%]"
            />
            <MiniProgress
              label="Average (70-79%)"
              students="268 students"
              percent="31%"
              color="bg-[#eab308]"
              width="w-[31%]"
            />
            <MiniProgress
              label="Below Average (<70%)"
              students="95 students"
              percent="11%"
              color="bg-[#ff3131]"
              width="w-[11%]"
            />
          </div>
        </Card>
      </div>

      <div className="mt-6 mb-8 grid grid-cols-1 gap-4 laptop:grid-cols-1 xl:grid-cols-[1fr_2fr]">
        <Card className="p-3 sm:p-4 laptop:p-5 xl:p-6">
          <SectionTitle
            title="Recent Registrations"
            action={
              <button className="text-[14px] sm:text-[16px] font-medium text-[#4f46e5]">
                View All
              </button>
            }
          />

          <div className="space-y-3 sm:space-y-4 laptop:space-y-6">
            {data.registrations.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-2 sm:gap-3"
              >
                <div className="flex items-center gap-2 sm:gap-3 laptop:gap-4">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 laptop:h-11 laptop:w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#9333ea] text-xs sm:text-sm font-semibold text-white shadow-md flex-shrink-0">
                    {item.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[12px] sm:text-[14px] laptop:text-[16px] font-semibold text-[#1c2434] truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] sm:text-[13px] laptop:text-[15px] text-[#6b7280] truncate">
                      {item.course}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] sm:text-[13px] laptop:text-[15px] text-[#9ca3af] flex-shrink-0">
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-3 sm:p-4 laptop:p-5 xl:p-6">
          <SectionTitle
            title="Recent Exam Activity"
            action={
              <button className="text-[14px] sm:text-[16px]  font-medium text-[#4f46e5]">
                View All
              </button>
            }
          />

          <div className="space-y-3 sm:space-y-4 laptop:space-y-5">
            {data.examActivity.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-3 sm:gap-4 rounded-[12px] sm:rounded-[18px] border border-[#e9ddfb] p-3 sm:p-4 laptop:p-5"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 laptop:h-14 laptop:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#a21caf] text-white shadow-md flex-shrink-0">
                    <FileText size={18} className="sm:size-15 laptop:size-26" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-[13px] sm:text-[15px] laptop:text-[17px] font-semibold text-[#1c2434] line-clamp-2">
                      {item.title}
                    </h4>
                    <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3 text-[12px] sm:text-[13px] laptop:text-[15px] text-[#5d677a]">
                      <span className="flex items-center gap-1">
                        <Users size={12} className="sm:size- laptop:size-15" />
                        {item.enrolled} enrolled
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <IoMdCheckmarkCircleOutline
                          size={12}
                          className="sm:size-4 laptop:size-15"
                        />
                        {item.completed} completed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4">
        <Card className="p-3 sm:p-4 laptop:p-5 xl:p-6">
          <SectionTitle
            title="Upcoming Exams"
            subtitle="Scheduled exams for this week"
            action={
              <button className="text-[14px] sm:text-[16px] font-medium text-[#4f46e5]">
                View All Schedule
              </button>
            }
          />

          <div className="grid grid-cols-1 gap-3 sm:gap-4 laptop:grid-cols-2 xl:grid-cols-3">
            {data.upcomingExams.map((exam) => (
              <div
                key={exam.id}
                className="rounded-[12px] sm:rounded-[18px] border border-[#dcdce8] p-4 sm:p-5 laptop:p-6"
              >
                <div className="mb-3 sm:mb-4 flex items-start justify-between gap-2">
                  <h4 className="text-[14px] sm:text-[16px] laptop:text-[18px] font-semibold text-[#1c2434] line-clamp-2">
                    {exam.title}
                  </h4>
                  <span className="rounded-md sm:rounded-lg bg-[#e0e7ff] px-2 py-1 sm:px-3 text-[11px] sm:text-[14px] font-medium text-[#4f46e5] flex-shrink-0">
                    {exam.status}
                  </span>
                </div>

                <div className="space-y-2 sm:space-y-3 text-[12px] sm:text-[15px] text-[#5d677a]">
                  <p className="flex items-center gap-2">
                    <Calendar
                      size={14}
                      className="sm:size-17 text-[#6366f1] flex-shrink-0"
                    />
                    <span className="truncate">{exam.date}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock
                      size={14}
                      className="sm:size-17 text-[#6366f1] flex-shrink-0"
                    />
                    <span className="truncate">{exam.time}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Users
                      size={14}
                      className="sm:size-17 text-[#6366f1] flex-shrink-0"
                    />
                    <span className="truncate">
                      {exam.students} students registered
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
