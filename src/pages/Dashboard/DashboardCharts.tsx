import React from "react";
import { Card } from "@/components/ui/card";
import PerformanceDistribution from "./PerformanceDistribution";
import ExamParticipation from "./ExamParticipation";

const DashboardCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <Card
        className="p-4"
        style={{
          borderTop: "1.32px solid #F3E8FF",
          boxShadow:
            "0px 1.32px 2.65px -1.32px #0000001A, 0px 1.32px 3.97px 0px #0000001A",
        }}
      >
        <PerformanceDistribution />
      </Card>
      <Card
        className="p-4"
        style={{
          borderTop: "1.32px solid #F3E8FF",
          boxShadow:
            "0px 1.32px 2.65px -1.32px #0000001A, 0px 1.32px 3.97px 0px #0000001A",
        }}
      >
        <ExamParticipation />
      </Card>
    </div>
  );
};

export default DashboardCharts;
