import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import logo from "../assests/logo.png";
import { API_BASE_URL } from "@/pages/Services/api/api";

export default function Success1() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get email passed from Register page
  const email = location.state?.email || "your email";

  // Password state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const validatePassword = () => {
    if (!otp || otp.length !== 6) {
      setPasswordError("Please enter a valid 6-digit OTP");
      return false;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSetPassword = async () => {
    if (!validatePassword()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/student/set-password`,
        {
          email: email,
          otp: otp,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Set Password Response:", response.data);

      // Success - redirect to login
      setLoading(false);
      navigate("/individual");
    } catch (err: any) {
      console.error("Set Password Error:", err);
      setPasswordError("Failed to set password. Please check your OTP and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
      {/* Top Logo */}
      <div className="p-6">
        <img src={logo} alt="DevTalent" className="h-12" />
      </div>

      {/* Center Content */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Green Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-green-500 rounded-full p-3">
              <CheckCircle size={32} className="text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-800">
            Registration Successful!
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-gray-600 mt-2">
            A temporary password has been sent to:
          </p>

          {/* Email */}
          <p className="text-purple-600 font-medium mt-1">{email}</p>

          <p className="text-xs text-gray-500 mt-4">
            Please check your inbox and use the temporary password to log in.
          </p>

          <div className="border-t pt-6 mt-6 text-left">
            <h3 className="text-md font-semibold text-gray-800 mb-4">
              Set Your Password
            </h3>

            {/* OTP Field */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Lock className="w-4 h-4 text-purple-600" />
                OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the OTP sent to your email
              </p>
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Lock className="w-4 h-4 text-purple-600" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Lock className="w-4 h-4 text-purple-600" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Password Error */}
            {passwordError && (
              <p className="text-red-500 text-xs mb-4">{passwordError}</p>
            )}

            {/* Set Password Button */}
            <button
              onClick={handleSetPassword}
              disabled={loading || !otp || !password || !confirmPassword}
              className="w-full bg-gradient-to-r from-[#7B2CBF] to-[#3C096C] text-white py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Setting Password..." : "Set Password"}
            </button>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => navigate("/individual")}
            className="w-full mt-4 border border-purple-600 text-purple-600 py-2.5 rounded-lg hover:bg-purple-50 transition"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
}
