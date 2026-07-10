import React from "react";
import { TrendingUp } from "lucide-react";
import { Card } from "./SharedUI";
import { StatCardType } from "./types";

export function StatCardsGrid({ stats }: { stats: StatCardType[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-3 laptop:gap-3 xl:gap-4 mt-5 laptop:grid-cols-2 xl:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="p-1 sm:p-3 laptop:p-3 xl:p-2">
            <div className="flex items-start justify-between gap-1 sm:gap-2 laptop:gap-1 xl:gap-4">
              <div className="flex-1 min-w-0">
                <p className=" py-1 p-2 max-w-[100px] sm:max-w-[150px] laptop:max-w-[150px] xl:max-w-[170px] font-Inter-medium leading-[1.35] text-[14px]">
                  {item.title}
                </p>
                <h3 className=" p-1 mt-1 sm:mt-3 laptop:mt-1 text-[10px] sm:text-[15px] laptop:text-[18px] gap-1 xl:text-[20px] font-bold leading-none text-[#172033]">
                  {item.value}
                </h3>
                {item.extraStats ? (
                  <div className="mt-2 sm:mt-3 laptop:mt-4 flex gap-4 text-[12px] font-medium text-[#5d677a]">
                    {item.extraStats.map((stat, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] laptop:text-[11px] text-gray-400 uppercase">{stat.label}</span>
                        <span className="text-[12px] sm:text-[14px] laptop:text-[15px] font-bold text-gray-700">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 sm:mt-3 laptop:mt-4 text-[16px] sm:text-[11px] laptop:text-[15px] gap-1 xl:text-[11px] font-medium text-[#09a64b] flex items-end">
                    <TrendingUp size={20} /> {item.change}
                  </p>
                )}
              </div>

              <div
                className={`flex h-[24px] w-[24px] sm:h-[24px] sm:w-[28px] laptop:h-[40px] laptop:w-[40px] xl:h-[52px] xl:w-[52px] items-center justify-center rounded-lg sm:rounded-xl laptop:rounded-xl xl:rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg flex-shrink-0`}
              >
                <Icon size={20} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
