import React from "react";
import { Card } from "@/components/ui/card";
import { Award, TrendingUp, Users } from "lucide-react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const MetricCards: React.FC = () => {
  return (
    <div className="mt-3 sm:mt-4 laptop:mt-5 grid grid-cols-2 gap-3 sm:gap-4 laptop:grid-cols-2 xl:grid-cols-4">
      <Card
        className="p-1 sm:p-2 laptop:p-3 xl:p-4"
        style={{
          borderTop: "1.32px solid #F3E8FF",
          boxShadow:
            "0px 1.32px 2.65px -1.32px #0000001A, 0px 1.32px 3.97px 0px #0000001A",
        }}
      >
        <div className="mb-1 sm:mb-2 laptop:mb-3 flex items-center justify-between">
          <div
            className="flex h-6 w-6 sm:h-8 sm:w-8 laptop:h-10 laptop:w-10 items-center justify-center rounded-lg sm:rounded-xl laptop:rounded-xl text-white shadow-md"
            style={{
              background: "linear-gradient(135deg, #00C950 0%, #009966 100%)",
            }}
          >
            <Award
              size={
                window.innerWidth < 640
                  ? 16
                  : window.innerWidth < 1024
                    ? 18
                    : 20
              }
            />
          </div>
          <span className="text-[10px] sm:text-[11px] laptop:text-[13px] font-semibold text-[#09a64b] flex items-center gap-1">
            <TrendingUp size={12} /> 2.3%
          </span>
        </div>
        <p className="font-Inter-regular text-[12px] sm:text-[10px] laptop:text-[14px] text-[12px]">
          Pass Rate
        </p>
        <h3 className="mt-1 text-[12px] sm:text-[14px] laptop:text-[10px] xl:text-[18px] font-bold text-[#172033]">
          87.5%
        </h3>
      </Card>

      <Card
        className="p-1 sm:p-2 laptop:p-3 xl:p-4"
        style={{
          borderTop: "1.32px solid #F3E8FF",
          boxShadow:
            "0px 1.32px 2.65px -1.32px #0000001A, 0px 1.32px 3.97px 0px #0000001A",
        }}
      >
        <div className="mb-1 sm:mb-2 laptop:mb-3 flex items-center justify-between">
          <div
            className="flex h-6 w-6 sm:h-8 sm:w-8 laptop:h-10 laptop:w-10 items-center justify-center rounded-lg sm:rounded-xl laptop:rounded-xl text-white shadow-md"
            style={{
              background: "linear-gradient(135deg, #615FFF 0%, #9810FA 100%)",
            }}
          >
            <TrendingUp
              size={
                window.innerWidth < 640
                  ? 16
                  : window.innerWidth < 1024
                    ? 18
                    : 20
              }
            />
          </div>
          <span className="text-[10px] sm:text-[11px] laptop:text-[13px] font-semibold text-[#4f46e5] flex items-center gap-1">
            <TrendingUp size={12} /> 1.8%
          </span>
        </div>
        <p className="font-Inter-regular text-[12px] sm:text-[10px] laptop:text-[14px] text-[12px]">
          Avg. Score
        </p>
        <h3 className="mt-1 text-[12px] sm:text-[14px] laptop:text-[10px] xl:text-[18px] font-bold text-[#172033]">
          81.2%
        </h3>
      </Card>

      <Card
        className="p-1 sm:p-2 laptop:p-3 xl:p-4"
        style={{
          borderTop: "1.32px solid #F3E8FF",
          boxShadow:
            "0px 1.32px 2.65px -1.32px #0000001A, 0px 1.32px 3.97px 0px #0000001A",
        }}
      >
        <div className="mb-1 sm:mb-2 laptop:mb-3 flex items-center justify-between">
          <div
            className="flex h-6 w-6 sm:h-8 sm:w-8 laptop:h-10 laptop:w-10 items-center justify-center rounded-lg sm:rounded-xl laptop:rounded-xl text-white shadow-md"
            style={{
              background: "linear-gradient(135deg, #2B7FFF 0%, #0092B8 100%)",
            }}
          >
            <Users
              size={
                window.innerWidth < 640
                  ? 16
                  : window.innerWidth < 1024
                    ? 18
                    : 20
              }
            />
          </div>
          <span className="text-[10px] sm:text-[11px] laptop:text-[13px] font-semibold text-[#2563eb] flex items-center gap-1">
            <TrendingUp size={12} /> 3.1%
          </span>
        </div>
        <p className="font-Inter-regular text-[12px] sm:text-[10px] laptop:text-[14px] text-[12px]">
          Total Students
        </p>
        <h3 className="mt-1 text-[12px] sm:text-[14px] laptop:text-[10px] xl:text-[18px] font-bold text-[#172033]">
          2,847
        </h3>
      </Card>

      <Card
        className="p-1 sm:p-2 laptop:p-3 xl:p-4"
        style={{
          borderTop: "1.32px solid #F3E8FF",
          boxShadow:
            "0px 1.32px 2.65px -1.32px #0000001A, 0px 1.32px 3.97px 0px #0000001A",
        }}
      >
        <div className="mb-1 sm:mb-2 laptop:mb-3 flex items-center justify-between">
          <div
            className="flex h-6 w-6 sm:h-8 sm:w-8 laptop:h-10 laptop:w-10 items-center justify-center rounded-lg sm:rounded-xl laptop:rounded-xl text-white shadow-md"
            style={{
              background: "linear-gradient(135deg, #AD46FF 0%, #E60076 100%)",
            }}
          >
            <IoMdCheckmarkCircleOutline
              size={
                window.innerWidth < 640
                  ? 16
                  : window.innerWidth < 1024
                    ? 18
                    : 20
              }
            />
          </div>
          <span className="text-[10px] sm:text-[11px] laptop:text-[13px] font-semibold text-[#a21caf] flex items-center gap-1">
            <TrendingUp size={12} /> 0.9%
          </span>
        </div>
        <p className="font-Inter-regular text-[12px] sm:text-[10px] laptop:text-[14px] text-[12px]">
          Completion Rate
        </p>
        <h3 className="mt-1 text-[12px] sm:text-[14px] laptop:text-[10px] xl:text-[18px] font-bold text-[#172033]">
          92.1%
        </h3>
      </Card>
    </div>
  );
};

export default MetricCards;
