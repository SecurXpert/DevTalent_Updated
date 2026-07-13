import React from "react";
import { FileText, Users, CheckCircle } from "lucide-react";

type ExamItem = {
  title: string;
  enrolled: number;
  completed: number;
  avg: number;
};

const exams: ExamItem[] = [
  {
    title: "Data Structures Final",
    enrolled: 45,
    completed: 42,
    avg: 78,
  },
  {
    title: "Python Programming Quiz",
    enrolled: 67,
    completed: 65,
    avg: 85,
  },
  {
    title: "Database Management",
    enrolled: 38,
    completed: 35,
    avg: 72,
  },
  {
    title: "Web Development",
    enrolled: 52,
    completed: 50,
    avg: 88,
  },
];

const RecentExamActivity: React.FC = () => {
  return (
    <div
      className="max-full bg-white rounded-2xl p-6"
      style={{
        borderTop: "1.32px solid #F3E8FF",
        boxShadow:
          "0px 1.32px 2.65px -1.32px #0000001A, 0px 1.32px 3.97px 0px #0000001A",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Exam Activity
        </h2>
        <button className="text-indigo-500 font-medium hover:underline">
          View All
        </button>
      </div>

      {/* List */}
      <div className="mt-6 space-y-5">
        {exams.map((exam, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-5 rounded-xl border border-purple-200 bg-white hover:shadow-sm transition"
          >
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                <FileText size={26} />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {exam.title}
                </h3>

                <div className="flex items-center gap-3 text-gray-500 text-sm mt-1">
                  <span className="flex items-center gap-1">
                    <Users size={16} />
                    {exam.enrolled} enrolled
                  </span>

                  <span>•</span>

                  <span className="flex items-center gap-1">
                    <CheckCircle size={16} />
                    {exam.completed} completed
                  </span>
                </div>
              </div>
            </div>

            {/* Right Badge */}
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {exam.avg}% avg
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentExamActivity;
