import React from "react";
import { Users, Clock3, DollarSign } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  iconWrap: string;
  icon: React.ReactNode;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, iconWrap, icon }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconWrap}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-1 text-[15px] font-semibold text-slate-900 sm:text-[17px]">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
};

const SubscriptionStats: React.FC = () => {
  const statCards = [
    {
      title: "Total Plans",
      value: "4",
      iconWrap: "bg-indigo-100 text-indigo-600",
      icon: <Users size={18} />,
    },
    {
      title: "Active Subscriptions",
      value: "5",
      iconWrap: "bg-green-100 text-green-600",
      icon: <Clock3 size={18} />,
    },
    {
      title: "Pending Payments",
      value: "1",
      iconWrap: "bg-amber-100 text-amber-600",
      icon: <Clock3 size={18} />,
    },
    {
      title: "Monthly Revenue",
      value: "$2,388",
      iconWrap: "bg-emerald-100 text-emerald-600",
      icon: <DollarSign size={18} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statCards.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          iconWrap={item.iconWrap}
          icon={item.icon}
        />
      ))}
    </div>
  );
};

export default SubscriptionStats;
