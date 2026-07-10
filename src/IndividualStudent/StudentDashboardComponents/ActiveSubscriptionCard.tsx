import React from "react";
import { Crown, Download } from "lucide-react";

interface ActiveSubscriptionCardProps {
  subscription: any;
}

export const ActiveSubscriptionCard: React.FC<ActiveSubscriptionCardProps> = ({ subscription }) => {
  // Mock data or extract from subscription
  const planName = subscription?.plan_name || "Dual Course Plan";
  const coursesList = subscription?.selected_courses && subscription.selected_courses.length > 0
    ? subscription.selected_courses.map((c: any) => c.course_name || "Technical").join(", ")
    : "Course Not Selected";

  const endAt = subscription?.end_at ? new Date(subscription.end_at) : new Date("2026-06-29");

  // Calculate remaining days
  const today = new Date();
  const timeDiff = endAt.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

  const formattedDate = endAt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  const status = subscription?.status || "Active";

  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
      {/* Header section */}
      <div className="bg-[#fcfaff] px-5 py-4 flex justify-between items-center border-b border-purple-100">
        <div className="flex items-center gap-2">
          <Crown className="text-orange-500 w-6 h-6 fill-orange-500" />
          <h2 className="text-[#6b21a8] text-lg font-semibold">Active Subscription</h2>
        </div>
        {/* <button className="flex items-center gap-1.5 text-sm font-medium hover:text-purple-700 transition-colors">
          <Download className="text-purple-700 w-4 h-4" />
          <span>Download Invoice</span>
        </button> */}
      </div>

      {/* Body section */}
      <div className="bg-[#f3e8ff] px-5 py-5 space-y-3">
        <div className="text-base">
          <span className="text-gray-500">Plan: </span>
          <span className="font-semibold text-gray-900">{planName}</span>
        </div>

        <div className="text-base">
          <span className="text-gray-500">Cources: </span>
          <span className={`font-medium ${coursesList === "Course Not Selected" ? "text-red-500" : "text-gray-900"}`}>
            {coursesList}
          </span>
        </div>

        <div className="text-base flex items-center gap-2">
          <div>
            <span className="text-gray-500">Validity : </span>
            <span className="font-semibold text-emerald-500">{daysRemaining} days remaining</span>
          </div>
          <span className="text-gray-500 text-sm">Expires: {formattedDate}</span>
        </div>

        <div className="text-base">
          <span className="text-gray-500">Status : </span>
          <span className="font-bold text-emerald-500 capitalize">{status}</span>
        </div>
      </div>
    </div>
  );
};
