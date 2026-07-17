import React, { useMemo, useState, useEffect } from "react";
import {
  Users,
  Clock,
  DollarSign,
  FileText,
  Lock,
  BookOpen,
  CheckSquare,
} from "lucide-react";
import SubscriptionHeader from "./SubscriptionHeader";
import SubscriptionStats from "./SubscriptionStats";
import SubscriptionTabs from "./SubscriptionTabs";
import PlansTable from "./PlansTable";
import ActiveSubscriptionsTable from "./ActiveSubscriptionsTable";
import BasicPlanDetails from "./BasicPlanDetails";
import PricingDetails from "./PricingDetails";
import AvailableCourses from "./AvailableCourses";
import { API_BASE_URL } from "@/pages/Services/api/api";

type PlanItem = {
  id: number;
  name: string;
  planType: string;
  courseLimit: number;
  mcqCredits: number;
  codingCredits: number;
  amount: number;
  gst_percent?: number;
  description?: string;
  is_active?: boolean;
};

type ActiveSubscriptionItem = {
  id: number;
  institution: string;
  planType: string;
  startDate: string;
  endDate: string;
  status: string;
  amount: number;
  mcqRemaining: number;
  codingRemaining: number;
};


type FormState = {
  name: string;
  planType: string;
  courseLimit: string;
  mcqCredits: string;
  codingCredits: string;
  amount: string;
};

type FormErrors = {
  name?: string;
  planType?: string;
  courseLimit?: string;
  mcqCredits?: string;
  codingCredits?: string;
  amount?: string;
};

const Subscriptions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"plans" | "active">("plans");
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  const [activeSubscriptions, setActiveSubscriptions] = useState<ActiveSubscriptionItem[]>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
  const [subscriptionSummary, setSubscriptionSummary] = useState({
    total_subscriptions: 0,
    active_subscriptions_count: 0,
    pending_payments_count: 0,
    total_revenue: 0,
  });

  const [defaultPlans] = useState<PlanItem[]>([
    {
      id: 1,
      name: "Single Course",
      planType: "Single",
      courseLimit: 50,
      mcqCredits: 100,
      codingCredits: 50,
      amount: 29,
    },
    {
      id: 2,
      name: "Dual Course",
      planType: "Dual",
      courseLimit: 200,
      mcqCredits: 500,
      codingCredits: 250,
      amount: 79,
    },
    {
      id: 3,
      name: "Triple Course",
      planType: "Triple",
      courseLimit: 500,
      mcqCredits: 1000,
      codingCredits: 500,
      amount: 149,
    },
  ]);

  const [form, setForm] = useState<FormState>({
    name: "",
    planType: "",
    courseLimit: "",
    mcqCredits: "",
    codingCredits: "",
    amount: "",
    gstPercent: "18",
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const availableCourses = [
    "Computer Science",
    "Data Science",
    "Software Engineering",
    "Information Technology",
    "Cybersecurity",
    "Artificial Intelligence",
    "Cloud Computing",
    "Mobile Development",
  ];

  const totalPlans = plans.length;
  const activePlans = plans.filter((p) => p.is_active).length;
  const inactivePlans = plans.filter((p) => !p.is_active).length;
  const avgPlanAmount = plans.length > 0
    ? (plans.reduce((sum, p) => sum + p.amount, 0) / plans.length).toFixed(2)
    : "0.00";

  const resetForm = () => {
    setForm({
      name: "",
      planType: "",
      courseLimit: "",
      mcqCredits: "",
      codingCredits: "",
      amount: "",
      gstPercent: "18",
      description: "",
    });
    setErrors({});
    setEditingId(null);
  };

  const goToCreate = () => {
    resetForm();
    setView("create");
  };

  const goToEdit = (plan: PlanItem) => {
    setForm({
      name: plan.name,
      planType: plan.planType,
      courseLimit: String(plan.courseLimit),
      mcqCredits: String(plan.mcqCredits),
      codingCredits: String(plan.codingCredits),
      amount: String(plan.amount),
      gstPercent: String(plan.gst_percent ?? 18),
      description: plan.description ?? "",
    });
    setErrors({});
    setEditingId(plan.id);
    setView("edit");
  };

  const handleDelete = async (id: number) => {
    // Delete plan via API
    try {
      const adminToken = localStorage.getItem('adminToken');
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };

      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/admin/catalog/plans/${id}?hard=false`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok) {
        // API deletion successful, remove from local state
        setPlans((prev) => prev.filter((item) => item.id !== id));
        console.log('Plan deleted successfully');
      } else {
        console.error('Failed to delete plan:', response.statusText);
        alert('Failed to delete plan from server.');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Error connecting to server to delete plan.');
    }
  };

  const handleInputChange = (
    key: keyof FormState,
    value: string | string[],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [key]: undefined,
    }));
  };

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Plan name is required";
    } else if (form.name.trim().length < 2) {
      nextErrors.name = "Plan name must be at least 2 characters";
    }

    if (!form.planType.trim()) {
      nextErrors.planType = "Plan type is required";
    }

    if (!form.courseLimit.trim()) {
      nextErrors.courseLimit = "Course limit is required";
    } else if (!/^\d+$/.test(form.courseLimit.trim())) {
      nextErrors.courseLimit = "Only numbers are allowed";
    }

    if (!form.mcqCredits.trim()) {
      nextErrors.mcqCredits = "MCQ credits is required";
    } else if (!/^\d+$/.test(form.mcqCredits.trim())) {
      nextErrors.mcqCredits = "Only numbers are allowed";
    }

    if (!form.codingCredits.trim()) {
      nextErrors.codingCredits = "Coding credits is required";
    } else if (!/^\d+$/.test(form.codingCredits.trim())) {
      nextErrors.codingCredits = "Only numbers are allowed";
    }

    if (!form.amount.trim()) {
      nextErrors.amount = "Amount is required";
    } else if (!/^\d+(\.\d{1,2})?$/.test(form.amount.trim())) {
      nextErrors.amount = "Enter a valid amount";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const planData: PlanItem = {
      id: editingId ?? Date.now(),
      name: form.name,
      planType: form.planType,
      courseLimit: Number(form.courseLimit),
      mcqCredits: Number(form.mcqCredits),
      codingCredits: Number(form.codingCredits),
      amount: Number(form.amount),
    };

    if (view === "create") {
      setPlans((prev) => {
        const newPlans = [...prev, planData];
        return newPlans;
      });
    } else {
      // Update plan via API
      try {
        const adminToken = localStorage.getItem('adminToken');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (adminToken) {
          headers['Authorization'] = `Bearer ${adminToken}`;
        }

        const requestBody = {
          plan_name: planData.name,
          plan_type: planData.planType,
          course_limit: planData.courseLimit,
          mcq_credit_total: planData.mcqCredits,
          coding_credit_total: planData.codingCredits,
          amount: planData.amount,
          gst_percent: 18, // Default GST percent
          is_active: true, // Default active status
        };

        const response = await fetch(`${API_BASE_URL}/admin/catalog/plans/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const updatedPlan = await response.json();
          // Transform API response back to our format
          const transformedPlan: PlanItem = {
            id: updatedPlan.id || planData.id,
            name: updatedPlan.plan_name || planData.name,
            planType: updatedPlan.plan_type || planData.planType,
            courseLimit: updatedPlan.course_limit || planData.courseLimit,
            mcqCredits: updatedPlan.mcq_credit_total || planData.mcqCredits,
            codingCredits: updatedPlan.coding_credit_total || planData.codingCredits,
            amount: updatedPlan.amount || planData.amount,
            gst_percent: updatedPlan.gst_percent || 18,
            description: updatedPlan.description || '',
            is_active: updatedPlan.is_active !== undefined ? updatedPlan.is_active : true,
          };

          setPlans((prev) =>
            prev.map((item) => (item.id === editingId ? transformedPlan : item)),
          );
        } else {
          console.error('Failed to update plan:', response.statusText);
          // Fallback to local update if API fails
          setPlans((prev) =>
            prev.map((item) => (item.id === editingId ? planData : item)),
          );
        }
      } catch (error) {
        console.error('Error updating plan:', error);
        // Fallback to local update if API fails
        setPlans((prev) =>
          prev.map((item) => (item.id === editingId ? planData : item)),
        );
      }
    }

    resetForm();
    setView("list");
  };

  const fetchPlansFromAPI = async () => {
    setLoadingPlans(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/admin/catalog/plans?active_only=false`, {
        method: 'GET',
        headers,
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('API returned non-JSON response. Status:', response.status);
        console.log('Response text:', await response.text());
        // Use default plans as fallback
        setPlans(defaultPlans);
        return;
      }

      if (response.ok) {
        const plansData = await response.json();
        // Transform API data to match PlanItem structure
        const itemsArray = Array.isArray(plansData) ? plansData : (plansData.items || []);

        const transformedPlans: PlanItem[] = itemsArray.map((plan: any, index: number) => ({
          id: plan.id || Date.now() + index,
          name: plan.plan_name || plan.name || `Plan ${index + 1}`,
          planType: plan.plan_type || plan.planType || 'Standard',
          courseLimit: plan.course_limit || 0,
          mcqCredits: plan.mcq_credit_total || 0,
          codingCredits: plan.coding_credit_total || 0,
          amount: plan.amount || 0,
          gst_percent: plan.gst_percent || 18,
          description: plan.description || '',
          is_active: plan.is_active !== undefined ? plan.is_active : true,
        }));

        setPlans(transformedPlans);
      } else {
        console.error('Failed to fetch plans. Status:', response.status, response.statusText);
        // Use default plans as fallback
        setPlans(defaultPlans);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      // Use default plans as fallback
      setPlans(defaultPlans);
    } finally {
      setLoadingPlans(false);
    }
  };

  const fetchSubscriptionsFromAPI = async () => {
    setLoadingSubscriptions(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/student/admin/subscriptions?limit=50&offset=0`, {
        method: 'GET',
        headers,
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('API returned non-JSON response. Status:', response.status);
        return;
      }

      if (response.ok) {
        const data = await response.json();

        if (data.summary) {
          setSubscriptionSummary({
            total_subscriptions: data.summary.total_subscriptions || 0,
            active_subscriptions_count: data.summary.active_subscriptions_count || 0,
            pending_payments_count: data.summary.pending_payments_count || 0,
            total_revenue: data.summary.total_revenue || 0,
          });
        }

        const itemsArray = Array.isArray(data) ? data : (data.items || []);

        const transformedSubscriptions: ActiveSubscriptionItem[] = itemsArray.map((sub: any, index: number) => ({
          id: sub.subscription_id || Date.now() + index,
          institution: sub.student_name || 'Unknown',
          planType: sub.plan_name || 'Unknown',
          startDate: sub.start_at ? sub.start_at.split('T')[0] : '',
          endDate: sub.end_at ? sub.end_at.split('T')[0] : '',
          status: sub.subscription_status === 'active' ? 'Active' : sub.subscription_status === 'expired' ? 'Expired' : (sub.subscription_status || 'Pending'),
          amount: sub.payment_amount || 0,
          mcqRemaining: sub.mcq_remaining || 0,
          codingRemaining: sub.coding_remaining || 0,
        }));

        setActiveSubscriptions(transformedSubscriptions);
      } else {
        console.error('Failed to fetch subscriptions. Status:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoadingSubscriptions(false);
    }
  };

  useEffect(() => {
    fetchPlansFromAPI();
    fetchSubscriptionsFromAPI();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f2fc] p-3 sm:p-5 md:p-6">
      {view === "list" ? (
        <>
          <SubscriptionHeader
            title="Subscriptions & Plans"
            subtitle="Manage platform plans and active subscriptions"
            onCreateNew={goToCreate}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {activeTab === "plans" ? (
              <>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Total Plans</p>
                      <h3 className="mt-1 text-[15px] font-semibold text-slate-900 sm:text-[17px]">
                        {String(totalPlans)}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                      <CheckSquare size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Active Plans</p>
                      <h3 className="mt-1 text-[15px] font-semibold text-slate-900 sm:text-[17px]">
                        {String(activePlans)}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Inactive Plans</p>
                      <h3 className="mt-1 text-[15px] font-semibold text-slate-900 sm:text-[17px]">
                        {String(inactivePlans)}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <DollarSign size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Avg Plan Amount</p>
                      <h3 className="mt-1 text-[15px] font-semibold text-slate-900 sm:text-[17px]">
                        ₹{avgPlanAmount}
                      </h3>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Total Subscriptions</p>
                      <h3 className="mt-1 text-[15px] font-semibold text-slate-900 sm:text-[17px]">
                        {String(subscriptionSummary.total_subscriptions)}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Active Subscriptions</p>
                      <h3 className="mt-1 text-[15px] font-semibold text-slate-900 sm:text-[17px]">
                        {String(subscriptionSummary.active_subscriptions_count)}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Pending Payments</p>
                      <h3 className="mt-1 text-[15px] font-semibold text-slate-900 sm:text-[17px]">
                        {String(subscriptionSummary.pending_payments_count)}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <DollarSign size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Monthly Revenue</p>
                      <h3 className="mt-1 text-[15px] font-semibold text-slate-900 sm:text-[17px]">
                        ₹{subscriptionSummary.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </h3>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="col-span-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-1 border-b border-slate-200 px-4">
                <SubscriptionTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </div>

              {activeTab === "plans" ? (
                <div className="p-4">
                  {loadingPlans && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700 text-sm">Loading plans from server...</span>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                      </div>
                    </div>
                  )}
                  <PlansTable
                    plans={plans}
                    onEdit={goToEdit}
                    onDelete={handleDelete}
                    onUpdate={(updatedPlan) => {
                      setPlans((prev) => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
                    }}
                  />
                </div>
              ) : (
                <div className="p-4">
                  <ActiveSubscriptionsTable
                    subscriptions={activeSubscriptions}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setView("list");
            }}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-600"
          >
            ← Back to Subscriptions & Plans
          </button>

          <div className="mb-6">
            <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[28px]">
              {view === "edit" ? "Edit Plan" : "Create New Plan"}
            </h1>
            <p className="mt-1 text-[15px] text-slate-500">
              Define a new subscription plan for your platform
            </p>
          </div>

          <div className="space-y-6">
            <BasicPlanDetails
              form={form}
              errors={errors}
              onInputChange={handleInputChange}
            />

            <AvailableCourses
              form={form}
              errors={errors}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              view={view}
            />

            <PricingDetails
              form={form}
              errors={errors}
              onInputChange={handleInputChange}
              onSave={handleSubmit}
              onCancel={() => setView("list")}
              view={view}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Subscriptions;
