import React from "react";
import { FiCreditCard, FiActivity } from "react-icons/fi";

interface SubscriptionTabProps {
  subscriptionData: any;
  paymentAmount: number;
  handleViewPayments: () => void;
  handleUpgradePlan: () => void;
}

export const SubscriptionTab: React.FC<SubscriptionTabProps> = ({
  subscriptionData,
  paymentAmount,
  handleViewPayments,
  handleUpgradePlan,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <FiCreditCard /> Subscription Details
        </h3>

        {/* PLAN CARD */}
        <div className="bg-gradient-to-r from-purple-200 to-purple-300 rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">
                {subscriptionData?.plan_name ||
                  (subscriptionData?.plan_id ? `Plan ID: ${subscriptionData.plan_id}` : "No Active Plan")}
              </p>
              <p className="text-xs text-gray-600">Current Plan</p>
            </div>
          </div>

          {subscriptionData ? (
            <div className="mt-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span>Status</span>
                <span
                  className={`text-white text-xs px-2 py-1 rounded-full ${
                    subscriptionData.status === "active" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                >
                  {subscriptionData.status || "Active"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Validity</span>
                <span>
                  Until{" "}
                  {subscriptionData.end_at
                    ? new Date(subscriptionData.end_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>MCQ Exams</span>
                <span>
                  {subscriptionData.mcq_remaining ?? 0} / {subscriptionData.mcq_total ?? 0} Remaining
                </span>
              </div>
              <div className="flex justify-between">
                <span>Coding Exams</span>
                <span>
                  {subscriptionData.coding_remaining ?? 0} / {subscriptionData.coding_total ?? 0} Remaining
                </span>
              </div>
              <div className="flex justify-between font-semibold text-purple-700">
                <span>Amount Paid</span>
                <span>₹{paymentAmount}</span>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-gray-600">No subscription found.</div>
          )}
        </div>

        <button
          onClick={handleViewPayments}
          className="w-full border rounded-lg py-2 text-sm mt-4 bg-gray-50"
        >
          View Payment History
        </button>

        <button
          onClick={handleUpgradePlan}
          className="w-full bg-yellow-500 text-white rounded-lg py-2 mt-2"
        >
          🔒 Upgrade Plan
        </button>
      </div>

      {/* EXAM HISTORY */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-3">
          <FiActivity /> Exam History
        </h3>

        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>Total Exams</span>
            <span>0</span>
          </div>
          <div className="flex justify-between">
            <span>Completed</span>
            <span className="text-green-500">0</span>
          </div>
          <div className="flex justify-between">
            <span>Pending</span>
            <span className="text-yellow-500">0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
