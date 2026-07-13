import React from "react";
import { Trophy, CheckCircle, Zap, BookOpen, ShieldCheck } from "lucide-react";

interface OverviewTabProps {
  exam: any;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ exam }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
        <h3 className="text-lg font-bold text-gray-900 mb-8">
          Performance Summary
        </h3>

        <div className="space-y-6 mb-12">
          {/* Attempt Rate */}
          <div className="flex items-center">
            <div className="w-40 text-sm font-medium text-gray-500">
              Attempt Rate
            </div>
            <div className="flex-1 flex items-center gap-4">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{
                    width: `${
                      exam.stats.total > 0
                        ? Math.round(
                            (exam.stats.attempted / exam.stats.total) * 100
                          )
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <div className="w-12 text-right font-bold text-gray-700 text-sm">
                {exam.stats.total > 0
                  ? Math.round((exam.stats.attempted / exam.stats.total) * 100)
                  : 0}
                %
              </div>
            </div>
          </div>

          {/* Correct Answer Rate */}
          <div className="flex items-center">
            <div className="w-40 text-sm font-medium text-gray-500">
              Correct Answer Rate
            </div>
            <div className="flex-1 flex items-center gap-4">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400 rounded-full"
                  style={{
                    width: `${
                      exam.stats.attempted > 0
                        ? Math.round(
                            (exam.stats.correct / exam.stats.attempted) * 100
                          )
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <div className="w-12 text-right font-bold text-gray-700 text-sm">
                {exam.score}%
              </div>
            </div>
          </div>

          {/* Score Achieved */}
          <div className="flex items-center">
            <div className="w-40 text-sm font-medium text-gray-500">
              Score Achieved
            </div>
            <div className="flex-1 flex items-center gap-4">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${exam.score}%` }}
                ></div>
              </div>
              <div className="w-12 text-right font-bold text-gray-700 text-sm">
                {exam.score}%
              </div>
            </div>
          </div>

          {/* Pass Requirement */}
          <div className="flex items-center">
            <div className="w-40 text-sm font-medium text-gray-500">
              Pass Requirement
            </div>
            <div className="flex-1 flex items-center gap-4">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex items-center">
                <div
                  className="h-full bg-orange-400 rounded-full"
                  style={{ width: `${exam.raw?.pass_percentage || 60}%` }}
                ></div>
                <div className="h-3 w-1 bg-white"></div>
              </div>
              <div className="w-12 text-right font-bold text-gray-700 text-sm">
                {exam.raw?.pass_percentage || 60}%
              </div>
            </div>
          </div>
        </div>

        {/* Accuracy Meter */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-4">
            Accuracy Meter
          </h4>
          <div className="relative pt-1">
            <div className="flex h-3 mb-4 overflow-hidden text-xs bg-gray-100 rounded-full">
              <div
                style={{
                  width: `${
                    exam.stats.attempted > 0
                      ? Math.round(
                          (exam.stats.correct / exam.stats.attempted) * 100
                        )
                      : 0
                  }%`,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
              <span>0%</span>
              <span className="text-gray-600">
                {exam.stats.attempted > 0
                  ? Math.round(
                      (exam.stats.correct / exam.stats.attempted) * 100
                    )
                  : 0}
                % accurate
              </span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-6">
        {/* Personalized Feedback */}
        <div className="bg-green-50/30 rounded-3xl p-6 border border-green-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Personalized Feedback
            </h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Outstanding performance! You scored 75%, well above the passing
            threshold. Your dedication to mastering {exam.courseName} is clearly
            showing. Keep up this excellent momentum!
          </p>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.04)] flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Achievements</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Exam Completed
              </span>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                First Attempt
              </span>
            </div>

            <div className="bg-green-50 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Course Completed
              </span>
            </div>

            <div className="bg-blue-50 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Verified Result
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
