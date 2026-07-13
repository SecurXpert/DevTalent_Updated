import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  BookOpen,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Users,
  ArrowRight,
} from "lucide-react";
import { API_BASE_URL } from "@/pages/Services/api/api";
import { useProfile } from "../contexts/ProfileContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { refreshProfile } = useProfile();

  // "super_admin" or "admin"
  const [role, setRole] = useState<"super_admin" | "admin">("super_admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    const endpoint = role === "super_admin" ? "/auth/super-admin/login" : "/auth/admin/login";

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.clear();
        localStorage.setItem("isAdminAuthenticated", "true");
        localStorage.setItem("adminToken", data.access_token);
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("adminEmail", email);
        localStorage.setItem("userRole", role);

        await refreshProfile();

        toast.success("Login successful!");
        if (role === "super_admin") {
          navigate("/superadmindashboard");
        } else {
          navigate("/admindashboard");
        }
      } else {
        toast.error(data.detail || "Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 w-full overflow-x-hidden font-sans">
      
      {/* LEFT SIDE: Promotional & Branding Panel */}
      <div className="w-1/2 hidden lg:flex flex-col justify-center items-center relative px-10 bg-gradient-to-br from-[#f5f3ff] via-[#faf5ff] to-[#fdf4ff] border-r border-purple-100/50">
        
        {/* Subtle Decorative Background Circles */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl -z-10"></div>

        {/* 2x2 Student Grid */}
        <div className="relative grid grid-cols-2 gap-5 max-w-[420px]">
          
          {/* Top-Left Avatar Box */}
          <div className="relative w-[190px] h-[190px] bg-gradient-to-br from-indigo-600 to-purple-600 flex items-end justify-center overflow-hidden rounded-l-[110px] shadow-lg hover:scale-105 transition-all duration-300">
            <img
              src="/login1.png"
              alt="Student"
              className="h-[210px] w-auto object-cover max-w-[110%] transform translate-y-2"
            />
          </div>

          {/* Top-Right Avatar Box */}
          <div className="relative w-[190px] h-[190px] bg-gradient-to-br from-purple-600 to-pink-500 rounded-[28px] flex items-end justify-center overflow-hidden shadow-lg hover:scale-105 transition-all duration-300">
            <img
              src="/login2.png"
              alt="Student"
              className="h-[210px] w-auto object-cover max-w-[110%] transform translate-y-2"
            />
          </div>

          {/* Bottom-Left Avatar Box */}
          <div className="relative w-[190px] h-[190px] bg-gradient-to-br from-purple-700 to-indigo-800 rounded-[28px] flex items-end justify-center overflow-hidden shadow-lg hover:scale-105 transition-all duration-300">
            <img
              src="/login3.png"
              alt="Student"
              className="h-[210px] w-auto object-cover max-w-[110%] transform translate-y-2"
            />
          </div>

          {/* Bottom-Right Avatar Box */}
          <div className="relative w-[190px] h-[190px] bg-gradient-to-br from-indigo-500 to-purple-700 flex items-end justify-center overflow-hidden rounded-r-[110px] shadow-lg hover:scale-105 transition-all duration-300">
            <img
              src="/login4.png"
              alt="Student"
              className="h-[210px] w-auto object-cover max-w-[110%] transform translate-y-2"
            />
          </div>
        </div>

        {/* Branding Slogans */}
        <div className="mt-12 text-left w-full max-w-[420px] px-2">
          <h2 className="text-2xl font-extrabold text-[#7c3aed] tracking-tight">
            Built For Students
          </h2>
          <h3 className="text-4xl font-black text-slate-800 mt-1 leading-tight">
            Trusted by Educators.
          </h3>
          <p className="text-slate-500 text-sm mt-3.5 leading-relaxed font-semibold">
            Login confidently with a platform designed specifically for educational institutions
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Login Interactive Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-12 bg-gradient-to-tr from-slate-50 to-slate-100/50">
        
        {/* Main Floating Container */}
        <div className="w-full max-w-md bg-white rounded-[32px] shadow-[0_20px_50px_rgba(124,58,237,0.06)] border border-slate-100 overflow-hidden">
          
          <div className="p-8 sm:p-10">
            
            {/* Header / Brand Icon */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_8px_20px_rgba(124,58,237,0.25)]">
                <BookOpen size={26} />
              </div>

              <h2 className="text-2xl font-black text-slate-800 mt-5">
                Welcome Back! 👋
              </h2>

              <p className="text-slate-400 text-xs font-semibold mt-1">
                Please select your role and login to continue
              </p>
            </div>

            {/* Role Selection Container */}
            <div className="mb-7">
              <div className="flex items-center gap-1.5 mb-3 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <Shield size={13} className="text-[#8b5cf6]" />
                <span>Choose Your Role</span>
              </div>

              <div className="flex gap-4">
                
                {/* Super Admin Card */}
                <button
                  type="button"
                  onClick={() => setRole("super_admin")}
                  className={`relative flex-1 p-4 rounded-2xl transition-all duration-300 border text-center flex flex-col items-center justify-center gap-2 h-[105px] group ${
                    role === "super_admin"
                      ? "text-white border-transparent scale-[1.02]"
                      : "bg-white text-slate-600 border-slate-200 hover:border-purple-200 hover:bg-slate-50/50"
                  }`}
                  style={
                    role === "super_admin"
                      ? {
                          background: "linear-gradient(135deg, #8E51FF 0%, #7c3aed 100%)",
                          borderTop: "2.65px solid #C27AFF",
                          boxShadow: "0px 8px 24px -6px rgba(124,58,237,0.35)",
                        }
                      : {}
                  }
                >
                  {/* Decorative tiny yellow badge */}
                  {role === "super_admin" && (
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-yellow-400 border border-white animate-pulse" />
                  )}
                  
                  <div className={`p-2 w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    role === "super_admin" ? "bg-white/20" : "bg-purple-50 text-[#8b5cf6] group-hover:bg-purple-100"
                  }`}>
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-xs leading-none">Super Admin</p>
                    <p className={`text-[10px] mt-0.5 font-medium leading-none ${role === "super_admin" ? "text-purple-100" : "text-slate-400"}`}>
                      Full system control
                    </p>
                  </div>
                </button>

                {/* Admin Card */}
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`relative flex-1 p-4 rounded-2xl transition-all duration-300 border text-center flex flex-col items-center justify-center gap-2 h-[105px] group ${
                    role === "admin"
                      ? "text-white border-transparent scale-[1.02]"
                      : "bg-white text-slate-600 border-slate-200 hover:border-purple-200 hover:bg-slate-50/50"
                  }`}
                  style={
                    role === "admin"
                      ? {
                          background: "linear-gradient(135deg, #8E51FF 0%, #7c3aed 100%)",
                          borderTop: "2.65px solid #C27AFF",
                          boxShadow: "0px 8px 24px -6px rgba(124,58,237,0.35)",
                        }
                      : {}
                  }
                >
                  {/* Decorative tiny yellow badge */}
                  {role === "admin" && (
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-yellow-400 border border-white animate-pulse" />
                  )}

                  <div className={`p-2 w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    role === "admin" ? "bg-white/20" : "bg-purple-50 text-[#8b5cf6] group-hover:bg-purple-100"
                  }`}>
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-xs leading-none">Admin</p>
                    <p className={`text-[10px] mt-0.5 font-medium leading-none ${role === "admin" ? "text-purple-100" : "text-slate-400"}`}>
                      Manage platform
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Login Input Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Email Input */}
              <div className="relative flex items-center bg-slate-50 rounded-2xl border border-slate-200/80 px-4 py-3.5 focus-within:bg-white focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-100 transition-all duration-300">
                <Mail size={18} className="text-slate-400 mr-3" />
                <input
                  type="email"
                  required
                  placeholder="Email / Login ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent outline-none w-full text-sm font-semibold text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Password Input */}
              <div className="relative flex items-center bg-slate-50 rounded-2xl border border-slate-200/80 px-4 py-3.5 focus-within:bg-white focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-100 transition-all duration-300">
                <Lock size={18} className="text-slate-400 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent outline-none w-full text-sm font-semibold text-slate-700 placeholder-slate-400 pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Extras Row (Remember Me & Forgot Password) */}
              <div className="flex items-center justify-between text-xs font-bold pt-1.5">
                <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 transition-colors"
                  />
                  <span>Remember Me</span>
                </label>
                <a
                  href="/forgotpassword"
                  className="text-[#8E51FF] hover:text-[#7c3aed] hover:underline transition-colors"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-[0_8px_25px_-4px_rgba(124,58,237,0.3)] hover:shadow-[0_12px_30px_-4px_rgba(124,58,237,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <span>{isLoading ? "Signing in..." : "Login to Dashboard"}</span>
                {!isLoading && (
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </form>
            
            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative px-3 bg-white text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                Secure Login
              </span>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400/80 mt-6 select-none">
          <Lock size={12} className="text-slate-400" />
          <span>© 2026 EduExam Pro. Secured & Encrypted</span>
        </div>

      </div>
    </div>
  );
}