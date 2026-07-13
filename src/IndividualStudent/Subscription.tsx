import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/pages/Services/api/api";
import { BookOpen } from "lucide-react";

import { SubscriptionNavbar } from "./SubscriptionComponents/SubscriptionNavbar";
import { SingleCourseCard } from "./SubscriptionComponents/SingleCourseCard";
import { DualCourseCard } from "./SubscriptionComponents/DualCourseCard";
import { TripleCourseCard } from "./SubscriptionComponents/TripleCourseCard";
import { PriceSummary } from "./SubscriptionComponents/PriceSummary";

type PlanType = "single" | "dual" | "triple";

export default function Subscription() {
  const location = useLocation();
  const navigate = useNavigate();
  const state =
    (location.state as { userEmail?: string; userName?: string }) || {};
  const userEmail = state.userEmail || "user@example.com";
  const userName = state.userName || "User";
  const [plan, setPlan] = useState<PlanType>("single");
  const [courseType, setCourseType] = useState("Technical");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([
    "Data Structures & Algorithms",
  ]);
  const [selectedExam, setSelectedExam] = useState(2);

  const [singlePlans, setSinglePlans] = useState([
    { exams: 2, price: 199 },
    { exams: 3, price: 249 },
    { exams: 4, price: 369 },
    { exams: 6, price: 549 },
    { exams: 10, price: 899 },
  ]);

  const [dualPrice, setDualPrice] = useState(599);
  const [dualExams, setDualExams] = useState(6);
  const [dualId, setDualId] = useState<any>(null);
  const [triplePrice, setTriplePrice] = useState(599);
  const [tripleExams, setTripleExams] = useState(6);
  const [tripleId, setTripleId] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [apiCourses, setApiCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlansAndCourses = async () => {
      console.log("Fetch Plans started...");
      try {
        const token =
          localStorage.getItem("access_token") ||
          localStorage.getItem("userToken");

        // Fetch Plans
        const plansResponse = await fetch(`${API_BASE_URL}/student/plans`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (plansResponse.ok) {
          let plansData = await plansResponse.json();
          console.log("Full Plans Response:", plansData);

          if (Array.isArray(plansData) && plansData.length > 0) {
            const single = plansData
              .filter(
                (p: any) =>
                  String(p.plan_type || p.type).toLowerCase() === "single"
              )
              .map((p: any) => ({
                id: p.id || p.plan_id,
                exams: p.exams || p.mcq_credit_total || p.course_limit,
                price: p.amount || p.price,
              }))
              .sort((a: any, b: any) => a.exams - b.exams);
            if (single.length > 0) setSinglePlans(single);

            const dual = plansData.find(
              (p: any) => String(p.plan_type || p.type).toLowerCase() === "dual"
            );
            if (dual) {
              setDualId(dual.id || dual.plan_id);
              setDualPrice(dual.amount || dual.price);
              setDualExams(
                dual.exams || dual.mcq_credit_total || dual.course_limit || 6
              );
            }

            const triple = plansData.find(
              (p: any) =>
                String(p.plan_type || p.type).toLowerCase() === "triple"
            );
            if (triple) {
              setTripleId(triple.id || triple.plan_id);
              setTriplePrice(triple.amount || triple.price);
              setTripleExams(
                triple.exams || triple.mcq_credit_total || triple.course_limit || 6
              );
            }
          }
        } else {
          console.error("API Error:", plansResponse.status);
        }

        // Fetch Courses
        const coursesResponse = await fetch(
          `${API_BASE_URL}/admin/catalog/courses`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          const formattedCourses = coursesData.map((c: any) => ({
            name: c.name,
            id: c.id,
            icon: BookOpen,
            type_id: c.type_id,
          }));
          setApiCourses(formattedCourses);
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        alert(`Network/Code Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPlansAndCourses();
  }, []);

  // 🔹 Handle Buy Now — Razorpay Full Flow
  const handleBuyNow = async () => {
    setIsProcessing(true);
    try {
      const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("userToken");

      // Step 1: Resolve Plan ID
      let selectedPlanId: any =
        plan === "single"
          ? singlePlans.find((p) => p.exams === selectedExam)?.id
          : plan === "dual"
          ? dualId
          : tripleId;

      if (!selectedPlanId && plan === "single" && singlePlans.length > 0) {
        selectedPlanId = singlePlans[0].id;
      }

      if (!selectedPlanId) {
        alert("Please select a valid plan.");
        setIsProcessing(false);
        return;
      }

      // Step 2: Create order
      const response = await fetch(
        `${API_BASE_URL}/student/subscription/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount_paise: Math.round(total * 100),
            currency: "INR",
            plan_id: selectedPlanId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create order");
      }

      const orderData = await response.json();
      console.log("Order Created:", orderData);

      // Step 3: Pick the Razorpay key from API response (field is key_id)
      const razorpayKey =
        orderData.key_id || orderData.razorpay_key || orderData.key || "";

      if (!razorpayKey) {
        alert(
          "Razorpay key missing from server response. Please contact support."
        );
        setIsProcessing(false);
        return;
      }

      // Step 4: Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: orderData.amount_paise || Math.round(total * 100),
        currency: orderData.currency || "INR",
        name: "DevTalent",
        description: `${
          plan.charAt(0).toUpperCase() + plan.slice(1)
        } Course Subscription`,
        order_id:
          orderData.razorpay_order_id || orderData.order_id || orderData.id,
        prefill: { name: userName, email: userEmail },
        theme: { color: "#7C3AED" },

        // Step 5: On payment success → verify
        handler: async (paymentResponse: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            console.log("Payment Success:", paymentResponse);

            const verifyResponse = await fetch(
              `${API_BASE_URL}/student/subscription/verify-payment`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  plan_id: selectedPlanId,
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                }),
              }
            );

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.detail || "Verification failed");
            }

            const verificationStatus = await verifyResponse.json();
            console.log("Payment Verified:", verificationStatus);

            // Step 6: Navigate to summary after successful verification
            navigate("/summary", {
              state: {
                plan,
                totalExams,
                totalCourses,
                basePrice,
                total,
                orderData,
                paymentId: paymentResponse.razorpay_payment_id,
                verificationStatus: verificationStatus,
              },
            });
            window.scrollTo(0, 0);
          } catch (verifyError: any) {
            console.error(
              "Verification Error:",
              verifyError.response?.data || verifyError
            );
            alert(
              "Payment received but verification failed. Contact support with payment ID: " +
                paymentResponse.razorpay_payment_id
            );
          } finally {
            setIsProcessing(false);
          }
        },

        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (failResponse: any) => {
        console.error("Payment Failed:", failResponse.error);
        alert(
          `Payment failed: ${
            failResponse.error?.description || "Please try again."
          }`
        );
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error: any) {
      console.error("Order Error:", error.message || error);
      alert("Failed to initiate purchase. Please try again.");
      setIsProcessing(false);
    }
  };

  // Calculate Price
  const basePrice =
    plan === "single"
      ? singlePlans.find((p) => p.exams === selectedExam)?.price || 0
      : plan === "dual"
      ? dualPrice
      : triplePrice;

  const gst = Math.round(basePrice * 0.18);
  const total = basePrice + gst;

  // Exams calculation based on plan
  const totalExams =
    plan === "single"
      ? selectedExam
      : plan === "dual"
      ? dualExams
      : tripleExams;

  const totalCourses = plan === "single" ? 1 : plan === "dual" ? 2 : 3;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <SubscriptionNavbar userName={userName} userEmail={userEmail} />

      {/* MAIN CONTENT */}
      <div className="p-6">
        {/* TITLE */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-purple-700">
            Subscription Plans
          </h2>
          <p className="text-gray-500 mt-2">
            Choose the perfect plan for your learning journey
          </p>
        </div>

        {/* PLANS */}
        <div className="grid md:grid-cols-3 gap-6">
          <SingleCourseCard
            plan={plan}
            setPlan={setPlan}
            selectedExam={selectedExam}
            setSelectedExam={setSelectedExam}
            courseType={courseType}
            setCourseType={setCourseType}
            apiCourses={apiCourses}
            singlePlans={singlePlans}
          />
          <DualCourseCard
            plan={plan}
            setPlan={setPlan}
            apiCourses={apiCourses}
            dualExams={dualExams}
            dualPrice={dualPrice}
          />
          <TripleCourseCard
            plan={plan}
            setPlan={setPlan}
            apiCourses={apiCourses}
            tripleExams={tripleExams}
            triplePrice={triplePrice}
          />
        </div>

        <PriceSummary
          plan={plan}
          basePrice={basePrice}
          gst={gst}
          total={total}
          totalExams={totalExams}
          totalCourses={totalCourses}
          isProcessing={isProcessing}
          handleBuyNow={handleBuyNow}
          navigate={navigate}
        />
      </div>
    </div>
  );
}
