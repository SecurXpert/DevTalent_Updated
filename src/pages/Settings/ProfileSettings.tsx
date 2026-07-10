import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiMapPin,
  FiShield,
  FiCamera,
  FiEdit2,
  FiCalendar,
  FiLock,
  FiMonitor,
  FiSmartphone,
  FiBell,
  FiSave,
  FiCheckCircle,
  FiClock,
  FiGlobe,
  FiUpload,
} from "react-icons/fi";
import { BASE_URL } from "../../lib/api";
import { PersonalInfo } from "../profileComponents";

const ProfileSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Personal Information");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Admin User",
    email: "admin@devtalent.com",
    phone: "",
    role: "Platform Administrator",
    location: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token =
          localStorage.getItem("adminToken") ||
          localStorage.getItem("access_token") ||
          localStorage.getItem("userToken");

        if (!token) return;

        const userRole = localStorage.getItem("userRole");
        let endpoint = `${BASE_URL}/auth/profile`;

        if (userRole === "super_admin") {
          endpoint = `${BASE_URL}/auth/profile`;
        } else if (userRole === "admin") {
          endpoint = `${BASE_URL}/auth/admin/profile`;
        }

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const locParts = [data.city, data.state, data.country].filter(Boolean);
          const locationVal = locParts.length > 0 ? locParts.join(", ") : "";

          setProfileData({
            fullName: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            role: data.role || "Platform Administrator",
            location: locationVal,
          });
        }
      } catch (error) {
        console.error("Error fetching profile in ProfileSettings:", error);
      }
    };

    fetchProfile();
  }, []);

  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    email: true,
    newStudent: true,
    examSubmissions: true,
    paymentUpdates: true,
    systemUpdates: false,
    weeklyReports: true,
  });

  const toggleNotification = (id: string) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const notificationSettings = [
    { id: 'email', title: 'Email Notifications', desc: 'Receive email updates about your account' },
    { id: 'newStudent', title: 'New Student Registrations', desc: 'Get notified when new students register' },
    { id: 'examSubmissions', title: 'Exam Submissions', desc: 'Alerts when students submit exams' },
    { id: 'paymentUpdates', title: 'Payment Updates', desc: 'Notifications about subscription payments' },
    { id: 'systemUpdates', title: 'System Updates', desc: 'Important platform updates and announcements' },
    { id: 'weeklyReports', title: 'Weekly Reports', desc: 'Weekly summary of platform activity' },
  ];

  const activities = [
    {
      id: 1,
      title: 'Created new exam "Advanced Data Structures"',
      time: '2 hours ago',
      ip: '192.168.1.1',
      icon: <FiCheckCircle size={20} />,
      colorClass: 'text-green-600 bg-green-50',
    },
    {
      id: 2,
      title: 'Updated student profile for "John Smith"',
      time: '5 hours ago',
      ip: '192.168.1.1',
      icon: <FiUser size={20} />,
      colorClass: 'text-blue-600 bg-blue-50',
    },
    {
      id: 3,
      title: 'Changed account password',
      time: '1 day ago',
      ip: '192.168.1.1',
      icon: <FiLock size={20} />,
      colorClass: 'text-purple-600 bg-purple-50',
    },
    {
      id: 4,
      title: 'Created new subscription plan "Enterprise Plus"',
      time: '2 days ago',
      ip: '192.168.1.1',
      icon: <FiBriefcase size={20} />,
      colorClass: 'text-indigo-600 bg-indigo-50',
    },
    {
      id: 5,
      title: 'Exported student results report',
      time: '3 days ago',
      ip: '192.168.1.1',
      icon: <FiUpload size={20} />,
      colorClass: 'text-yellow-600 bg-yellow-50',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profile Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Top Gradient Bar */}
        <div className="h-14 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center px-6">
          <h2 className="text-white text-lg font-semibold tracking-wide">{profileData.fullName}</h2>
        </div>

        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <FiUser size={48} />
              </div>
              <button className="absolute -bottom-2 -right-2 bg-white p-2.5 rounded-xl shadow-md border border-gray-100 text-purple-600 hover:bg-gray-50 transition-colors">
                <FiCamera size={16} />
              </button>
            </div>

            {/* Info */}
            <div>
              <h3 className="text-xl text-slate-700 font-medium mb-3">{profileData.role}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-slate-500 text-sm">
                <div className="flex items-center gap-2">
                  <FiMail size={16} />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar size={16} />
                  <span>Joined March 2026</span>
                </div>
              </div>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => {
                if ((window as any).triggerPersonalInfoEdit) {
                  (window as any).triggerPersonalInfoEdit();
                  setIsEditing(true);
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm self-start sm:self-auto"
            >
              <FiEdit2 size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Tabs & Form Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-100 mb-8 overflow-x-auto scrollbar-hide">
          {["Personal Information", "Security", "Notifications", "Activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-medium pb-4 border-b-2 whitespace-nowrap transition-colors ${activeTab === tab
                ? "text-purple-600 border-purple-600"
                : "text-slate-500 hover:text-slate-700 border-transparent"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form Grid */}
        {activeTab === "Personal Information" && (
          <PersonalInfo
            initialData={profileData}
            onUpdate={(newData) => {
              setProfileData(newData);
            }}
            onEditingChange={(isEdit) => {
              setIsEditing(isEdit);
            }}
          />
        )}

        {activeTab === "Security" && (
          <div className="space-y-6">
            {/* Change Password Card */}
            <div className="border border-gray-200 rounded-xl p-6 bg-slate-50/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <FiLock size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Change Password</h3>
                  <p className="text-slate-500 text-sm">Update your password regularly to keep your account secure</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Re-enter new password"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                    Update Password
                  </button>
                </div>
              </div>
            </div>

            {/* Two-Factor Authentication Card */}
            <div className="border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <FiShield size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Two-Factor Authentication</h3>
                  <p className="text-slate-500 text-sm">Add an extra layer of security to your account</p>
                </div>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
                Enable 2FA
              </button>
            </div>

            {/* Active Sessions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Active Sessions</h3>

              <div className="border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                    <FiMonitor size={24} />
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-slate-800">MacBook Pro - Chrome</h4>
                    <p className="text-slate-500 text-sm">San Francisco, CA • Active now</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-medium">
                  Current
                </span>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
                    <FiSmartphone size={24} />
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-slate-800">iPhone 15 - Safari</h4>
                    <p className="text-slate-500 text-sm">San Francisco, CA • 2 hours ago</p>
                  </div>
                </div>
                <button className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors">
                  Revoke
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Notifications" && (
          <div className="space-y-4">
            {notificationSettings.map((setting) => (
              <div
                key={setting.id}
                className="border border-gray-200 rounded-xl p-5 flex items-center justify-between bg-white transition-colors hover:bg-gray-50/50"
              >
                <div className="flex items-center gap-4">
                  <div className="text-slate-400">
                    <FiBell size={20} />
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-slate-800">{setting.title}</h3>
                    <p className="text-slate-500 text-sm mt-0.5">{setting.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleNotification(setting.id)}
                  className={`w-11 h-6 rounded-full flex items-center transition-colors px-1 ${notifications[setting.id] ? "bg-purple-600" : "bg-gray-200"
                    }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications[setting.id] ? "translate-x-5" : "translate-x-0"
                      }`}
                  />
                </button>
              </div>
            ))}

            <div className="flex justify-end pt-6 mt-4 border-t border-gray-100">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm">
                <FiSave size={16} />
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {activeTab === "Activity" && (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="border border-gray-200 rounded-xl p-5 flex items-start gap-4 bg-white"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.colorClass}`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-md font-medium text-slate-800 mb-1">{activity.title}</h4>
                  <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm">
                    <div className="flex items-center gap-1.5">
                      <FiClock size={14} />
                      <span>{activity.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiGlobe size={14} />
                      <span>IP: {activity.ip}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 flex justify-center">
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors px-4 py-2">
                Load More Activity
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
