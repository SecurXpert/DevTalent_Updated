import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/pages/Services/api/api";
import {
  ArrowLeft,
  Wallet,
  CheckCircle,
  FileText,
  Download,
  Calendar,
} from "lucide-react";

/* ---------------- TYPES ---------------- */

export type Plan = {
  coding_remaining: number;
  coding_total: number;
  coding_used: number;
  end_at: string;
  mcq_remaining: number;
  mcq_total: number;
  mcq_used: number;
  plan_id: number;
  plan_name?: string;
  plan_type?: string;
  amount?: number;
  start_at: string;
  status: string;
  subscription_id: number;
};

type Transaction = {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: "Success" | "Failed";
  tags: string[];
};

/* ---------------- DATA ---------------- */

const transactions: Transaction[] = [
  {
    id: "TXN1771075349122",
    title: "Dual Course Plan",
    date: "31/12/2025",
    amount: 589,
    status: "Success",
    tags: ["Technical", "Non-Technical"],
  },
  {
    id: "TXN20240101543210",
    title: "Dual Course Plan",
    date: "31/12/2025",
    amount: 589,
    status: "Success",
    tags: ["Technical", "Non-Technical"],
  },
  {
    id: "TXN20230615234567",
    title: "Single Course Plan",
    date: "29/07/2025",
    amount: 234,
    status: "Success",
    tags: ["Technical"],
  },
];

/* ---------------- COMPONENT ---------------- */

const Payments = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [totalSpentFromAPI, setTotalSpentFromAPI] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("userToken") || localStorage.getItem("adminToken");
        const response = await fetch(`${API_BASE_URL}/student/subscription/current`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch plans");
        }
        const data = await response.json();
        let parsedPlans: Plan[] = [];
        if (Array.isArray(data)) {
          parsedPlans = data;
        } else if (data && Array.isArray(data.items)) {
          parsedPlans = data.items;
        } else if (data && Array.isArray(data.data)) {
          parsedPlans = data.data;
        } else if (data) {
          parsedPlans = [data];
        }
        setPlans(parsedPlans);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("userToken") || localStorage.getItem("adminToken");
        const response = await fetch(`${API_BASE_URL}/student/payments/history`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.total_payment_amount !== undefined) {
            setTotalSpentFromAPI(data.total_payment_amount);
          }
          let parsedPayments: any[] = [];
          if (Array.isArray(data)) {
            parsedPayments = data;
          } else if (data && Array.isArray(data.items)) {
            parsedPayments = data.items;
          } else if (data && Array.isArray(data.data)) {
            parsedPayments = data.data;
          } else if (data) {
            parsedPayments = [data];
          }
          setPaymentHistory(parsedPayments);
        }
      } catch (err) {
        console.error("Failed to fetch payment history", err);
      }
    };

    fetchPlans();
    fetchPayments();
  }, []);

  const totalSubscriptions = plans.length;
  const totalSpent = totalSpentFromAPI;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-6 py-8 md:px-10 md:py-10">
        <button
          onClick={() => navigate("/studentdashboard")}
          className="flex items-center gap-2 text-sm mb-6 hover:opacity-80"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <h1 className="text-2xl md:text-3xl font-bold">Payment History</h1>
        <p className="text-sm opacity-90 mt-1">
          View all your transactions and download invoices
        </p>
      </div>

      {/* CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-8">
        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TOTAL SUBSCRIPTIONS */}
          <div className="bg-gradient-to-r from-purple-200 to-purple-300 p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Total Subscriptions</p>
              <p className="text-3xl font-bold text-purple-700">
                {totalSubscriptions}
              </p>
            </div>
            <Wallet className="text-purple-400 w-8 h-8" />
          </div>

          {/* ACTIVE PLANS */}
          <div className="bg-gradient-to-r from-green-200 to-green-300 p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Active Plans</p>
              <p className="text-3xl font-bold text-green-700">
                {plans.filter((p) => p.status === "active").length}
              </p>
            </div>
            <CheckCircle className="text-green-400 w-8 h-8" />
          </div>

          {/* TOTAL SPENT */}
          <div
            className="rounded-2xl p-6 shadow flex justify-between items-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(245, 158, 11, 0.4) 0%, #FFEDD4 100%)",
            }}
          >
            <div>
              <p className="text-gray-600 text-sm">Total Spent</p>
              <p className="text-3xl font-bold text-yellow-700">
                ₹{totalSpent}
              </p>
            </div>
            <FileText className="text-yellow-400 w-8 h-8" />
          </div>
        </div>

        {/* TRANSACTION HISTORY */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
          <h2 className="font-semibold text-lg mb-6">Transaction History</h2>

          <div className="space-y-5">
            {plans.map((plan, index) => {
              const matchingPayment = paymentHistory.find((p) => {
                const pSubId = p.subscription_id || p.subscriptionId || p.sub_id;
                const pPlanId = p.plan_id || p.planId;
                return (
                  (pSubId && Number(pSubId) === Number(plan.subscription_id)) ||
                  (pPlanId && Number(pPlanId) === Number(plan.plan_id))
                );
              }) || paymentHistory[index] || paymentHistory[0];
              const displayAmount = plan.amount || matchingPayment?.amount || 0;

              return (
                <div
                  key={plan.subscription_id}
                  className="border rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition"
                >
                  {/* LEFT SIDE */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-green-500 w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 capitalize">{plan.plan_name} - {plan.plan_type}</h3>

                      <p className="text-xs text-gray-500">
                        <Calendar className="w-3 h-3 inline mr-1 mb-1" />
                        Started: {new Date(plan.start_at).toLocaleDateString()} | Ends: {new Date(plan.end_at).toLocaleDateString()}
                      </p>

                      {/* TAGS */}
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                          MCQ: {plan.mcq_remaining} / {plan.mcq_total} Remaining
                        </span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                          Coding: {plan.coding_remaining} / {plan.coding_total} Remaining
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE (PRICE + STATUS + ACTIONS) */}
                  <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                    {/* PRICE + STATUS */}
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        ₹{displayAmount}
                      </p>

                      <span className={`text-xs px-3 py-1 rounded-full inline-block mt-1 ${plan.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {plan.status ? plan.status.charAt(0).toUpperCase() + plan.status.slice(1) : 'Unknown'}
                      </span>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 border px-3 py-1.5 rounded-lg hover:bg-gray-100 text-sm">
                        <Download className="w-4 h-4" />
                        Download Invoice
                      </button>

                      <button className="text-sm text-gray-600 hover:text-purple-600">
                        Download Receipt
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PAYMENT HISTORY */}
        <div className="hidden bg-white rounded-2xl shadow p-6 border border-gray-200 mt-8">
          <h2 className="font-semibold text-lg mb-6">Payment History</h2>

          {paymentHistory.length === 0 ? (
            <p className="text-gray-500 text-sm">No payment history found.</p>
          ) : (
            <div className="space-y-5">
              {paymentHistory.map((payment, index) => (
                <div
                  key={payment.id || payment.payment_id || index}
                  className="border rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition"
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Wallet className="text-blue-500 w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {payment.plan_name || payment.title || `Payment ID: ${payment.id || payment.payment_id || index}`}
                      </h3>
                      <p className="text-xs text-gray-500">
                        <Calendar className="w-3 h-3 inline mr-1 mb-1" />
                        Date: {payment.created_at || payment.date ? new Date(payment.created_at || payment.date).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-600">
                        ₹{payment.amount || 0}
                      </p>
                      <span className={`text-xs px-3 py-1 rounded-full inline-block mt-1 ${payment.status === 'Success' || payment.status === 'success' || payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {payment.status ? payment.status.toUpperCase() : "COMPLETED"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
