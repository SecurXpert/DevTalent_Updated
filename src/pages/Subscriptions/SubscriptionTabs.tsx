import React from "react";

type SubscriptionTabsProps = {
  activeTab: "plans" | "active";
  onTabChange: (tab: "plans" | "active") => void;
};

const SubscriptionTabs: React.FC<SubscriptionTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-1 border-b border-slate-200 px-4">
      <button
        type="button"
        onClick={() => onTabChange("plans")}
        className={`relative px-4 py-4 text-sm font-medium transition ${
          activeTab === "plans"
            ? "text-indigo-600"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Plans Management
        {activeTab === "plans" && (
          <span className="absolute inset-x-0 bottom-0 h-[2px] bg-indigo-600" />
        )}
      </button>
      <button
        type="button"
        onClick={() => onTabChange("active")}
        className={`relative px-4 py-4 text-sm font-medium transition ${
          activeTab === "active"
            ? "text-indigo-600"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Active Subscriptions
        {activeTab === "active" && (
          <span className="absolute inset-x-0 bottom-0 h-[2px] bg-indigo-600" />
        )}
      </button>
    </div>
  );
};

export default SubscriptionTabs;
