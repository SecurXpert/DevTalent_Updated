import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import logo from "../assests/logo.png";
import { API_BASE_URL } from "@/pages/Services/api/api";

export default function Individual() {
  const navigate = useNavigate(); // 🔥 Added navigation

  // Validation State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const STATIC_EMAIL = "test@example.com";
  const STATIC_PASSWORD = "password123";
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!value) {
      setEmailError("Email is required.");
    } else if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("Password is required.");
    } else if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async () => {
    validateEmail(email);
    validatePassword(password);

    // 🔥 Wait for validation before checking
    if (!email || password.length < 8) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/student/login`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login Response:", response.data);

      if (response.data.access_token) {
        // Store token and redirect
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("token_type", response.data.token_type);
        setLoginError("");

        try {
          // Check if student has a subscription
          const subRes = await axios.get(`${API_BASE_URL}/student/subscription/current`, {
            headers: {
              "Authorization": `Bearer ${response.data.access_token}`,
              "Content-Type": "application/json"
            }
          });
          
          const data = subRes.data;
          // Check if we got a valid subscription object or non-empty array
          const hasSubscription = Array.isArray(data) ? data.length > 0 : !!(data && Object.keys(data).length > 0);
          
          if (hasSubscription) {
            navigate("/StudentDashboard");
          } else {
            navigate("/subscription");
          }
        } catch (subError) {
          console.error("Error checking subscription status:", subError);
          // Default to subscription page if check fails
          navigate("/subscription");
        }
      } else {
        setLoginError("Invalid email or password");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setLoginError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* LEFT SIDE */}
        <div className="space-y-6 text-center md:text-left">
          <img
            src={logo}
            alt="DevTalent"
            className="h-12 sm:h-14 md:h-16 lg:h-20 mx-auto md:mx-0"
          />

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
              Advance Your Career
            </h1>
            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto md:mx-0">
              Join thousands of students who are mastering their skills through
              our comprehensive examination platform.
            </p>
          </div>
          <div className="space-y-3 mt-6 max-w-md mx-auto md:mx-0">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <p className="text-gray-700 text-sm">
                Multi-level certification programs
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <p className="text-gray-700 text-sm">
                Detailed performance analytics
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
              <p className="text-gray-700 text-sm">
                Industry-recognized certificates
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE LOGIN CARD */}
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#7B2CBF] to-[#3C096C] p-5 sm:p-6 text-white">
            <h2 className="text-lg sm:text-xl font-semibold">Welcome Back</h2>
            <p className="text-xs sm:text-sm opacity-90">
              Sign in to continue your learning journey
            </p>
          </div>
          <div className="p-5 sm:p-6 space-y-4 sm:space-y-5">
            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 text-purple-600 shrink-0" />
                Email ID
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Lock className="w-4 h-4 text-gray-500 shrink-0" />
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {passwordError && (
                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}

              {/* 🔥 Forgot Password Navigation */}
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/forgotpassword")}
                  className="text-sm text-purple-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {loginError && (
              <p className="text-red-500 text-sm text-center">{loginError}</p>
            )}

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-[#7B2CBF] to-[#3C096C] text-white py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition"
            >
              Login
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* 🔥 Create Account Navigation */}
            <div className="text-center text-sm text-gray-600">
              Don't have an account?
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="w-full sm:w-auto px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
                >
                  Create New Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

