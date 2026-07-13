import React from "react";
import { ArrowLeft, Plus } from "lucide-react";

type SubscriptionHeaderProps = {
  title: string;
  subtitle: string;
  onCreateNew: () => void;
};

const SubscriptionHeader: React.FC<SubscriptionHeaderProps> = ({ title, subtitle, onCreateNew }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-slate-900">
          {title}
        </h1>
        <p className="mt-1 text-[15px] text-slate-500">
          {subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={onCreateNew}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 text-sm font-medium text-white shadow-[0_8px_20px_rgba(124,58,237,0.28)] transition hover:opacity-95"
      >
        <Plus size={16} />
        Create New Plan
      </button>
    </div>
  );
};

export default SubscriptionHeader;
