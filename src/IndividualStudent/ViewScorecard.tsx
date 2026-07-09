import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { ScorecardHeader } from "./ViewScorecardComponents/ScorecardHeader";
import { ScorecardHero } from "./ViewScorecardComponents/ScorecardHero";
import { ScorecardTabs } from "./ViewScorecardComponents/ScorecardTabs";
import { OverviewTab } from "./ViewScorecardComponents/OverviewTab";
import { AnalyticsTab } from "./ViewScorecardComponents/AnalyticsTab";
import { ExamInfoTab } from "./ViewScorecardComponents/ExamInfoTab";

const ViewScorecard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const exam = location.state?.exam;
  const [activeTab, setActiveTab] = useState("Overview");

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            No Scorecard Data Available
          </h2>
          <button
            onClick={() => navigate("/student-results")}
            className="text-white bg-[#523de1] px-6 py-2.5 rounded-full transition shadow-sm"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      <ScorecardHeader navigate={navigate} />

      <main className="max-w-5xl mx-auto mt-8 px-6">
        <ScorecardHero exam={exam} />

        <ScorecardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "Overview" && <OverviewTab exam={exam} />}

        {activeTab === "Analytics" && <AnalyticsTab exam={exam} />}

        {activeTab === "Exam Info" && <ExamInfoTab exam={exam} />}
      </main>
    </div>
  );
};

export default ViewScorecard;
