import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { API_BASE_URL } from "@/pages/Services/api/api";

interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  modules: string[];
  createdDate: string;
  status: "Active" | "Inactive";
}

const ALL_ROLES = [
  "admin",
  "super_admin",
 
];

const MODULE_PERMISSIONS = [
  { name: "Students", displayName: "Students Management", desc: "Manage student records and profiles" },
  { name: "Courses", displayName: "Course Management", desc: "Manage courses and curriculum" },
  { name: "Exams", displayName: "Exam Management", desc: "Create and manage exams" },
  { name: "Results", displayName: "Results Management", desc: "View and manage exam results" },
  { name: "Subscriptions", displayName: "Subscriptions Management", desc: "Configure subscription plans and pricing" },
  { name: "Reports", displayName: "Reports & Analytics", desc: "View system analytics and export data reports" },
  { name: "Notifications", displayName: "Notifications Management", desc: "Send notifications and announcements to users" },
  { name: "Settings", displayName: "System Settings", desc: "Configure global system settings and defaults" },
];

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button
    type="button"
    onClick={onChange}
    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none ${
      enabled ? "bg-purple-600" : "bg-gray-200"
    }`}
  >
    <div
      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
        enabled ? "translate-x-6" : "translate-x-0"
      }`}
    />
  </button>
);

export default function CreateAdmin() {
  const navigate = useNavigate();

  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formConfirmPassword, setFormConfirmPassword] = useState("");
  const [formRole, setFormRole] = useState("admin");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [formModules, setFormModules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Default modules mapping on role change
  useEffect(() => {
    if (formRole === "super_admin") {
      setFormModules(MODULE_PERMISSIONS.map(m => m.name));
    } else if (formRole === "admin") {
      setFormModules(["Students", "Courses", "Exams", "Results"]);
    }
  }, [formRole]);

  // Get authentication token from localStorage, sessionStorage, or cookies
  const getAuthToken = () => {
    const possibleKeys = ['adminToken', 'token', 'access_token', 'auth_token', 'jwt', 'userToken'];
    let token = null;
    let source = '';

    for (const key of possibleKeys) {
      token = localStorage.getItem(key);
      if (token) {
        source = `localStorage.${key}`;
        break;
      }
      token = sessionStorage.getItem(key);
      if (token) {
        source = `sessionStorage.${key}`;
        break;
      }
    }

    if (!token) {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (possibleKeys.some(key => name.toLowerCase().includes(key.toLowerCase()))) {
          token = decodeURIComponent(value);
          source = `cookie.${name}`;
          break;
        }
      }
    }

    if (token) {
      console.log(`Token found in: ${source}`);
      const cleanToken = token.replace(/^Bearer\s+/i, '');
      return `Bearer ${cleanToken}`;
    }

    return null;
  };

  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formPhone.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!formPassword) {
      toast.error("Password is required.");
      return;
    }
    if (formPassword !== formConfirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login first.");
        navigate('/login');
        return;
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': token,
      };

      const payload = {
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        password: formPassword,
        role: formRole,
        is_active: formStatus === "Active"
      };

      const response = await fetch(`${API_BASE_URL}/auth/super-admin/admins`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("isAdminAuthenticated");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("userRole");
        toast.error("Session expired or unauthorized. Please login again.");
        navigate("/adminlogin");
        return;
      }

      if (response.ok) {
        const data = await response.json();

        // Load admins from localStorage for fallback/sync display
        const saved = localStorage.getItem("adminManagementList");
        const admins: Admin[] = saved ? JSON.parse(saved) : [];

        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
          today.getMonth() + 1
        ).padStart(2, "0")}/${today.getFullYear()}`;

        const newAdmin: Admin = {
          id: data.id || admins.length > 0 ? Math.max(...admins.map((a) => a.id)) + 1 : 1,
          name: formName,
          email: formEmail,
          phone: formPhone,
          role: formRole,
          modules: formModules,
          createdDate: formattedDate,
          status: formStatus,
        };

        const updatedAdmins = [newAdmin, ...admins];
        localStorage.setItem("adminManagementList", JSON.stringify(updatedAdmins));
        toast.success("Administrator created successfully");
        navigate("/admin-management");
      } else {
        const errorText = await response.text();
        let errMsg = `Failed to create admin: ${response.status}`;
        try {
          const errData = JSON.parse(errorText);
          errMsg = errData.detail?.[0]?.msg || errData.message || errMsg;
        } catch {
          if (errorText) errMsg += ` - ${errorText.substring(0, 150)}`;
        }
        toast.error(errMsg);
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      toast.error("An error occurred while creating the admin.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModuleSelection = (mod: string) => {
    if (formModules.includes(mod)) {
      setFormModules((prev) => prev.filter((m) => m !== mod));
    } else {
      setFormModules((prev) => [...prev, mod]);
    }
  };

  return (
    <div className="bg-[#f5f3ff] min-h-screen p-4 sm:p-6 md:p-8 w-full max-w-full overflow-x-hidden">
      <form onSubmit={handleSaveAdmin} className="space-y-6 animate-fadeIn pb-12 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin-management')}
            className="p-2 hover:bg-gray-200 rounded-xl transition-colors text-gray-600"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-[inter,sans-serif] text-gray-900 font-semibold tracking-tight">
              Create New Admin
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Add a new administrator to the system
            </p>
          </div>
        </div>

        {/* SECTION 1: Basic Information */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-700 to-indigo-800 px-6 py-3.5 text-white">
            <h2 className="text-sm font-bold uppercase tracking-wider">Basic Information</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Admin Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter admin's full name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all text-gray-800"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all text-gray-800"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="123-456-7890"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all text-gray-800"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter password"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all text-gray-800"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Re-enter password"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all text-gray-800"
                    value={formConfirmPassword}
                    onChange={(e) => setFormConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Role & Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-700 to-indigo-800 px-6 py-3.5 text-white">
            <h2 className="text-sm font-bold uppercase tracking-wider">Role & Status</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Admin Role *
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm font-semibold text-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all cursor-pointer"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                >
                  {ALL_ROLES.map((r, i) => (
                    <option key={i} value={r}>
                      {r.replace("_", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5 font-medium">
                Select the primary role for this admin
              </p>
            </div>

            {/* Status Radio Buttons */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                Admin Status *
              </label>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-gray-700">
                  <input
                    type="radio"
                    name="status"
                    checked={formStatus === "Active"}
                    onChange={() => setFormStatus("Active")}
                    className="text-purple-600 focus:ring-purple-500 w-4 h-4"
                  />
                  <span>Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-gray-700">
                  <input
                    type="radio"
                    name="status"
                    checked={formStatus === "Inactive"}
                    onChange={() => setFormStatus("Inactive")}
                    className="text-purple-600 focus:ring-purple-500 w-4 h-4"
                  />
                  <span>Inactive</span>
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-3 font-medium">
                Set the initial status for this admin
              </p>
            </div>
          </div>
        </div>

      

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-150">
          <button
            type="button"
            onClick={() => navigate('/admin-management')}
            className="px-6 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl font-bold text-sm text-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 text-white rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(90deg, #8020A9 0%, #3B309E 100%)",
            }}
          >
            {isLoading ? "Creating..." : "Create Admin"}
          </button>
        </div>
      </form>
    </div>
  );
}
