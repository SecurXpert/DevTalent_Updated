import React from "react";
import { FiUser } from "react-icons/fi";

interface ProfileSidebarProps {
  form: {
    fullName: string;
    email: string;
  };
  dashboardSummary: any;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ form, dashboardSummary }) => {
  return (
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
            <span className="text-green-500">{dashboardSummary?.exams_completed || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Active Subscriptions</span>
            <span className="text-purple-600">{dashboardSummary?.active_subscriptions || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Certificates Earned</span>
            <span className="text-yellow-500">{dashboardSummary?.certificates_earned || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Member Since</span>
            <span>
              {dashboardSummary?.registered_date
                ? new Date(dashboardSummary.registered_date).toLocaleDateString('en-GB')
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
