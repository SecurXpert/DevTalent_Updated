import React, { useMemo } from "react";
import { FaArrowUp } from "react-icons/fa";

type StatCard = {
  title: string;
  value: string | number;
  sub: string;
  color: "green" | "blue" | "purple";
};

type ReportStatsProps = {
  apiData?: any[];
};

const ReportStats: React.FC<ReportStatsProps> = ({ apiData }) => {
  const statCards = useMemo<StatCard[]>(() => {
    if (!apiData || apiData.length === 0) {
      return [
        { title: "Overall Pass Rate", value: "N/A", sub: "Loading...", color: "green" },
        { title: "Avg. Participation", value: "N/A", sub: "Loading...", color: "blue" },
        { title: "Avg. Exam Score", value: "N/A", sub: "Loading...", color: "purple" },
      ];
    }

    const totalPassed = apiData.reduce((sum, item) => sum + (Number(item.total_exams_passed) || 0), 0);
    const totalAttempted = apiData.reduce((sum, item) => sum + (Number(item.total_exams_attempted) || 0), 0);
    const totalMapped = apiData.reduce((sum, item) => sum + (Number(item.total_exams_mapped) || 0), 0);
    const sumAveragePercentage = apiData.reduce((sum, item) => sum + (Number(item.average_percentage) || 0), 0);

    const overallPassRate = totalAttempted > 0 ? ((totalPassed / totalAttempted) * 100).toFixed(1) + "%" : "0%";
    const avgParticipation = totalMapped > 0 ? ((totalAttempted / totalMapped) * 100).toFixed(1) + "%" : "0%";
    const avgExamScore = apiData.length > 0 ? (sumAveragePercentage / apiData.length).toFixed(1) + "%" : "0%";

    return [
      {
        title: "Overall Pass Rate",
        value: overallPassRate,
        sub: "Based on all exams",
        color: "green",
      },
      {
        title: "Avg. Participation",
        value: avgParticipation,
        sub: "Attempted vs Mapped",
        color: "blue",
      },
      {
        title: "Avg. Exam Score",
        value: avgExamScore,
        sub: "Average across students",
        color: "purple",
      },
    ];
  }, [apiData]);

  const getCardColor = (color: StatCard["color"]) => {
    switch (color) {
      case "green":
        return "text-[#00B74A]";
      case "blue":
        return "text-[#3B4DFF]";
      case "purple":
        return "text-[#A020F0]";
      default:
        return "text-[#3B4DFF]";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border-1 border-grey-200 p-3 sm:p-4 md:p-5 shadow-sm"
        >
          <p className="text-[#64748b] text-[10px] sm:text-xs md:text-sm font-medium">
            {card.title}
          </p>
          <h2
            className={`text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold mt-2 ${getCardColor(card.color)}`}
          >
            {card.value}
          </h2>
          <p className="text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px] text-[#6b7280] font-medium mt-1 flex items-center gap-1">
            <FaArrowUp className="text-grey-500 text-[10px] sm:text-xs" />
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReportStats;
