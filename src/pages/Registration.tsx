import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import side from "../assests/side.png";
import Secur from "../assests/cmplogo.png";
import Student from "../assests/stud-login.png";
import Devlogo from "../assests/Devlogo.png";

import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "@/hooks/use-toast";

/* ---------------- TYPES ---------------- */

type FormDataType = {
  name: string;
  email: string;
  phone: string;
  country: string;
  educational_status: string;
  qualification: string;
  passedout_year: string;
  interest: string;
  state: string;
  city: string;
  college_name: string;
};

type ErrorsType = {
  [key: string]: string;
};

type CollegesType = {
  id: number;
  name: string;
};

/* ---------------- INITIAL STATE ---------------- */

const initialFormData: FormDataType = {
  name: "",
  email: "",
  phone: "",
  country: "",
  educational_status: "",
  qualification: "",
  passedout_year: "",
  interest: "",
  state: "",
  city: "",
  college_name: "",
};

const RegistrationPage: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const [otpError, setOtpError] = useState<string>("");
  const [error, setError] = useState<string>("");

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

  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [colleges, setColleges] = useState<CollegesType[]>([]);
  const [errors, setErrors] = useState<ErrorsType>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const qualifications: string[] = [
    "B.Tech",
    "B.E",
    "B.Sc",
    "B.Com",
    "B.A",
    "BBA",
    "BA LLB",
    "BCA",
    "MBBS",
    "BDS",
    "B.Pharm",
    "B.Des",
    "BFA",
    "BHM",
    "M.Tech",
    "M.E",
    "M.Sc",
    "M.Com",
    "M.A",
    "MBA",
    "LLM",
    "MCA",
    "MD",
    "MS",
    "MFA",
    "PhD",
  ];

  /* ---------------- EFFECTS ---------------- */

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

  useEffect(() => {
    fetch("https://api.devtalent.securxperts.com:8000/admin/colleges")
      .then((r) => r.json())
      .then((data: CollegesType[]) => setColleges(data));
  }, []);

  /* ---------------- HELPERS ---------------- */

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* ---------------- OTP STYLES ---------------- */
  const otpOverlay = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

  const otpCard = {
    backgroundColor: "white",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "90%",
  };

  const otpTitle = {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "8px",
    textAlign: "center" as const,
  };

  const otpSub = {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "24px",
    textAlign: "center" as const,
  };

  const otpRow = {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "24px",
  };

  const otpBox = {
    width: "45px",
    height: "45px",
    border: "2px solid #d1d5db",
    borderRadius: "8px",
    textAlign: "center" as const,
    fontSize: "18px",
    fontWeight: "600",
    outline: "none",
    transition: "all 0.2s",
  };

  const otpActive = {
    borderColor: "#6366f1",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
  };

  const resendBtn = {
    background: "transparent",
    border: "none",
    color: "#6366f1",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  };

  const timerText = {
    color: "#6b7280",
    fontSize: "14px",
    marginLeft: "8px",
  };

  const otpSubmit = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  };

  /* ---------------- VALIDATION ---------------- */

  const validateField = (name: keyof FormDataType): boolean => {
    let msg = "";
    const v = formData[name];

    if (name === "passedout_year") {
      const currentYear = new Date().getFullYear();
      const maxYear = currentYear + 3;
      const yearNum = parseInt(v);
      
      if (!/^\d{4}$/.test(v)) {
        msg = "Passed out year must be exactly 4 digits";
      } else if (yearNum > maxYear) {
        msg = `Year cannot be more than ${maxYear} (current year + 3)`;
      }
    }

    if (!v || v.trim() === "") {
      msg = "This field is required";
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(v)) {
        msg = "Enter valid email address";
      }
    }

    if (name === "phone" && !/^\d{10}$/.test(v)) {
      msg = "Phone number must be exactly 10 digits";
    }

    setErrors((p) => ({ ...p, [name]: msg }));
    return !msg;
  };

  const validateStep = (fields: (keyof FormDataType)[]): boolean => {
    let valid = true;
    const t = { ...touched };
    const e = { ...errors };

    fields.forEach((f) => {
      t[f] = true;

      if (!formData[f] || formData[f].trim() === "") {
        e[f] = "This field is required";
        valid = false;
      }

      if (f === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          e.email = "Enter valid email address";
          valid = false;
        }
      }
    });

    setTouched(t);
    setErrors(e);
    return valid;
  };

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "email" && value.length > 50) return;

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setFormData({ ...formData, phone: value });
      setErrors({ ...errors, phone: "" });
    }
  };

  const handleYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setFormData({ ...formData, passedout_year: value });
      setErrors({ ...errors, passedout_year: "" });
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const valid = validateStep([
      "name",
      "email",
      "phone",
      "country",
      "educational_status",
      "qualification",
      "passedout_year",
      "college_name",
      "state",
      "city",
      "interest",
    ]);

    if (!valid) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://api.devtalent.securxperts.com:8000/auth/register/start",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();
      console.log("API RESPONSE:", data); // 👈 DEBUG

      if (res.ok) {
        setStep(2);
        setOtpTimer(120);
        setShowOtpModal(true);
      } else {
        // 👇 Extract message safely
        const message =
          data?.message ||
          data?.detail ||
          data?.error ||
          (Array.isArray(data?.email) ? data.email[0] : "");

        // 👇 Detect email error
        if (message.toLowerCase().includes("email")) {
          setErrors((prev) => ({
            ...prev,
            email: message || "Email already registered",
          }));

          setTouched((prev) => ({
            ...prev,
            email: true,
          }));

          setActiveTab(1);
        } else {
          setError(message || "Registration failed");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- OTP ---------------- */

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
    if (otpTimer > 0) return; // ⛔ prevent early click

    try {
      const res = await fetch(
        "https://api.devtalent.securxperts.com:8000/auth/register/start", // ✅ SAME AS CODE 1
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData), // ✅ send full form data
        },
      );

      if (res.ok) {
        // ✅ reset UI exactly like Code 1
        setOtpDigits(["", "", "", "", "", ""]);
        setOtpError("");
        setOtpTimer(120);

        // focus first input
        inputsRef.current[0]?.focus();

        toast({
          title: "Success",
          description: "OTP resent successfully!",
        });
      } else {
        const text = await res.text();

        toast({
          title: "Error",
          description: text || "Failed to resend OTP",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("RESEND ERROR:", err);

      setOtpError("Failed to resend OTP");

      toast({
        title: "Error",
        description: err.message || "Network error",
        variant: "destructive",
      });
    }
  };

  const handleVerify = async () => {
    if (!/^\d{6}$/.test(finalOtp)) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    try {
      const res = await fetch(
        "https://api.devtalent.securxperts.com:8000/auth/register/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            otp_code: finalOtp,
          }),
        },
      );

      if (res.ok) {
        setOtpSuccess(true);
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        setOtpError("Invalid OTP");
      }
    } catch {
      setOtpError("Network error");
    }
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtpDigits(["", "", "", "", "", ""]);
    setOtpTimer(120);
    setOtpSuccess(false);
  };

  /* ---------------- UI STYLES ---------------- */

  const inputUI = (err?: string) => ({
    width: "100%",
    height: "44px",
    borderRadius: "10px",
    border: err ? "1.5px solid #e74c3c" : "1.5px solid #ddd",
    padding: "0 14px",
    fontSize: "15px",
    outline: "none",
  });

  const errorText: React.CSSProperties = {
    color: "#e74c3c",
    fontSize: "13px",
    marginTop: "6px",
  };

  const otpCardNew = {
    background: "#f9fafb",
    padding: "40px 30px",
    borderRadius: "20px",
    width: "420px",
    maxWidth: "95%",
    textAlign: "center" as const,
    position: "relative" as const,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  };

  const closeBtn = {
    position: "absolute" as const,
    top: "12px",
    right: "16px",
    border: "none",
    background: "transparent",
    fontSize: "22px",
    cursor: "pointer",
    color: "#999",
  };

  const otpHeading = {
    fontSize: "32px",
    fontWeight: "700",
    color: "#7e22ce",
    marginBottom: "12px",
  };

  const otpSubText = {
    color: "#6b7280",
    fontSize: "18px",
    marginBottom: "4px",
  };

  const otpEmail = {
    fontWeight: "700",
    fontSize: "20px",
    marginBottom: "30px",
  };

  const otpContainer = {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    marginBottom: "30px",
  };

  const otpInputNew = {
    width: "45px",
    height: "55px",
    borderRadius: "12px",
    border: "2px solid #d1d5db",
    textAlign: "center" as const,
    fontSize: "20px",
    fontWeight: "600",
    outline: "none",
    transition: "all 0.2s",
    background: "#fff",
  };

  const otpActiveNew = {
    borderColor: "#7e22ce",
    boxShadow: "0 0 0 3px rgba(126,34,206,0.15)",
  };

  const otpFilled = {
    background: "linear-gradient(135deg, #7e22ce, #4f46e5)",
    color: "#fff",
    border: "none",
  };

  const resendLink = {
    background: "none",
    border: "none",
    color: "#7e22ce",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
    marginBottom: "10px",
  };

  const timerStyle = {
    fontSize: "26px",
    marginBottom: "30px",
    color: "#111",
  };

  const submitBtn = {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(90deg, #4f46e5, #7e22ce)",
    color: "#fff",
    fontSize: "20px",
    fontWeight: "600",
    cursor: "pointer",
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2edfe] to-white flex items-center px-4 sm:px-6 md:px-10 lg:px-12 overflow-x-hidden">
      {step === 3 ? (
        <div className="text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Registration Successful</h2>
          <p className="text-gray-600 mt-2">Redirecting…</p>
        </div>
      ) : (
        <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-center relative">
          {/* LEFT FORM */}
          <div className="relative w-full max-w-[590px] h-[650px] sm:h-[700px] lg:h-[750px] overflow-y-auto min-h-[600px] sm:min-h-[650px] flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 pt-16 sm:pt-14 lg:pt-16 xl:pt-20 py-6 sm:py-8 bg-white rounded-lg border-2 border-gray-200 transition-all duration-300 ">
            <img
              src={Devlogo}
              alt="Devlogo"
              className="
    absolute
    top-0 lg:top-2
    left-2 lg:left-8
    w-10 md:w-8 lg:w-12 xl:w-16
    z-20
  "
            />
            {/* HEADER */}
            <h2 className="text-3xl font-bold text-purple-700 mb-1">
              Register Now
            </h2>
            <p className="text-gray-500 mb-6">Fill your details to register</p>

            {/* TABS */}
            <div className="flex border-b mb-6 ">
              {[
                "Personal Information",
                "Educational Background",
                "Location & Interest",
              ].map((t, i) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTab(i + 1)}
                  className={`px-4 py-2 text-xs font-bold border-b-2 ${
                    activeTab === i + 1
                      ? "bg-[#F7F2FE] text-[#892EA7]"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg flex gap-2">
                <FaExclamationTriangle /> {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="flex flex-col flex-1">
              {/* PERSONAL */}
              {activeTab === 1 && (
                <>
                  <div className="flex-1 w-full overflow-x-hidden">
                    {["name", "email", "phone", "country"].map((f) => (
                      <div key={f} className="mb-5">
                        <label className="text-sm font-medium capitalize">
                          {f.replace("_", " ")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          name={f}
                          value={formData[f]}
                          onChange={
                            f === "phone" ? handlePhoneChange : handleChange
                          }
                          onBlur={() => validateField(f)}
                          style={inputUI(touched[f] && errors[f])}
                          className="focus:outline-none focus:ring-2 focus:ring-purple-400"
                          placeholder={
                            f === "name"
                              ? "Enter your full name"
                              : f === "email"
                                ? "Enter your email"
                                : f === "phone"
                                  ? "Enter your phone number"
                                  : "Enter your country"
                          }
                        />
                        {touched[f] && errors[f] && (
                          <div style={errorText}>{errors[f]}</div>
                        )}
                      </div>
                    ))}

                    <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(initialFormData);
                          setErrors({});
                          setTouched({});
                          setError(""); // 🔥 clear top error
                        }}
                        className="px-6 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        Reset Now
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          validateStep(["name", "email", "phone", "country"]) &&
                          setActiveTab(2)
                        }
                        className="px-8 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* EDUCATION */}
              {activeTab === 2 && (
                <>
                  <div className="flex-1">
                    {[
                      ["educational_status", "Educational Status"],
                      ["qualification", "Qualification"],
                      ["passedout_year", "Passed Out Year"],
                      ["college_name", "College / University"],
                    ].map(([key, label]) => (
                      <div key={key} className="mb-5">
                        <label className="text-sm font-medium">
                          {label} <span className="text-red-500">*</span>
                        </label>

                        {key === "qualification" || key === "college_name" ? (
                          <select
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            onBlur={() => validateField(key)}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            style={inputUI(touched[key] && errors[key])}
                          >
                            <option value="">
                              {key === "qualification"
                                ? "Select Qualification"
                                : "Select College"}
                            </option>
                            {key === "qualification"
                              ? qualifications.map((q) => (
                                  <option key={q}>{q}</option>
                                ))
                              : colleges.map((c) => (
                                  <option key={c.id}>{c.name}</option>
                                ))}
                          </select>
                        ) : (
                          <input
                            name={key}
                            value={formData[key]}
                            onChange={
                              key === "passedout_year"
                                ? handleYearChange
                                : handleChange
                            }
                            onBlur={() => validateField(key)}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            style={inputUI(touched[key] && errors[key])}
                            placeholder={key === "passedout_year" ? "YYYY" : ""}
                          />
                        )}

                        {touched[key] && errors[key] && (
                          <div style={errorText}>{errors[key]}</div>
                        )}
                      </div>
                    ))}

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-6">
                      {/* LEFT */}
                      <button
                        type="button"
                        onClick={() => setActiveTab(1)}
                        className="px-6 py-2 rounded-lg bg-blue-100 text-gray-600 hover:bg-blue-200"
                      >
                        ← Previous
                      </button>

                      {/* RIGHT */}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(initialFormData);
                            setErrors({});
                            setTouched({});
                            setError(""); // 🔥 clear top error
                            setActiveTab(1);
                          }}
                          className="px-6 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          Reset Now
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            validateStep([
                              "educational_status",
                              "qualification",
                              "passedout_year",
                              "college_name",
                            ]) && setActiveTab(3)
                          }
                          className="px-8 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* LOCATION */}
              {activeTab === 3 && (
                <>
                  <div className="flex-1 pb-6">
                    {["state", "city"].map((f) => (
                      <div key={f} className="mb-5">
                        <label className="text-sm font-medium capitalize">
                          {f} <span className="text-red-500">*</span>
                        </label>
                        <input
                          name={f}
                          value={formData[f]}
                          onChange={handleChange}
                          onBlur={() => validateField(f)}
                          style={inputUI(touched[f] && errors[f])}
                          className="focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        {touched[f] && errors[f] && (
                          <div style={errorText}>{errors[f]}</div>
                        )}
                      </div>
                    ))}

                    <div className="mb-6">
                      <label className="text-sm font-medium">
                        Interest <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="interest"
                        value={formData.interest}
                        onChange={handleChange}
                        onBlur={() => validateField("interest")}
                        style={inputUI(touched.interest && errors.interest)}
                      >
                        <option value="">Select Area of Interest</option>
                        <option>Technical</option>
                        <option>Non-Technical</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:items-center mb-2">
                      {/* LEFT */}
                      <button
                        type="button"
                        onClick={() => setActiveTab(2)}
                        className="px-6 py-2 rounded-lg bg-blue-100 text-gray-600 hover:bg-blue-200"
                      >
                        ← Previous
                      </button>

                      {/* RIGHT */}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(initialFormData);
                            setErrors({});
                            setTouched({});
                            setError(""); // 🔥 clear top error
                            setActiveTab(1);
                          }}
                          className="px-6 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          Reset Now
                        </button>

                        <button
                          type="submit"
                          disabled={loading}
                          className="px-8 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                        >
                          {loading ? "Registering..." : "Register"}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </form>
          </div>
          {/* RIGHT IMAGE */}
          <div className="hidden lg:flex w-[45%] relative h-[500px] lg:h-screen">
            <img
              src={Student}
              alt="Student"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      {showOtpModal && (
        <div style={otpOverlay}>
          <div style={otpCardNew}>
            {/* CLOSE */}
            <button onClick={handleCloseOtpModal} style={closeBtn}>
              ×
            </button>

            {!otpSuccess ? (
              <>
                {/* TITLE */}
                <h2 style={otpHeading}>Verify Your Email</h2>

                {/* SUBTEXT */}
                <p style={otpSubText}>We’ve sent a 6 digit OTP to</p>
                <p style={otpEmail}>{formData.email}</p>
                {/* OTP BOXES */}
                <div style={otpContainer}>
                  {otpDigits.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputsRef.current[i] = el!)}
                      value={d}
                      onChange={(e) => handleOtpBoxChange(e.target.value, i)}
                      onKeyDown={(e) => handleOtpBackspace(e, i)}
                      maxLength={1}
                      style={{
                        ...otpInputNew,
                        ...(i === otpDigits.findIndex((v) => v === "")
                          ? otpActiveNew
                          : {}),
                        ...(d ? otpFilled : {}),
                      }}
                    />
                  ))}
                </div>

                {otpError && <div style={errorText}>{otpError}</div>}

                {/* RESEND */}
                <button
                  onClick={handleResendOtp}
                  disabled={otpTimer !== 0}
                  style={{
                    ...resendLink,
                    opacity: otpTimer === 0 ? 1 : 0.5,
                  }}
                >
                  Resend OTP
                </button>

                {/* TIMER */}
                <div style={timerStyle}>{formatTime(otpTimer)}</div>

                {/* SUBMIT */}
                <button
                  onClick={handleVerify}
                  disabled={finalOtp.length !== 6}
                  style={{
                    ...submitBtn,
                    opacity: finalOtp.length !== 6 ? 0.6 : 1,
                  }}
                >
                  Submit
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-600">
                  Registration Successful
                </h2>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;
