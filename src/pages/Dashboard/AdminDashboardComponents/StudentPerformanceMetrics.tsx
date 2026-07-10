import React from "react";
import { Card, SectionTitle, MiniProgress } from "./SharedUI";

export function StudentPerformanceMetrics() {
  return (
    <Card className="p-6 sm:p-6 laptop:p-4 xl:p-4">
      <SectionTitle
        title="Performance Distribution"
        subtitle="Students by performance level"
      />

      <div className="mt-2 sm:mt-2 laptop:mt-4 xl:mt-4">
        <MiniProgress
          label="Excellent (90-100%)"
          students="156 students"
          percent="18%"
          color="bg-[#11c14d]"
          width="w-[18%]"
        />
        <MiniProgress
          label="Good (80-89%)"
          students="342 students"
          percent="40%"
          color="bg-[#3b82f6]"
          width="w-[40%]"
        />
        <MiniProgress
          label="Average (70-79%)"
          students="268 students"
          percent="31%"
          color="bg-[#eab308]"
          width="w-[31%]"
        />
        <MiniProgress
          label="Below Average (<70%)"
          students="95 students"
          percent="11%"
          color="bg-[#ff3131]"
          width="w-[11%]"
        />
      </div>
    </Card>
  );
}
