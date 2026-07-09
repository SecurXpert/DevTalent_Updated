import React from "react";

interface PurchasedPlanDropdownProps {
  allSubscriptions: any[];
  selectedSubscription: any;
  setSelectedSubscription: (sub: any) => void;
}

export const PurchasedPlanDropdown: React.FC<PurchasedPlanDropdownProps> = ({
  allSubscriptions,
  selectedSubscription,
  setSelectedSubscription,
}) => {
  return (
    <div className="max-w-md mx-auto mb-16">
      <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
        Select Purchased Plan
      </label>
      <div className="relative">
        <select
          value={selectedSubscription?.subscription_id || ""}
          onChange={(e) => {
            const selected = allSubscriptions.find(
              (sub) => String(sub.subscription_id) === e.target.value
            );
            if (selected) setSelectedSubscription(selected);
          }}
          className="w-full py-4 px-5 rounded-2xl border-2 border-gray-200 bg-white text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 appearance-none shadow-sm font-medium text-lg transition-all"
        >
          {allSubscriptions.length === 0 && (
            <option value="">No active plans</option>
          )}
          {allSubscriptions.map((sub, idx) => (
            <option
              key={sub.subscription_id || idx}
              value={sub.subscription_id}
            >
              {sub.plan_name || "Unnamed Plan"} - {sub.plan_type || "Unknown Type"}
            </option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-6 h-6 text-indigo-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
