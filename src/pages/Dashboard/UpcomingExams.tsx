import React from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

type UpcomingExam = {
  id: number;
  title: string;
  date: string;
  time: string;
  students: number;
  status: string;
};

type UpcomingExamsProps = {
  upcomingExams: UpcomingExam[];
};

const UpcomingExams: React.FC<UpcomingExamsProps> = ({ upcomingExams }) => {
  return (
    <Card
      className="p-4"
      style={{
        borderTop: "1.32px solid #F3E8FF",
        boxShadow:
          "0px 1.32px 2.65px -1.32px #0000001A, 0px 1.32px 3.97px 0px #0000001A",
      }}
    >
      <h2 className="text-lg font-semibold mb-4">Upcoming Exams</h2>
      <div className="space-y-3">
        {upcomingExams.map((exam) => (
          <div key={exam.id} className="border rounded-lg p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-sm">{exam.title}</h3>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {exam.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {exam.time}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {exam.students} students
                </p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    exam.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {exam.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default UpcomingExams;
