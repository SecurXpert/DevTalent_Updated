import React, { useState } from "react";
import { ShieldCheck, Tag, CreditCard, Smartphone, Wallet, CheckCircle } from "lucide-react";
import Devlogo from "../assests/Devlogo.png";
import { useNavigate, useLocation } from "react-router-dom";
// import PaymentSuccessPopup from "../components/PaymentSuccessPopup";

export default function Summary() {
    const location = useLocation();
    const navigate = useNavigate();

    const state =
        (location.state as {
            plan?: string;
            totalExams?: number;
            totalCourses?: number;
            basePrice?: number;
            total?: number;
        }) || {};

    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
    const [transactionId, setTransactionId] = useState("");

    // Use passed data or fallback to defaults
    const planName = state.plan || "Dual Course Plan";
    const courses =
        state.plan === "single"
            ? "Technical"
            : state.plan === "dual"
                ? "Technical + Non-Technical"
                : "Technical + Non-Technical + Management";

    const exams = state.totalExams || 6;
    const validity = 365;
    const basePrice = state.basePrice || 499;

    const paymentId = state.paymentId;
    const isPaid = !!paymentId;

    const gst = Math.round(basePrice * 0.18);
    const total = basePrice + gst - discount;

    // 🔹 Apply Coupon
    const handleApplyCoupon = () => {
        if (coupon === "SAVE10") {
            setDiscount(50);
        } else {
            setDiscount(0);
            alert("Invalid coupon");
        }
    };

    // 🔹 Handle Payment
    const handlePayment = () => {
        const txnId = "TXN" + Date.now();
        setTransactionId(txnId);
        setShowPaymentSuccess(true);
    };

    // 🔹 Close Popup
    const handleClosePopup = () => {
        setShowPaymentSuccess(false);
        navigate("/studentdashboard");
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen overflow-x-hidden px-4 sm:px-6 md:px-10 lg:px-20 py-6">
            {/* HEADER */}
            <div className="mb-10 flex flex-col sm:flex-row items-center sm:justify-center relative">
                {/* Logo */}
                <img
                    src={Devlogo}
                    className="h-16 sm:h-16 md:h-20 mb-3 sm:mb-0 sm:absolute sm:left-0"
                    alt="logo"
                />

                {/* Text */}
                <div className="text-center px-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-700">
                        {isPaid ? "Payment Successful" : "Complete Your Purchase"}
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">
                        {isPaid ? "Here are your order details" : "Review your order and proceed to payment"}
                    </p>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* LEFT: ORDER SUMMARY */}
                <div
                    className="bg-white rounded-2xl shadow-lg overflow-hidden w-full"
                    style={{ height: "fit-content" }}
                >
                    <div
                        className="text-white px-5 py-3 font-semibold"
                        style={{
                            background: "linear-gradient(90deg, #3C309E 0%, #8A1EAB 100%)",
                        }}
                    >
                        Order Summary
                    </div>

                    <div className="p-5 text-sm space-y-3">
                        <div>
                            <p className="text-gray-500">Plan Selected</p>
                            <p className="font-semibold">{planName}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Courses</p>
                            <p>{courses}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Total Exams</p>
                            <p>{exams} exams</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Validity</p>
                            <p>{validity} days</p>
                        </div>

                        <hr />

                        <div className="flex justify-between">
                            <span className="text-gray-500">Base Price</span>
                            <span>₹{basePrice}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">GST (18%)</span>
                            <span>₹{gst}</span>
                        </div>

                        {discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>-₹{discount}</span>
                            </div>
                        )}

                        <div className="flex justify-between font-semibold text-lg">
                            <span>Total Payable</span>
                            <span className="text-purple-700">₹{total}</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="md:col-span-2 space-y-6 w-full">
                    {isPaid ? (
                        /* SUCCESS RECEIPT */
                        <div className="bg-white rounded-2xl shadow-md p-8 w-full flex flex-col items-center justify-center text-center">
                            <div className="bg-green-100 p-4 rounded-full mb-4">
                                <CheckCircle size={48} className="text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Confirmed!</h3>
                            <p className="text-gray-600 mb-6">
                                Thank you for your purchase. Your subscription is now active.
                            </p>
                            
                            <div className="w-full bg-gray-50 rounded-xl p-5 mb-6 text-left border border-gray-100">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-500">Transaction ID</span>
                                    <span className="font-semibold text-gray-800">{paymentId}</span>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-500">Amount Paid</span>
                                    <span className="font-semibold text-gray-800">₹{total}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Status</span>
                                    <span className="font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">Success</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    navigate("/studentdashboard");
                                    window.scrollTo(0, 0);
                                }}
                                className="w-full sm:w-auto px-8 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition-colors"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    ) : (
                        /* CHECKOUT OPTIONS */
                        <>
                            {/* COUPON */}
                            <div className="bg-white rounded-2xl shadow-md p-5 w-full">
                                <div className="flex items-center gap-2 font-semibold mb-3">
                                    <Tag size={18} className="text-purple-600" />
                                    Apply Coupon Code
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                        placeholder="Enter coupon code"
                                        className="w-full border rounded-lg px-3 py-2"
                                    />

                                    <button
                                        onClick={handleApplyCoupon}
                                        className="w-full sm:w-auto px-4 rounded-lg bg-gray-200"
                                    >
                                        Apply
                                    </button>
                                </div>

                                <p className="text-sm text-gray-500 mt-2">
                                    Try:{" "}
                                    <span className="bg-purple-100 px-2 py-1 rounded">SAVE10</span>
                                </p>
                            </div>

                            {/* PAYMENT METHOD */}
                            <div className="bg-white rounded-2xl shadow-md p-5 w-full">
                                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                                    <h3 className="font-semibold">Select Payment Method</h3>
                                    <span className="text-sm text-gray-500">Secured by Razorpay</span>
                                </div>

                                <div
                                    className="rounded-xl p-4"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, rgba(82, 143, 240, 0.3) 0%, #EFF6FF 100%)",
                                        border: "2px solid #60A5FA",
                                    }}
                                >
                                    <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                                        <div>
                                            <p className="font-semibold text-blue-700">
                                                Razorpay Payment Gateway
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Safe & Secure Payments
                                            </p>
                                        </div>

                                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                                            Recommended
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3">
                                        Pay securely using UPI, Cards, Net Banking, or Wallets through
                                        Razorpay
                                    </p>

                                    <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
                                        <div className="flex items-center gap-2 border px-3 py-1 rounded-lg bg-white">
                                            <Smartphone size={14} /> UPI
                                        </div>
                                        <div className="flex items-center gap-2 border px-3 py-1 rounded-lg bg-white">
                                            <CreditCard size={14} /> Cards
                                        </div>
                                        <div className="flex items-center gap-2 border px-3 py-1 rounded-lg bg-white">
                                            <CreditCard size={14} /> Banking
                                        </div>
                                        <div className="flex items-center gap-2 border px-3 py-1 rounded-lg bg-white">
                                            <Wallet size={14} /> Wallets
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-3">
                                        <span>✔ PCI DSS</span>
                                        <span>✔ 256-bit Encryption</span>
                                        <span>✔ Instant Refunds</span>
                                    </div>
                                </div>

                                {/* SAFE NOTE */}
                                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm flex items-start gap-2">
                                    <ShieldCheck size={16} className="text-purple-600 mt-1" />
                                    <div>
                                        <p className="font-medium">100% Safe & Secure</p>
                                        <p className="text-gray-500">
                                            Your payment information is encrypted and secure.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* PAY BUTTON */}
                            <button
                                onClick={handlePayment}
                                className="w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
                            >
                                <ShieldCheck size={18} />
                                Pay Securely via Razorpay - ₹{total} →
                            </button>

                            <p
                                className="text-center text-sm text-gray-500 mt-3 cursor-pointer"
                                onClick={() => {
                                    navigate("/subscription");
                                    window.scrollTo(0, 0);
                                }}
                            >
                                Back to Plans
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* PAYMENT SUCCESS POPUP */}
            {/* <PaymentSuccessPopup
        isOpen={showPaymentSuccess}
        onClose={handleClosePopup}
        transactionId={transactionId}
        amountPaid={`₹${total}.00`}
        plan={planName}
      /> */}
        </div>
    );
}
