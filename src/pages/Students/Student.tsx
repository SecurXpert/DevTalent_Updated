import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStudents, deleteStudent, Student as ApiStudent } from "@/lib/api";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  FiUsers,
  FiTrendingUp,
  FiBookOpen,
  FiCalendar,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiEdit,
  FiTrash2,
  FiHome,
} from "react-icons/fi";

// Use API‑provided Student type for the list
type Student = ApiStudent;

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-blue-600";
  if (score >= 75) return "text-yellow-500";
  return "text-red-500";
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0] ? parts[0][0].toUpperCase() : "";
};

const avatarBgClasses = [
  "bg-[#2563eb]", // blue
  "bg-[#4f46e5]", // indigo
  "bg-[#7c3aed]", // violet
  "bg-[#059669]", // green
  "bg-[#db2777]", // pink
];

const getAvatarBg = (index: number) => {
  return avatarBgClasses[index % avatarBgClasses.length];
};

const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (e) {
    return dateStr;
  }
};

const Page: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterCourse, setFilterCourse] = useState("All Courses");
  const [filterDate, setFilterDate] = useState("All Time");
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);

  const handleExportReport = async () => {
    if (!pageRef.current) return;
    toast.info("Generating PDF report, please wait...");
    
    try {
      const canvas = await html2canvas(pageRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#F5F3FF",
        logging: false
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      const pdf = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Students_Report.pdf");
      toast.success("Report exported successfully!");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to export report. Please try again.");
    }
  };

  const filteredStudents = students.filter(s => {
    const query = searchQuery.toLowerCase();
    const nameMatch = s.full_name?.toLowerCase().includes(query) ?? false;
    const emailMatch = s.email_id?.toLowerCase().includes(query) ?? false;
    const courseMatch = s.college_name?.toLowerCase().includes(query) ?? false;
    const searchMatch = nameMatch || emailMatch || courseMatch;

    const studentStatus = s.status || "Active";
    const statusMatch = filterStatus === "All Status" || studentStatus === filterStatus;

    const collegeMatch = filterCourse === "All Courses" || s.college_name === filterCourse;

    let dateMatch = true;
    if (filterDate !== "All Time") {
      const regDate = new Date(s.registered_date);
      const today = new Date();
      regDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      const diffTime = today.getTime() - regDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (filterDate === "Today") {
        dateMatch = diffDays === 0;
      } else if (filterDate === "Last 7 Days") {
        dateMatch = diffDays <= 7 && diffDays >= 0;
      } else if (filterDate === "Last 30 Days") {
        dateMatch = diffDays <= 30 && diffDays >= 0;
      }
    }

    return searchMatch && statusMatch && collegeMatch && dateMatch;
  });

  const uniqueColleges = Array.from(new Set(students.map(s => s.college_name).filter(Boolean)));

  const totalStudents = students.length;
  const activeStudents = students.filter(s => !s.status || s.status === "Active").length;

  const stats = [
    {
      title: "Total Students",
      value: totalStudents.toString(),
      change: "12%", // Optional: Calculate dynamically if historical data exists
      icon: <FiUsers className="text-xl sm:text-xl md:text-2xl lg:text-2xl" />,
      bg: "bg-gradient-to-r from-purple-500 to-indigo-600",
    },
    {
      title: "Active Students",
      value: activeStudents.toString(),
      change: "8%", // Optional: Calculate dynamically if historical data exists
      icon: <FiBookOpen className="text-xl sm:text-xl md:text-2xl lg:text-2xl" />,
      bg: "bg-gradient-to-r from-green-500 to-emerald-600",
    },
    {
      title: "Average Score",
      value: "84%",
      change: "5%",
      icon: <FiTrendingUp className="text-xl sm:text-xl md:text-2xl lg:text-2xl" />,
      bg: "bg-gradient-to-r from-blue-500 to-cyan-600",
    },
    {
      title: "Avg Exams/Student",
      value: "10",
      change: "3%",
      icon: <FiCalendar className="text-xl sm:text-xl md:text-2xl lg:text-2xl" />,
      bg: "bg-gradient-to-r from-pink-500 to-purple-600",
    },
  ];

  // Fetch student list on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchStudents();
        setStudents(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load students", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleViewStudent = (student: ApiStudent) => {
    navigate(`/students/view/${student.id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
        setStudents((prev) => prev.filter((s) => s.id !== id));
      } catch (e) {
        console.error("Error deleting student:", e);
        alert("Failed to delete student.");
      }
    }
  };

  return (
    <div className="bg-[#F5F3FF] min-h-screen p-4 md:p-6 space-y-6 w-full max-w-full overflow-x-hidden" ref={pageRef}>
      {loading ? (
        <p className="text-center">Loading students…</p>
      ) : (
        <>
          {/* HEADER */}
          <div>
            <h1 className="text-2xl md:text-3xl font-[inter,sans-serif] text-gray-800 tracking-[1px] font-semibold">
              Students Management
            </h1>
            <p className="text-sm md:text-base text-gray-700 font-[inter,sans-serif] font-normal font-weight-400 mt-1">
              Manage all registered students on the platform
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stats.map((s, i) => {
              let changeColor = "text-indigo-600 p-2";
              if (i === 0) changeColor = "text-purple-600 font-bold";
              else if (i === 1) changeColor = "text-green-600 font-bold";
              else if (i === 2) changeColor = "text-blue-600 font-bold";
              else if (i === 3) changeColor = "text-pink-600 font-bold";

              return (
                <div
                  key={i}
                  className="bg-white border rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col justify-between shadow-lg border-[#F5F3FF] border-[2px] h-full"
                >
                  <div className="flex justify-between items-start">
                    <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white ${s.bg}`}>
                      <div className="text-sm sm:text-lg">{s.icon}</div>
                    </div>
                    <span className={`text-xs sm:text-sm ${changeColor} flex items-center gap-1 flex-shrink-0`}>
                      <FiTrendingUp size={12} className="sm:size-4" /> {" "}{s.change}
                    </span>
                  </div>
                  <div className="mt-2 sm:mt-3">
                    <p className="text-gray-600 text-xs sm:text-sm font-roboto font-weight-400 leading-tight">
                      {s.title}
                    </p>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-inter font-weight-700 leading-none mt-1">
                      {s.value}
                    </h2>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SEARCH BAR */}
          <div className="bg-white border rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between shadow-lg border-[#F5F3FF] border-[2px] h-auto" data-html2canvas-ignore="true">
            <div className="flex items-center gap-2 sm:gap-3 w-full md:flex-1 border rounded-xl px-3 py-2 sm:py-3">
              <FiSearch className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by name, email, or course..."
                className="w-full outline-none text-sm bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
              <button
                className={`flex items-center gap-2 px-3 py-2 sm:px-4 font-inter font-semibold font-weight-500 border rounded-lg text-sm w-full md:w-auto ${showFilters
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-[#F5F3FF] border border-purple-200 text-gray-700 hover:bg-purple-100"
                  }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter /> Filters
              </button>
              <button 
                onClick={handleExportReport}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 font-[inter,sans-serif] font-semibold font-weight-500 bg-[#F5F3FF] border rounded-lg text-sm w-full md:w-auto"
              >
                <FiDownload /> Export
              </button>
            </div>
          </div>
          {showFilters && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4" data-html2canvas-ignore="true">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">College/Course</h4>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                  >
                    <option>All Courses</option>
                    {uniqueColleges.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Date Range</h4>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  >
                    <option>All Time</option>
                    <option>Today</option>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          <div className="px-2 sm:p-1 text-sm sm:text-base text-gray-600 font-[inter,sans-serif] font-weight-500">
            Showing <span className="font-semibold font-[inter,sans-serif]">{filteredStudents.length}</span> of <span className="font-semibold font-[inter,sans-serif]">{students.length}</span> students
          </div>

          {/* TABLE */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Mobile View */}
            <div className="block md:hidden">
              <div className="divide-y divide-gray-200">
                {filteredStudents.map((s, i) => {
                  const studentId = typeof s.id === 'number' ? `STU${String(s.id).padStart(3, '0')}` : s.id;
                  const initials = getInitials(s.full_name);
                  const avatarBg = getAvatarBg(i);
                  const formattedDate = formatDate(s.registered_date);
                  const status = s.status || "Active";

                  return (
                    <div key={i} className="p-4 space-y-3">
                      {/* Student Info */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm text-gray-800">{s.full_name}</h4>
                            <p className="text-xs text-gray-400 truncate">{s.email_id}</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#f3e8ff] text-[#9333ea] uppercase">
                          {studentId}
                        </span>
                      </div>

                      <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-2.5 rounded-lg">
                        <div className="flex items-center gap-1.5">
                          <FiHome className="text-amber-500" size={14} />
                          <span className="truncate">{s.college_name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400">Phone:</span>
                          <span>{s.phone_number || "+91 98765 43210"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FiCalendar className="text-green-500" size={14} />
                          <span>Reg Date: {formattedDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        {status === "Active" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ecfdf5] text-[#059669]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f3f4f6] text-[#4b5563]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#9ca3af]"></span>
                            Inactive
                          </span>
                        )}
                        <div className="flex gap-4 text-gray-400">
                          <FiEye className="hover:text-indigo-600 cursor-pointer text-indigo-500" size={18} onClick={() => handleViewStudent(s)} />
                          <FiEdit className="hover:text-indigo-600 cursor-pointer text-indigo-500" size={18} onClick={() => navigate(`/students/edit/${s.id}`)} />
                          <FiTrash2 className="hover:text-red-500 cursor-pointer text-red-500" size={18} onClick={() => handleDelete(s.id)} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop & Tablet */}
            <div className="hidden md:block overflow-x-auto w-full">
              <table className="w-full min-w-[1000px] border-collapse">
                <thead className="bg-[#f9fafb] border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Email Address</th>
                    <th className="px-6 py-4">College Name</th>
                    <th className="px-6 py-4">Phone Number</th>
                    <th className="px-6 py-4">Registration Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center" data-html2canvas-ignore="true">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredStudents.map((s, i) => {
                    const studentId = typeof s.id === 'number' ? `STU${String(s.id).padStart(3, '0')}` : s.id;
                    const initials = getInitials(s.full_name);
                    const avatarBg = getAvatarBg(i);
                    const formattedDate = formatDate(s.registered_date);
                    const status = s.status || "Active";

                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        {/* ID */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#f3e8ff] text-[#9333ea] uppercase">
                            {studentId}
                          </span>
                        </td>

                        {/* Student Name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full ${avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                              {initials}
                            </div>
                            <span className="font-semibold text-gray-800 text-sm">
                              {s.full_name}
                            </span>
                          </div>
                        </td>

                        {/* Email Address */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {s.email_id}
                        </td>

                        {/* College Name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <FiHome className="text-orange-400 flex-shrink-0" size={16} />
                            <span>{s.college_name}</span>
                          </div>
                        </td>

                        {/* Phone Number */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {s.phone_number || "+91 98765 43210"}
                        </td>

                        {/* Registration Date */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FiCalendar className="text-green-500 flex-shrink-0" size={16} />
                            <span>{formattedDate}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {status === "Active" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ecfdf5] text-[#059669]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#f3f4f6] text-[#4b5563]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#9ca3af]"></span>
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap" data-html2canvas-ignore="true">
                          <div className="flex items-center justify-center gap-3 text-gray-400">
                            <button
                              onClick={() => handleViewStudent(s)}
                              className="p-1 hover:text-indigo-600 transition-colors"
                            >
                              <FiEye size={18} className="text-indigo-500" />
                            </button>
                            <button
                              onClick={() => navigate(`/students/edit/${s.id}`)}
                              className="p-1 hover:text-indigo-600 transition-colors"
                            >
                              <FiEdit size={18} className="text-indigo-500" />
                            </button>
                            <button 
                              className="p-1 hover:text-red-600 transition-colors"
                              onClick={() => handleDelete(s.id)}
                            >
                              <FiTrash2 size={18} className="text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </>
      )}
    </div>
  );
};

export default Page;
