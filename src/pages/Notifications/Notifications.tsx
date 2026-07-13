import React, { useState } from "react";
import { FaBell, FaUsers, FaPaperPlane } from "react-icons/fa";
import NotificationHistory from "./NotificationHistory";

const Notifications: React.FC = () => {
  const [notificationType, setNotificationType] = useState("Exam reminder");
  const [sendTo, setSendTo] = useState("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(false);
  const [push, setPush] = useState(false);

  return (
    <div className="px-4 sm:px-6 py-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <p className="text-gray-500 mb-6">
        Send notifications and announcements to students
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Total Sent */}
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 rounded-xl bg-[#E0E7FF] text-[#4F39F6] flex-shrink-0">
            <FaBell className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-gray-500 text-sm sm:text-base">Total Sent</p>
            <h2 className="text-lg sm:text-xl font-semibold truncate">1,248</h2>
          </div>
        </div>

        {/* Total Recipients */}
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 rounded-xl bg-[#DCFCE7] text-[#00A63E] flex-shrink-0">
            <FaUsers className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-gray-500 text-sm sm:text-base">
              Total Recipients
            </p>
            <h2 className="text-lg sm:text-xl font-semibold truncate">2,847</h2>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 rounded-xl bg-[#DBEAFE] text-[#155DFC] flex-shrink-0">
            <FaPaperPlane className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-gray-500 text-sm sm:text-base">This Month</p>
            <h2 className="text-lg sm:text-xl font-semibold truncate">124</h2>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Send New Notification</h2>

        {/* Notification Type */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Notification Type</label>
          <select
            className="w-full border rounded-lg p-2"
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
          >
            <option>Exam reminder</option>
            <option>General announcement</option>
            <option>Assignment update</option>
          </select>
        </div>

        {/* Send To */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Send To</label>

          <div className="space-y-2 sm:space-y-3">
            <label className="flex items-center gap-2 sm:gap-3 border rounded-lg p-2 sm:p-3 cursor-pointer">
              <input
                type="radio"
                name="sendTo"
                checked={sendTo === "all"}
                onChange={() => setSendTo("all")}
                className="flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">All Students</p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Send to all registered students (2,847)
                </p>
              </div>
            </label>

            <label className="flex items-center gap-2 sm:gap-3 border rounded-lg p-2 sm:p-3 cursor-pointer">
              <input
                type="radio"
                name="sendTo"
                checked={sendTo === "course"}
                onChange={() => setSendTo("course")}
                className="flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">
                  Students by Course
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Filter students by specific course
                </p>
              </div>
            </label>

            <label className="flex items-center gap-2 sm:gap-3 border rounded-lg p-2 sm:p-3 cursor-pointer">
              <input
                type="radio"
                name="sendTo"
                checked={sendTo === "selected"}
                onChange={() => setSendTo("selected")}
                className="flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base">
                  Selected Students
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Manually select specific students
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Course Selection - appears when Students by Course is selected */}
        {sendTo === "course" && (
          <div className="mb-4">
            <label className="block text-sm mb-1">Select Course</label>
            <select className="w-full border rounded-lg p-2">
              <option>Choose a course</option>
              <option>Data Structures</option>
              <option>Web Development</option>
              <option>Database Systems</option>
              <option>Machine Learning</option>
            </select>
          </div>
        )}

        {/* Student Search Input - appears when Selected Students is selected */}
        {sendTo === "selected" && (
          <div className="mb-4">
            <label className="block text-sm mb-1">Select Students</label>
            <input
              type="text"
              placeholder="Search and select students..."
              className="w-full border rounded-lg p-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              Start typing to search for students by name or email
            </p>
          </div>
        )}

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Notification Title</label>
          <input
            type="text"
            placeholder="e.g., Exam Reminder - Data Structures Final"
            className="w-full border rounded-lg p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Message */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Message</label>
          <textarea
            className="w-full border rounded-lg p-3 h-32"
            placeholder="Enter your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Checkboxes */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={email}
              onChange={() => setEmail(!email)}
            />
            Send email notification
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={push}
              onChange={() => setPush(!push)}
            />
            Send push notification
          </label>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-2 rounded-lg shadow w-full sm:w-auto">
            Send Notification
          </button>

          <button className="border px-5 py-2 rounded-lg w-full sm:w-auto">
            Save as Draft
          </button>
        </div>
      </div>
      <NotificationHistory />
    </div>
  );
};

export default Notifications;
