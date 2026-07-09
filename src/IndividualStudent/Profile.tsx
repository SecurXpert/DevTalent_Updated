import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "@/pages/Services/api/api";

import { ProfileHeader } from "./ProfileComponents/ProfileHeader";
import { ProfileSidebar } from "./ProfileComponents/ProfileSidebar";
import { ProfileInfoTab } from "./ProfileComponents/ProfileInfoTab";
import { SubscriptionTab } from "./ProfileComponents/SubscriptionTab";
import { SecurityTab } from "./ProfileComponents/SecurityTab";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  college: string;
};

type TabType = "profile" | "subscription" | "security";

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

  const [recentActivity, setRecentActivity] = useState<any>(null);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
        if (!token) return;
        const response = await fetch(`${API_BASE_URL}/student/scorecard/recent-activity?limit=1`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setRecentActivity(data[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching recent activity:", err);
      }
    };
    fetchRecentActivity();
  }, []);

  const [dashboardSummary, setDashboardSummary] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
        if (!token) return;
        const response = await fetch(`${API_BASE_URL}/student/scorecard/dashboard-summary`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setDashboardSummary(data);
        }
      } catch (err) {
        console.error("Error fetching dashboard summary:", err);
      }
    };
    fetchDashboardSummary();
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
            let subs: any[] = [];
            if (Array.isArray(data)) {
              subs = data;
            } else if (data && Array.isArray(data.items)) {
              subs = data.items;
            } else if (data && Array.isArray(data.data)) {
              subs = data.data;
            } else if (data && Object.keys(data).length > 0) {
              subs = [data];
            }

            if (subs.length > 0) {
              const activeSubs = subs.filter((s: any) => s.status === 'active' || s.status === 'Success');
              const targetSubs = activeSubs.length > 0 ? activeSubs : subs;
              targetSubs.sort((a: any, b: any) => new Date(a.end_at).getTime() - new Date(b.end_at).getTime());

              const storedPlanId = localStorage.getItem("selectedPlanId");
              let sub = targetSubs[0];
              if (storedPlanId) {
                const matched = targetSubs.find((s: any) => String(s.subscription_id) === String(storedPlanId));
                if (matched) sub = matched;
              }

              latestSubIndex = subs.indexOf(sub) >= 0 ? subs.indexOf(sub) : 0;
              latestSub = sub;
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
              let historyArray: any[] = [];
              if (Array.isArray(payments)) {
                historyArray = payments;
              } else if (payments && Array.isArray(payments.items)) {
                historyArray = payments.items;
              } else if (payments && Array.isArray(payments.data)) {
                historyArray = payments.data;
              } else if (payments && Object.keys(payments).length > 0) {
                historyArray = [payments];
              }

              // Find matching payment by ID first
              let matchingPayment = historyArray.find((p: any) => {
                const pSubId = p.subscription_id || p.subscriptionId || p.sub_id;
                const pPlanId = p.plan_id || p.planId;
                return (
                  (pSubId && Number(pSubId) === Number(latestSub.subscription_id)) ||
                  (pPlanId && Number(pPlanId) === Number(latestSub.plan_id))
                );
              });

              // Fallback: Match by closest timestamp (created_at vs start_at) within 5 minutes
              if (!matchingPayment && latestSub.start_at) {
                const subTime = new Date(latestSub.start_at).getTime();
                let minDiff = Infinity;
                for (const p of historyArray) {
                  if (p.created_at) {
                    const payTime = new Date(p.created_at).getTime();
                    const diff = Math.abs(subTime - payTime);
                    if (diff < 300000 && diff < minDiff) {
                      minDiff = diff;
                      matchingPayment = p;
                    }
                  }
                }
              }

              // Absolute fallback
              if (!matchingPayment) {
                matchingPayment = historyArray[0];
              }

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
      <ProfileHeader />

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6">
        <ProfileSidebar form={form} dashboardSummary={dashboardSummary} />

        <div className="col-span-12 md:col-span-8">
          <div className="bg-gray-200 rounded-full p-1 flex text-sm mb-4">
            {(["profile", "subscription", "security"] as TabType[]).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-full capitalize transition ${
                    activeTab === tab && "bg-white shadow font-medium"
                  }`}
                >
                  {tab}
                </button>
              ),
            )}
          </div>

          {activeTab === "profile" && (
            <ProfileInfoTab
              form={form}
              handleChange={handleChange}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              handleSaveProfile={handleSaveProfile}
              courses={courses}
              toggleCourse={toggleCourse}
            />
          )}

          {activeTab === "subscription" && (
            <SubscriptionTab
              subscriptionData={subscriptionData}
              paymentAmount={paymentAmount}
              handleViewPayments={handleViewPayments}
              handleUpgradePlan={handleUpgradePlan}
            />
          )}

          {activeTab === "security" && (
            <SecurityTab
              recentActivity={recentActivity}
              handleLogout={handleLogout}
              showPasswordFields={showPasswordFields}
              handleChangePassword={handleChangePassword}
              passwordData={passwordData}
              handlePasswordChange={handlePasswordChange}
              showPasswords={showPasswords}
              togglePasswordVisibility={togglePasswordVisibility}
              passwordErrors={passwordErrors}
              passwordSuccess={passwordSuccess}
              handlePasswordSubmit={handlePasswordSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
