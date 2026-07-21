import React from "react";
import { ShoppingCart, TrendingUp, Sparkles, Check } from "lucide-react";
import { NavigateFunction } from "react-router-dom";

interface PriceSummaryProps {
  plan: string;
  basePrice: number;
  gst: number;
  total: number;
  totalExams: number;
  totalCourses: number;
  isProcessing: boolean;
  handleBuyNow: () => void;
  handleAssignPlanDirectly: () => void;
  studentId?: number;
  actionType?: string;
  navigate: NavigateFunction;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  plan,
  basePrice,
  gst,
  total,
  totalExams,
  totalCourses,
  isProcessing,
  handleBuyNow,
  handleAssignPlanDirectly,
  studentId,
  actionType,
  navigate,
}) => {
  return (
    <div className="mt-10 bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between gap-6">
      {/* LEFT */}
      <div
        onClick={() => {
          navigate("/summary", {
            state: {
              plan,
              totalExams,
              totalCourses,
              basePrice,
              total,
            },
          });
          window.scrollTo(0, 0);
        }}
        className="w-full md:w-1/2 bg-gray-100 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition-colors"
      >
        <h4 className="font-semibold mb-3">Price Summary</h4>

        <div className="flex justify-between text-sm">
          <span>Base Price:</span>
          <span>₹{basePrice}</span>
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span>Subtotal:</span>
          <span>₹{basePrice}</span>
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span>GST (18%):</span>
          <span>₹{gst}</span>
        </div>

        <div className="flex justify-between font-bold text-lg mt-3">
          <span>Total Amount:</span>
          <span className="text-purple-700">₹{total}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          {/* Exams */}
          <div className="bg-purple-100 rounded-xl py-4 text-center">
            <p className="text-xl font-bold text-purple-700">{totalExams}</p>
            <p className="text-sm text-gray-600">Exams</p>
          </div>

          {/* Courses */}
          <div className="bg-green-100 rounded-xl py-4 text-center">
            <p className="text-xl font-bold text-green-700">{totalCourses}</p>
            <p className="text-sm text-gray-600">Course</p>
          </div>

          {/* Days */}
          <div className="bg-yellow-100 rounded-xl py-4 text-center">
            <p className="text-xl font-bold text-yellow-600">90</p>
            <p className="text-sm text-gray-600">Days</p>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">


        <div className="bg-purple-50 rounded-lg p-4 mt-4 text-sm">
          <p className="font-semibold mb-2 flex items-center gap-2">
            <Sparkles size={16} className="text-purple-600" />
            What's Included:
          </p>
          <ul className="space-y-1 text-gray-600">
            <li className="flex items-center gap-2">
              <Check size={14} className="text-green-600" />
              Detailed performance analytics
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-green-600" />
              Industry-recognized certificates
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-green-600" />
              Mobile & desktop access
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-green-600" />
              24/7 customer support
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
