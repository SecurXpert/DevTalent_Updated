import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchStudentById, StudentDetails, BASE_URL } from "@/lib/api";
import {
  FiArrowLeft,
  FiSave,
  FiAlertCircle,
  FiUser,
  FiCalendar,
  FiMail,
  FiPhone,
  FiHome,
} from "react-icons/fi";

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

const EditStudent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [studentId, setStudentId] = useState("");
  const [regDate, setRegDate] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const data = await fetchStudentById(Number(id));
          setStudentId(`STU${String(data.id).padStart(3, "0")}`);
          setRegDate(formatDate(data.registered_date));
          setFullName(data.full_name);
          setEmail(data.email_id);
          setPhone(data.phone_number || "");
          setCollege(data.college_name);
          setStatus(data.status || "Active");
        } catch (e) {
          console.error("Failed to load student details for editing", e);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${BASE_URL}/student/students/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: fullName,
          email: email,
          phone: phone,
          college_name: college,
          status: status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      navigate(`/students/view/${id}`);
    } catch (e) {
      console.error("Error updating student", e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading student details...</div>;
  }

  return (
    <div className="bg-[#F5F3FF] min-h-screen p-4 md:p-8 font-[inter,sans-serif]">
      <div className="max-w-full  space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate("/students")}
            className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-6"
          >
            <FiArrowLeft className="mr-2" /> Back to Students
          </button>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <FiSave size={24} />
            </div>
            <h1 className="text-3xl font-bold text-indigo-600">Edit Student</h1>
          </div>
          <p className="text-gray-500 text-sm">Update student information and details.</p>
        </div>

        {/* Read-Only Information */}
        <div className="rounded-[2rem] p-6 md:p-8 border border-[#E9D4FF] shadow-sm" style={{ background: "linear-gradient(90deg, #F3E8FF 0%, #DBEAFE 100%)" }}>
          <div className="flex items-center gap-2 mb-6">
            <FiAlertCircle className="text-indigo-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Read-Only Information</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                <FiUser /> Student ID
              </div>
              <p className="font-semibold text-gray-900">{studentId}</p>
            </div>
            <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                <FiCalendar /> Registration Date
              </div>
              <p className="font-semibold text-gray-900">{regDate}</p>
            </div>
          </div>
        </div>

        {/* Editable Information */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Editable Information</h2>
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
                <FiUser className="text-purple-500" /> Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                placeholder="Enter full name"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
                <FiMail className="text-purple-500" /> Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                placeholder="Enter email address"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
                <FiPhone className="text-purple-500" /> Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                placeholder="Enter phone number"
              />
            </div>

            {/* College Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
                <FiHome className="text-purple-500" /> College Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                placeholder="Enter college name"
              />
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-3">
                <FiAlertCircle className="text-purple-500" /> Status <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setStatus("Active")}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${status === "Active"
                    ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("Inactive")}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${status === "Inactive"
                    ? "bg-gray-100 text-gray-800 border-gray-300"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => navigate(`/students/view/${id}`)}
            className="flex-1 bg-white border border-gray-200 text-gray-800 font-semibold py-3.5 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-xl shadow-purple-500/30 disabled:opacity-70"
          >
            {saving ? (
              <span className="animate-pulse">Saving...</span>
            ) : (
              <>
                <FiSave size={18} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
