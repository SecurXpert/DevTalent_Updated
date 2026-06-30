import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "@/pages/Services/api/api";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBookOpen,
  FiEdit2,
  FiCreditCard,
  FiShield,
  FiLock,
  FiLogOut,
  FiActivity,
  FiArrowLeft,
  FiHome,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

/* ================= TYPES ================= */

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  college: string;
};

type TabType = "profile" | "subscription" | "security";

/* ================= INPUT ================= */

const InputField = ({
  label,
  name,
  value,
  icon,
  disabled,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <p className="text-gray-500 mb-1 text-sm flex items-center gap-2">
      <span className="text-purple-600">{icon}</span>
      {label}
    </p>
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3">
      <input
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className="w-full py-2 bg-transparent outline-none text-sm"
      />
    </div>
  </div>
);

/* ================= MAIN ================= */

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get initial tab from navigation state, default to "profile"
  const initialTab = (location.state as { tab?: TabType })?.tab || "profile";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [isEdit, setIsEdit] = useState(false);

  const [courses, setCourses] = useState<string[]>([
    "Technical",
    "Non-Technical",
  ]);

  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    college: "",
  });

  React.useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
        if (!token) return;

        let studentId = "";
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          studentId = String(payload.user_id || payload.id || payload.candidate_id || payload.sub || "");
        } catch (e) {
          console.error("Error decoding token for student ID", e);
        }

        if (!studentId) return;

        const response = await fetch(`${API_BASE_URL}/student/students/${studentId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setForm({
            fullName: data.full_name || "",
            email: data.email_id || "",
            phone: data.phone_number || "",
            college: data.college_name || "",
          });
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
      }
    };

    fetchStudentProfile();
  }, []);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordErrors, setPasswordErrors] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= BUTTON ACTIONS ================= */

  const handleSaveProfile = () => {
    console.log("Profile Saved", form);
    setIsEdit(false);
    alert("Profile Updated Successfully ✅");
  };

  const toggleCourse = (course: string) => {
    if (courses.includes(course)) {
      setCourses(courses.filter((c) => c !== course));
    } else {
      setCourses([...courses, course]);
    }
  };

  const handleViewPayments = () => {
    navigate("/payments", { state: { from: "profile" } });
    window.scrollTo(0, 0);
  };
  const handleUpgradePlan = () => {
    navigate("/certificate", { state: { from: "profile" } });
    window.scrollTo(0, 0);
  };
  const handleChangePassword = () => setShowPasswordFields(!showPasswordFields);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/individual");
    window.scrollTo(0, 0);
  };

  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  React.useEffect(() => {
    if (activeTab === "subscription") {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");

          let latestSub = null;
          let latestSubIndex = 0;

          // 1. Fetch Subscription
          const subRes = await fetch(`${API_BASE_URL}/student/subscription/current`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          if (subRes.ok) {
            const data = await subRes.json();
            if (Array.isArray(data)) {
              if (data.length > 0) {
                let earliestSub = data[0];
                let earliestIndex = 0;

                for (let i = 1; i < data.length; i++) {
                  const currentSub = data[i];
                  if (currentSub.end_at && earliestSub.end_at) {
                    if (new Date(currentSub.end_at).getTime() < new Date(earliestSub.end_at).getTime()) {
                      earliestSub = currentSub;
                      earliestIndex = i;
                    }
                  } else if (currentSub.end_at && !earliestSub.end_at) {
                    earliestSub = currentSub;
                    earliestIndex = i;
                  }
                }

                latestSubIndex = earliestIndex;
                latestSub = earliestSub;
                setSubscriptionData(latestSub);
              }
            } else if (data) {
              latestSub = data;
              setSubscriptionData(latestSub);
            }
          }

          // 2. Fetch Payment History
          if (latestSub) {
            const payRes = await fetch(`${API_BASE_URL}/student/payments/history`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            });
            if (payRes.ok) {
              const payments = await payRes.json();
              const historyArray = Array.isArray(payments) ? payments : (payments ? [payments] : []);

              // Find matching payment
              const matchingPayment = historyArray.find((p: any) => {
                const pSubId = p.subscription_id || p.subscriptionId || p.sub_id;
                const pPlanId = p.plan_id || p.planId;
                return (
                  (pSubId && Number(pSubId) === Number(latestSub.subscription_id)) ||
                  (pPlanId && Number(pPlanId) === Number(latestSub.plan_id))
                );
              }) || historyArray[latestSubIndex] || historyArray[0];

              if (matchingPayment && matchingPayment.amount) {
                setPaymentAmount(matchingPayment.amount);
              } else if (latestSub.amount) {
                setPaymentAmount(latestSub.amount);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [activeTab]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (passwordErrors[name as keyof typeof passwordErrors]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePasswordForm = () => {
    const newErrors = { current: "", new: "", confirm: "" };
    let isValid = true;

    if (!passwordData.currentPassword) {
      newErrors.current = "Current password is required";
      isValid = false;
    }

    if (!passwordData.newPassword) {
      newErrors.new = "New password is required";
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      newErrors.new = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirm = "Please confirm your new password";
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirm = "Passwords do not match";
      isValid = false;
    }

    setPasswordErrors(newErrors);
    return isValid;
  };

  const handlePasswordSubmit = async () => {
    setPasswordSuccess("");

    if (validatePasswordForm()) {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");

        const response = await fetch(`${API_BASE_URL}/student/change-password`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            old_password: passwordData.currentPassword,
            new_password: passwordData.newPassword
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || "Failed to change password");
        }

        // Reset form and show success
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordSuccess("Password changed successfully! Redirecting to login...");
        setShowPasswordFields(false);

        // Clear tokens and redirect after 2 seconds
        setTimeout(() => {
          handleLogout();
        }, 2000);
      } catch (error: any) {
        console.error("Error changing password:", error);
        setPasswordErrors((prev) => ({ ...prev, current: error.message }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white p-8">
        <p
          onClick={() => {
            navigate("/StudentDashboard");
            window.scrollTo(0, 0);
          }}
          className="text-sm cursor-pointer flex items-center gap-2"
        >
          <FiArrowLeft /> Back to Dashboard
        </p>
        <h1 className="text-2xl font-semibold mt-2">Profile & Settings</h1>
        <p className="text-sm opacity-80">
          Manage your account and preferences
        </p>
      </div>

      {/* BODY */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6">
        {/* LEFT PROFILE CARD */}
        <div className="col-span-12 md:col-span-4 space-y-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl">
              <FiUser />
            </div>
            <h2 className="mt-3 font-semibold">{form.fullName}</h2>
            <p className="text-gray-500 text-sm">{form.email}</p>
            <span className="mt-3 inline-block text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
              Active Member
            </span>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Exams Completed</span>
                <span className="text-green-500">0</span>
              </div>
              <div className="flex justify-between">
                <span>Active Courses</span>
                <span className="text-purple-600">{courses.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Certificates Earned</span>
                <span className="text-yellow-500">2</span>
              </div>
              <div className="flex justify-between">
                <span>Member Since</span>
                <span>14/02/2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="col-span-12 md:col-span-8">
          {/* TABS */}
          <div className="bg-gray-200 rounded-full p-1 flex text-sm mb-4">
            {(["profile", "subscription", "security"] as TabType[]).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-full capitalize transition ${activeTab === tab && "bg-white shadow font-medium"
                    }`}
                >
                  {tab}
                </button>
              ),
            )}
          </div>

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Personal Information</h3>
                <button
                  onClick={() => setIsEdit(!isEdit)}
                  className="bg-purple-600 text-white px-4 py-1 rounded-lg text-sm flex items-center gap-1"
                >
                  <FiEdit2 /> {isEdit ? "Cancel" : "Edit"}
                </button>
              </div>

              <InputField
                label="Full Name"
                name="fullName"
                value={form.fullName}
                disabled={!isEdit}
                onChange={handleChange}
                icon={<FiUser />}
              />

              <InputField
                label="Email ID"
                name="email"
                value={form.email}
                disabled
                icon={<FiMail />}
              />

              <InputField
                label="Phone Number"
                name="phone"
                value={form.phone}
                disabled={!isEdit}
                onChange={handleChange}
                icon={<FiPhone />}
              />

              <InputField
                label="College Name"
                name="college"
                value={form.college}
                disabled={!isEdit}
                onChange={handleChange}
                icon={<FiHome />}
              />

              {/* COURSE BUTTONS */}
              <div>
                {/* TITLE WITH ICON */}
                <div className="flex items-center gap-2 mb-2">
                  <FiBookOpen className="text-purple-600" />
                  <p className="text-gray-500 text-sm">Courses Opted</p>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-2">
                  {["Technical", "Non-Technical"].map((c) => (
                    <button
                      key={c}
                      onClick={() => toggleCourse(c)}
                      className={`px-3 py-1 text-xs rounded-full border transition ${courses.includes(c)
                        ? "bg-purple-600 text-white"
                        : "bg-purple-100 text-purple-600"
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* HELP TEXT */}
                <p className="text-xs text-gray-400 mt-1">
                  To change courses, upgrade your subscription
                </p>
              </div>

              {isEdit && (
                <button
                  onClick={handleSaveProfile}
                  className="w-full bg-gradient-to-r from-purple-700 to-purple-600 text-white py-2 rounded-lg"
                >
                  💾 Save Changes
                </button>
              )}
            </div>
          )}

          {/* SUBSCRIPTION TAB */}
          {activeTab === "subscription" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <FiCreditCard /> Subscription Details
                </h3>

                {/* PLAN CARD */}
                <div className="bg-gradient-to-r from-purple-200 to-purple-300 rounded-xl p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{subscriptionData?.plan_name || (subscriptionData?.plan_id ? `Plan ID: ${subscriptionData.plan_id}` : 'No Active Plan')}</p>
                      <p className="text-xs text-gray-600">Current Plan</p>
                    </div>
                  </div>

                  {subscriptionData ? (
                    <div className="mt-4 text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Status</span>
                        <span className={`text-white text-xs px-2 py-1 rounded-full ${subscriptionData.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                          {subscriptionData.status || 'Active'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Validity</span>
                        <span>Until {subscriptionData.end_at ? new Date(subscriptionData.end_at).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>MCQ Exams</span>
                        <span>{subscriptionData.mcq_remaining ?? 0} / {subscriptionData.mcq_total ?? 0} Remaining</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coding Exams</span>
                        <span>{subscriptionData.coding_remaining ?? 0} / {subscriptionData.coding_total ?? 0} Remaining</span>
                      </div>
                      <div className="flex justify-between font-semibold text-purple-700">
                        <span>Amount Paid</span>
                        <span>₹{paymentAmount}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 text-sm text-gray-600">
                      No subscription found.
                    </div>
                  )}
                </div>

                <button
                  onClick={handleViewPayments}
                  className="w-full border rounded-lg py-2 text-sm mt-4 bg-gray-50"
                >
                  View Payment History
                </button>

                <button
                  onClick={handleUpgradePlan}
                  className="w-full bg-yellow-500 text-white rounded-lg py-2 mt-2"
                >
                  🔒 Upgrade Plan
                </button>
              </div>

              {/* EXAM HISTORY */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <FiActivity /> Exam History
                </h3>

                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Total Exams</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed</span>
                    <span className="text-green-500">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending</span>
                    <span className="text-yellow-500">0</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}

          {activeTab === "security" && (
            <div className="bg-white rounded-xl shadow p-6 space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <FiShield /> Security Settings
              </h3>

              {/* PASSWORD CARD */}
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="font-medium">Password</p>
                <p className="text-sm text-gray-500">
                  Keep your account secure by using a strong password
                </p>

                <button
                  onClick={handleChangePassword}
                  className="mt-3 w-full border rounded-lg py-2 flex items-center justify-center gap-2 bg-white"
                >
                  {showPasswordFields ? "Cancel" : "Change Password"}
                </button>

                {/* Password Change Form */}
                {showPasswordFields && (
                  <div className="mt-4 space-y-3">
                    {/* Current Password */}
                    <div>
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1 mb-1">
                        <FiLock className="w-3 h-3 text-purple-600" />
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter current password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("current")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? (
                            <FiEyeOff className="w-4 h-4" />
                          ) : (
                            <FiEye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.current && (
                        <p className="text-red-500 text-xs mt-1">
                          {passwordErrors.current}
                        </p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1 mb-1">
                        <FiLock className="w-3 h-3 text-purple-600" />
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter new password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("new")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? (
                            <FiEyeOff className="w-4 h-4" />
                          ) : (
                            <FiEye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.new && (
                        <p className="text-red-500 text-xs mt-1">
                          {passwordErrors.new}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1 mb-1">
                        <FiLock className="w-3 h-3 text-purple-600" />
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Confirm new password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? (
                            <FiEyeOff className="w-4 h-4" />
                          ) : (
                            <FiEye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.confirm && (
                        <p className="text-red-500 text-xs mt-1">
                          {passwordErrors.confirm}
                        </p>
                      )}
                    </div>

                    {/* Success Message */}
                    {passwordSuccess && (
                      <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm">
                        {passwordSuccess}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={handlePasswordSubmit}
                      className="w-full bg-gradient-to-r from-purple-700 to-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
                    >
                      Update Password
                    </button>
                  </div>
                )}
              </div>

              {/* ACCOUNT ACTIVITY */}
              <div className="bg-purple-50 rounded-lg p-4 text-sm">
                <p className="font-medium mb-2">Account Activity</p>
                <div className="flex justify-between">
                  <span>Last Login</span>
                  <span>Today at 10:30 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Device</span>
                  <span>Chrome on Windows</span>
                </div>
              </div>

              {/* DANGER ZONE */}
              <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                <p className="text-red-600 font-medium">Danger Zone</p>
                <p className="text-sm mb-2">
                  Permanently log out from all devices
                </p>

                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
