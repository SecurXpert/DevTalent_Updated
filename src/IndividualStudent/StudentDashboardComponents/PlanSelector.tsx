import React from "react";
import { Crown, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlanSelectorProps {
  subscription: any;
  setSubscription: (sub: any) => void;
  allSubscriptions: any[];
  setCourse: (course: string) => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  subscription,
  setSubscription,
  allSubscriptions,
  setCourse,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FAF8FC] rounded-2xl shadow-xl overflow-hidden border border-purple-50">
      {/* HEADER */}
      <div className="bg-white px-5 py-4 flex items-center gap-3">
        <Crown className="w-6 h-6 text-[#E58416]" />
        <h2 className="text-[#5B12A8] font-medium text-lg">Select plan</h2>
      </div>

      <div className="p-5 space-y-4">
        {/* SELECT DROPDOWN */}
        <div className="relative">
          <select
            value={subscription?.subscription_id || ""}
            onChange={(e) => {
              const selected = allSubscriptions.find(
                (sub) => String(sub.subscription_id) === e.target.value
              );
              if (selected) {
                setSubscription(selected);
                localStorage.setItem("selectedPlanId", String(selected.subscription_id));
                if (selected.coding_total > 0) {
                  setCourse("Technical");
                  localStorage.setItem("registeredCourse", "Technical");
                } else if (selected.mcq_total > 0) {
                  setCourse(localStorage.getItem("registeredCourse") || "Non-Technical");
                }
              }
            }}
            className="w-full py-3 px-4 rounded-xl border border-white bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#5B12A8] appearance-none shadow-sm"
          >
            {allSubscriptions.length === 0 && <option value="">Select Plan</option>}
            {allSubscriptions.map((sub, idx) => (
              <option key={sub.subscription_id || idx} value={sub.subscription_id}>
                {sub.plan_name || "Unnamed Plan"} - {sub.plan_type || "Unknown Type"}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ChevronDown className="w-5 h-5 text-gray-900" />
          </div>
        </div>

        {/* SELECTED COURSES */}
        <div className="mt-3 text-sm font-medium text-gray-700">
          Selected Courses:{" "}
          {subscription?.selected_courses && subscription.selected_courses.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {subscription.selected_courses.map((c: any, index: number) => (
                <span
                  key={index}
                  className="text-[#5B12A8] bg-[#E2D4F8] px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {c.course_name}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400 italic font-normal ml-1">Not selected</span>
          )}
        </div>

        {/* CONTINUE BUTTON */}
        {(() => {
          const planType = subscription?.plan_type?.toLowerCase() || "";
          const selectedCount = subscription?.selected_courses?.length || 0;
          const isMaxReached =
            (planType === "single" && selectedCount >= 1) ||
            (planType === "dual" && selectedCount >= 2) ||
            (planType === "triple" && selectedCount >= 3);

          return (
            <button
              disabled={isMaxReached}
              onClick={() => {
                if (!isMaxReached) {
                  navigate("/performance", {
                    state: { subscription_id: subscription?.subscription_id },
                  });
                  window.scrollTo(0, 0);
                }
              }}
              className={`w-full py-3.5 rounded-xl shadow-sm transition font-medium text-base ${
                isMaxReached
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#4A3490] hover:bg-[#3B2875] text-white"
              }`}
            >
              Continue
            </button>
          );
        })()}
      </div>
    </div>
  );
};
