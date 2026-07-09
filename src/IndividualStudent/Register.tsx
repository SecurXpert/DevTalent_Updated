import { useState, FormEvent, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "@/pages/Services/api/api";

import { RegistrationHeader } from "./RegisterComponents/RegistrationHeader";
import { RegistrationForm } from "./RegisterComponents/RegistrationForm";
import { OtpModal } from "./RegisterComponents/OtpModal";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    college: "",
    country: "",
    educational_status: "",
    qualification: "",
    passedout_year: "",
    interest: "",
    state: "",
    city: "",
    courses: [] as string[],
  });

  const [error, setError] = useState("");

  // OTP State Variables
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [otpDigits, setOtpDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const finalOtp = otpDigits.join("");
  const [otpTimer, setOtpTimer] = useState<number>(120);
  const [otpSuccess, setOtpSuccess] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [otpResendMessage, setOtpResendMessage] = useState<string>("");

  // Handle checkbox selection
  const handleCourseChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      courses: prev.courses.includes(value) ? [] : [value],
    }));
  };

  // OTP Effects
  useEffect(() => {
    if (showOtpModal) {
      inputsRef.current[0]?.focus();
    }
  }, [showOtpModal]);

  useEffect(() => {
    if (!showOtpModal || otpTimer === 0) return;

    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [showOtpModal, otpTimer]);

  // Helper Functions
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.courses.length === 0) {
      setError("Please select at least one course.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Map form data to API requirements
      const apiData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country || "India",
        educational_status: formData.educational_status || "Student",
        qualification: formData.qualification || "Bachelor's",
        passedout_year: formData.passedout_year || "2024",
        interest: formData.courses.join(", "),
        state: formData.state || "Andhra Pradesh",
        city: formData.city || "Tirupati",
        college_name: formData.college,
      };

      const response = await axios.post(
        `${API_BASE_URL}/student/register`,
        apiData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      if (formData.courses.length > 0) {
        localStorage.setItem("registeredCourse", formData.courses[0]);
      }

      setOtpTimer(120);
      setShowOtpModal(true);
      setOtpResendMessage(response.data?.message || "OTP sent to email");
    } catch (err: any) {
      if (err.response?.data?.detail) {
        if (err.response.data.detail.includes("College not found or inactive")) {
          setError("College not found or inactive. Please check your college name or contact support.");
        } else if (err.response.data.detail.includes("Email already registered") || err.response.data.detail.includes("already exists")) {
          setError("Email already registered. Please use a different email or login.");
        } else {
          setError(err.response.data.detail);
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // OTP Handler Functions
  const handleOtpBoxChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (otpTimer > 0) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/student/resend-otp`,
        {
          email: formData.email,
          purpose: "register",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setOtpDigits(["", "", "", "", "", ""]);
      setOtpError("");
      setOtpTimer(120);
      setOtpResendMessage(response.data?.message || "OTP has been resent to your email");
      inputsRef.current[0]?.focus();

      setTimeout(() => {
        setOtpResendMessage("");
      }, 5000);
    } catch (err: any) {
      setOtpError("Failed to resend OTP. Please try again.");
      setOtpResendMessage("");
    }
  };

  const handleVerify = () => {
    if (!/^\d{6}$/.test(finalOtp)) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    setOtpSuccess(true);
    setTimeout(() => {
      navigate("/success1", { state: { email: formData.email } });
    }, 3000);
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtpDigits(["", "", "", "", "", ""]);
    setOtpTimer(120);
    setOtpSuccess(false);
    setOtpError("");
    setOtpResendMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <RegistrationHeader />

        <RegistrationForm
          formData={formData}
          setFormData={setFormData}
          error={error}
          loading={loading}
          handleSubmit={handleSubmit}
          handleCourseChange={handleCourseChange}
          navigate={navigate}
        />
      </div>

      <OtpModal
        showOtpModal={showOtpModal}
        handleCloseOtpModal={handleCloseOtpModal}
        otpResendMessage={otpResendMessage}
        otpSuccess={otpSuccess}
        otpError={otpError}
        email={formData.email}
        otpDigits={otpDigits}
        handleOtpBoxChange={handleOtpBoxChange}
        handleOtpBackspace={handleOtpBackspace}
        inputsRef={inputsRef}
        handleResendOtp={handleResendOtp}
        otpTimer={otpTimer}
        formatTime={formatTime}
        handleVerify={handleVerify}
        finalOtp={finalOtp}
      />
    </div>
  );
}
