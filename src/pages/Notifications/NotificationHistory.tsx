import React, { useState } from "react";
import NotificationDetailsModal from "./NotificationDetailsModal";

type NotificationItem = {
  id: number;
  title: string;
  type: string;
  message: string;
  audience: string;
  date: string;
};

const notifications: NotificationItem[] = [
  {
    id: 1,
    title: "Data Structures Final - Reminder",
    type: "Exam Reminder",
    message: "Your exam starts in 2 hours. Please be ready.",
    audience: "All Students (2,847)",
    date: "2026-03-12 08:00",
  },
  {
    id: 2,
    title: "New Exam Available: Machine Learning Basics",
    type: "Exam Announcement",
    message: "A new exam has been published. Check it out now!",
    audience: "Data Science Students (320)",
    date: "2026-03-11 14:30",
  },
  {
    id: 3,
    title: "System Maintenance Alert",
    type: "System Alert",
    message: "The platform will be under maintenance on March 15 from 2–4 AM.",
    audience: "All Students (2,847)",
    date: "2026-03-10 18:00",
  },
  {
    id: 4,
    title: "Results Published",
    type: "Result Notification",
    message: "Your exam results for Python Programming Quiz are now available.",
    audience: "Completed Students (67)",
    date: "2026-03-09 16:00",
  },
];

const NotificationHistory: React.FC = () => {
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (notification: NotificationItem) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  return (
    <div className=" py-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-2xl border shadow-sm">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold">
            Notification History
          </h2>
        </div>

        {/* List */}
        <div>
          {notifications.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-start p-4 sm:p-6 border-b last:border-none hover:bg-gray-50 transition gap-3 sm:gap-0"
            >
              {/* Left Content */}
              <div className="w-full sm:w-auto sm:max-w-3xl">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h3 className="text-base sm:text-lg font-medium">
                    {item.title}
                  </h3>

                  <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md self-start sm:self-auto">
                    {item.type}
                  </span>
                </div>

                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  {item.message}
                </p>

                <div className="text-sm text-gray-500 mt-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span>👥 {item.audience}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{item.date}</span>
                </div>
              </div>

              {/* Right */}
              <button
                onClick={() => handleViewDetails(item)}
                className="text-indigo-600 hover:underline whitespace-nowrap text-sm sm:text-base self-start sm:self-auto"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      <NotificationDetailsModal
        notification={selectedNotification}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default NotificationHistory;
