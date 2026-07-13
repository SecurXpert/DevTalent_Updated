import React from "react";
import { DollarSign, Clock, Save } from "lucide-react";

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

type PricingDetailsProps = {
  form: FormState;
  errors: FormErrors;
  onInputChange: (key: keyof FormState, value: string | string[]) => void;
  onSave?: () => void;
  onCancel?: () => void;
  view?: "list" | "create" | "edit";
};

const PricingDetails: React.FC<PricingDetailsProps> = ({
  form,
  errors,
  onInputChange,
  onSave,
  onCancel,
  view,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
          style={{
            background: "linear-gradient(135deg, #00BC7D 0%, #00A63E 100%)",
          }}
        >
          <DollarSign size={18} />
        </div>
        <div>
          <h2 className="text-[18px] font-semibold text-slate-900">
            Pricing Details
          </h2>
          <p className="text-sm text-slate-500">
            Set the pricing structure for this subscription
          </p>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Amount (₹) <span className="text-red-500">*</span>
        </label>
        <div
          className={`flex h-12 items-center gap-2 rounded-xl border bg-white px-4 ${
            errors.amount
              ? "border-red-400"
              : "border-slate-300 focus-within:border-indigo-500"
          }`}
        >
          <span className="text-slate-400">₹</span>
          <input
            type="text"
            value={form.amount}
            onChange={(e) => onInputChange("amount", e.target.value)}
            placeholder="999"
            className="h-full w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
        {errors.amount && (
          <p className="mt-1 text-xs font-medium text-red-500">
            {errors.amount}
          </p>
        )}
      </div>

      {/* Buttons - Bottom Right */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
          style={{ backgroundColor: "#4F39F6" }}
        >
          <Save size={16} />
          {view === "create" ? "Create Plan" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default PricingDetails;
