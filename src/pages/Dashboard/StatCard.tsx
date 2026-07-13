import React from "react";
import { Card } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
  icon: React.ElementType;
  color: string;
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  positive = true,
  icon: Icon,
  color,
}) => {
  return (
    <Card
      className="p-1 sm:p-3 laptop:p-3 xl:p-2"
      style={{
        borderTop: "1.32px solid #F3E8FF",
        boxShadow:
          "0px 1.32px 2.65px -1.32px #0000001A, 0px 1.32px 3.97px 0px #0000001A",
      }}
    >
      <div className="flex items-start justify-between gap-1 sm:gap-2 laptop:gap-1 xl:gap-4">
        <div className="flex-1 min-w-0">
          <p className="py-1 p-2 max-w-[100px] sm:max-w-[150px] laptop:max-w-[150px] xl:max-w-[170px] font-Inter-medium leading-[1.35] text-[14px]">
            {title}
          </p>
          <h3 className="p-1 mt-1 sm:mt-3 laptop:mt-1 text-[10px] sm:text-[15px] laptop:text-[18px] gap-1 xl:text-[20px] font-bold leading-none text-[#172033]">
            {value}
          </h3>
          <p className="mt-2 sm:mt-3 laptop:mt-4 text-[16px] sm:text-[11px] laptop:text-[15px] gap-1 xl:text-[11px] font-medium text-[#09a64b] flex items-end">
            <Icon size={20} /> {change}
          </p>
        </div>

        <div
          className={`flex h-[24px] w-[24px] sm:h-[24px] sm:w-[28px] laptop:h-[40px] laptop:w-[40px] xl:h-[52px] xl:w-[52px] items-center justify-center rounded-lg sm:rounded-xl laptop:rounded-xl xl:rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg flex-shrink-0`}
        >
          <Icon
            size={
              window.innerWidth < 640 ? 16 : window.innerWidth < 1024 ? 18 : 20
            }
          />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
