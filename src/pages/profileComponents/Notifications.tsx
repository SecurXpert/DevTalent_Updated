import { useState } from 'react';
import { FiSave } from "react-icons/fi";
import NotificationRow from './NotificationRow';
import { NotificationSettings } from './types';

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    newStudentRegistrations: true,
    examSubmissions: true,
    paymentUpdates: true,
    systemUpdates: false,
    weeklyReports: true,
  });

  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-4">
      <NotificationRow
        title="Email Notifications"
        subtitle="Receive email updates about your account"
        checked={notifications.emailNotifications}
        onToggle={() => toggleNotification("emailNotifications")}
      />
      <NotificationRow
        title="New Student Registrations"
        subtitle="Get notified when new students register"
        checked={notifications.newStudentRegistrations}
        onToggle={() => toggleNotification("newStudentRegistrations")}
      />
      <NotificationRow
        title="Exam Submissions"
        subtitle="Alerts when students submit exams"
        checked={notifications.examSubmissions}
        onToggle={() => toggleNotification("examSubmissions")}
      />
      <NotificationRow
        title="Payment Updates"
        subtitle="Notifications about subscription payments"
        checked={notifications.paymentUpdates}
        onToggle={() => toggleNotification("paymentUpdates")}
      />
      <NotificationRow
        title="System Updates"
        subtitle="Important platform updates and announcements"
        checked={notifications.systemUpdates}
        onToggle={() => toggleNotification("systemUpdates")}
      />
      <NotificationRow
        title="Weekly Reports"
        subtitle="Weekly summary of platform activity"
        checked={notifications.weeklyReports}
        onToggle={() => toggleNotification("weeklyReports")}
      />

      <div className="ormal mt-5 border-t border-[#eceff4] flex justify-end">
        <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5f63f7] to-[#8d18f2] px-4 py-2 text-white font-medium shadow-lg hover:opacity-95">
          <FiSave className="text-[18px]" />
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default Notifications;
