import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchStudentById, deleteStudent, StudentDetails } from "@/lib/api";
import {
  FiArrowLeft,
  FiTrash2,
  FiMail,
  FiHome,
  FiPhone,
  FiCalendar,
  FiUser,
  FiCopy,
  FiCheckCircle,
} from "react-icons/fi";

const examHistory = [
  { name: "Data Structures Final", score: "85/100 (85%)", status: "Pass", date: "2026-03-10" },
  { name: "Algorithms Mid-term", score: "78/100 (78%)", status: "Pass", date: "2026-03-05" },
  { name: "Database Management Quiz", score: "92/100 (92%)", status: "Pass", date: "2026-02-28" },
  { name: "Operating Systems", score: "88/100 (88%)", status: "Pass", date: "2026-02-22" },
  { name: "Computer Networks", score: "75/100 (75%)", status: "Pass", date: "2026-02-15" },
  { name: "Python Programming", score: "95/100 (95%)", status: "Pass", date: "2026-02-08" },
  { name: "Web Development", score: "89/100 (89%)", status: "Pass", date: "2026-02-01" },
  { name: "Software Engineering", score: "72/100 (72%)", status: "Pass", date: "2026-01-25" },
];

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0] ? parts[0][0].toUpperCase() : "";
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

const ViewStudent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const data = await fetchStudentById(Number(id));
          setStudent(data);
        } catch (e) {
          console.error("Failed to load student details", e);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(Number(id));
        navigate("/students");
      } catch (e) {
        console.error("Error deleting student:", e);
        alert("Failed to delete student.");
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading student details...</div>;
  }

  if (!student) {
    return <div className="p-8 text-center text-red-500">Student not found</div>;
  }

  const initials = getInitials(student.full_name);
  const studentIdStr = `STU${String(student.id).padStart(3, "0")}`;
  const formattedDate = formatDate(student.registered_date);
  const phone = student.phone_number || "+91 98765 43210";

  return (
    <div className="bg-[#F5F3FF] min-h-screen p-4 md:p-8 space-y-6 font-[inter,sans-serif]">
      {/* Top Header */}
      <div>
        <button
          onClick={() => navigate("/students")}
          className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-4"
        >
          <FiArrowLeft className="mr-2" /> Back to Students
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl text-indigo-600 font-semibold tracking-wide">
              Student Details
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              View complete student registration information.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/students/edit/${id}`)}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
            >
              Edit Profile
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors shadow-sm"
              onClick={handleDelete}
            >
              <FiTrash2 /> Delete Student
            </button>
          </div>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-white relative overflow-hidden">
        {/* Decorative corner shape */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5F3FF] rounded-bl-full opacity-50 -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-[#AD46FF66]">
              {initials}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#10b981] text-white p-1 rounded-full border-[3px] border-white">
              <FiCheckCircle size={20} />
            </div>
          </div>

          {/* Name & Quick Info */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{student.full_name}</h2>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <FiMail size={16} />
                <span>{student.email_id}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* College Pill */}
              <div className="flex items-center gap-4 bg-[#FAF5FF] p-3 rounded-2xl border border-gray-50">
                <div className="w-10 h-10 bg-gradient-to-r from-[#9810FA] to-[#8200DB] text-white rounded-xl flex items-center justify-center shadow-lg">
                  <FiHome size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">College</p>
                  <p className="text-sm font-semibold text-gray-800">{student.college_name}</p>
                </div>
              </div>

              {/* Phone Pill */}
              <div className="flex items-center gap-4 bg-[#EFF6FF] p-3 rounded-2xl border border-blue-50">
                <div className="w-10 h-10 bg-gradient-to-r from-[#155DFC] to-[#1447E6] text-white rounded-xl flex items-center justify-center shadow-lg">
                  <FiPhone size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-sm font-semibold text-gray-800">{phone}</p>
                </div>
              </div>

              {/* Reg Date Pill */}
              <div className="flex items-center gap-4 bg-[#F0FDF4] p-3 rounded-2xl border border-green-50">
                <div className="w-10 h-10 bg-gradient-to-r from-[#00A63E] to-[#008236] text-white rounded-xl flex items-center justify-center shadow-lg">
                  <FiCalendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Registration Date</p>
                  <p className="text-sm font-semibold text-gray-800">{formattedDate}</p>
                </div>
              </div>

              {/* ID Pill */}
              <div className="flex items-center gap-4 bg-[#FFF7ED] p-3 rounded-2xl border border-orange-50">
                <div className="w-10 h-10 bg-gradient-to-r from-[#F54900] to-[#CA3500] text-white rounded-xl flex items-center justify-center shadow-lg">
                  <FiUser size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Student ID</p>
                  <p className="text-sm font-semibold text-gray-800">{studentIdStr}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#9333ea] text-white rounded-xl flex items-center justify-center shadow-xl shadow-[#AD46FF4D]">
              <FiMail size={18} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Email Information</h3>
          </div>
          <div className="mb-6 flex-1">
            <p className="text-sm text-gray-400 mb-1">Email Address</p>
            <p className="text-base text-gray-800">{student.email_id}</p>
          </div>
          <button
            onClick={() => handleCopy(student.email_id, "email")}
            className="w-full py-2.5 rounded-xl border border-purple-200 text-purple-600 font-medium text-sm flex items-center justify-center gap-2 hover:bg-purple-50 transition-colors bg-[#FAF5FF]"
          >
            {copiedField === "email" ? <FiCheckCircle /> : <FiCopy />}
            {copiedField === "email" ? "Copied!" : "Copy Email"}
          </button>
        </div>

        {/* College Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-xl shadow-[#2B7FFF4D]">
              <FiHome size={18} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">College Information</h3>
          </div>
          <div className="mb-6 flex-1">
            <p className="text-sm text-gray-400 mb-1">College Name</p>
            <p className="text-base text-gray-800">{student.college_name}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#10b981] text-white rounded-xl flex items-center justify-center shadow-xl shadow-[#00C9504D]">
              <FiPhone size={18} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
          </div>
          <div className="mb-6 flex-1">
            <p className="text-sm text-gray-400 mb-1">Phone Number</p>
            <p className="text-base text-gray-800">{phone}</p>
          </div>
          <button
            onClick={() => handleCopy(phone, "phone")}
            className="w-full py-2.5 rounded-xl border border-green-200 text-green-600 font-medium text-sm flex items-center justify-center gap-2 hover:bg-green-50 transition-colors bg-[#F0FDF4]"
          >
            {copiedField === "phone" ? <FiCheckCircle /> : <FiCopy />}
            {copiedField === "phone" ? "Copied!" : "Copy Phone"}
          </button>
        </div>

        {/* Registration Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#ea580c] text-white rounded-xl flex items-center justify-center shadow-xl shadow-[#FF69004D]">
              <FiCalendar size={18} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Registration Information</h3>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-1">Registration Date</p>
            <p className="text-base text-gray-800">{formattedDate}</p>
          </div>
          <div className="mb-6 flex-1">
            <p className="text-sm text-gray-400 mb-1">Student Reference ID</p>
            <div className="bg-[#FFF7ED] p-3 rounded-lg border border-orange-50 text-gray-800 font-medium text-sm">
              {studentIdStr}
            </div>
          </div>
          <button
            onClick={() => handleCopy(studentIdStr, "id")}
            className="w-full py-2.5 rounded-xl border border-orange-200 text-orange-600 font-medium text-sm flex items-center justify-center gap-2 hover:bg-orange-50 transition-colors bg-[#FFF7ED]"
          >
            {copiedField === "id" ? <FiCheckCircle /> : <FiCopy />}
            {copiedField === "id" ? "Copied!" : "Copy ID"}
          </button>
        </div>
      </div>

      {/* Student Summary Banner */}
      <div className="bg-gradient-to-r from-[#7c3aed] to-[#2563eb] rounded-[2rem] p-6 md:p-8 text-white shadow-xl mt-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
            <FiCheckCircle size={20} />
          </div>
          <h2 className="text-xl font-medium tracking-wide">Student Summary</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Registration Status */}
          <div className="flex-1 bg-white/10 rounded-2xl p-5 border border-white/20 backdrop-blur-sm">
            <p className="text-sm text-white/80 mb-3">Registration Status</p>
            <div className="inline-flex items-center gap-2 bg-[#10b981] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-[#10b981]/40">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Active Student
            </div>
          </div>

          {/* Registered On */}
          <div className="flex-1 bg-white/10 rounded-2xl p-5 border border-white/20 backdrop-blur-sm">
            <p className="text-sm text-white/80 mb-3">Registered On</p>
            <p className="text-xl font-medium">{formattedDate}</p>
          </div>

          {/* Student Reference ID */}
          <div className="flex-1 bg-white/10 rounded-2xl p-5 border border-white/20 backdrop-blur-sm">
            <p className="text-sm text-white/80 mb-3">Student Reference ID</p>
            <p className="text-xl font-medium font-mono tracking-wide">{studentIdStr}</p>
          </div>
        </div>
      </div>

      {/* Exam History */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mt-6 pb-2">
        <div className="p-6 md:px-8 md:py-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Exam History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[#FAFAFA] border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 md:px-8">EXAM NAME</th>
                <th className="px-6 py-4">SCORE</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">ATTEMPT DATE</th>
                <th className="px-6 py-4 md:px-8">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {examHistory.map((exam, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 md:px-8 text-sm font-semibold text-gray-800">{exam.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{exam.score}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#059669]">
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{exam.date}</td>
                  <td className="px-6 py-4 md:px-8">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewStudent;
