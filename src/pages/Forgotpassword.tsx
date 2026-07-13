import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import logo from "../assests/logo.png";
import { API_BASE_URL } from "@/pages/Services/api/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: otp + new password
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step === 1) {
      // Step 1: Send OTP
      if (!email) {
        setError("Email is required");
        return;
      }

      setError("");
      setLoading(true);

      try {
        const response = await axios.post(
          `${API_BASE_URL}/student/forgot-password`,
          {
            email: email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Forgot Password Response:", response.data);
        setMessage("OTP has been sent to your email.");
        setStep(2);
      } catch (err: any) {
        console.error("Forgot Password Error:", err);
        setError("Failed to send OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // Step 2: Reset password with OTP
      if (!otp || otp.length !== 6) {
        setError("Please enter a valid 6-digit OTP");
        return;
      }
      if (!newPassword) {
        setError("Please enter new password");
        return;
      }
      if (newPassword.length < 8) {
        setError("New password must be at least 8 characters");
        return;
      }

      setError("");
      setLoading(true);

      try {
        const response = await axios.post(
          `${API_BASE_URL}/student/reset-password`,
          {
            email: email,
            otp: otp,
            new_password: newPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Reset Password Response:", response.data);
        setMessage("Password has been reset successfully.");

        setTimeout(() => {
          navigate("/individual");
        }, 2000);
      } catch (err: any) {
        console.error("Reset Password Error:", err);
        setError("Failed to reset password. Please check your OTP and try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
      {/* Top Logo Section */}
      <div className="w-full px-6 sm:px-10 py-6">
        <img
          src={logo}
          alt="DevTalent"
          className="h-14 sm:h-16 md:h-20 lg:h-24"
        />
      </div>

      {/* Center Content */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#7B2CBF] to-[#3C096C] px-6 sm:px-8 py-6 sm:py-8 text-white">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
              {step === 1 ? "Reset Password" : "Enter OTP & New Password"}
            </h2>
            <p className="text-xs sm:text-sm md:text-base opacity-90 mt-1">
              {step === 1
                ? "Enter your email to receive reset instructions"
                : "Enter the OTP sent to your email and set new password"
              }
            </p>
          </div>

          {/* Form */}
          <div className="px-6 sm:px-8 py-6 sm:py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field - Show in both steps */}
              <div>
                <label className="text-sm sm:text-base font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Prevent spaces
                    if (!value.includes(" ")) {
                      setEmail(value);

                      const emailRegex =
                        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

                      if (!value) {
                        setEmailError("Email is required.");
                      } else if (!emailRegex.test(value)) {
                        setEmailError("Please enter a valid email address.");
                      } else {
                        setEmailError("");
                      }
                    }
                  }}
                  onBlur={() => {
                    if (!email) {
                      setEmailError("Email is required.");
                    }
                  }}
                  placeholder="your.email@example.com"
                  disabled={step === 2}
                  className={`w-full mt-2 px-4 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm sm:text-base ${emailError ? "border-red-500" : "border-gray-300"
                    } ${step === 2 ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />

                {emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
              </div>

              {/* Step 2 Fields */}
              {step === 2 && (
                <>
                  {/* OTP Field */}
                  <div>
                    <label className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-700">
                      <Mail className="w-4 h-4 text-purple-600" />
                      OTP <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className="w-full mt-2 px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm sm:text-base"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the OTP sent to your email
                    </p>
                  </div>

                  {/* New Password Field */}
                  <div>
                    <label className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-700">
                      <Lock className="w-4 h-4 text-purple-600" />
                      New Password <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 8 characters)"
                        className="w-full mt-2 px-4 py-2.5 sm:py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm sm:text-base"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {message && <p className="text-green-600 text-sm">{message}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#7B2CBF] to-[#3C096C] text-white py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : (step === 1 ? "Send OTP" : "Reset Password")
                }
              </button>

              {/* Back to Login */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/individual")}
                  className="text-gray-600 hover:text-purple-600 transition text-sm sm:text-base"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
