import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, BookOpen } from "lucide-react";

export interface Exam {
  id: number;
  title: string;
  description: string;
  collage: string;
  window_start: string;
  window_end: string;
  duration: number;
  category: string;
  questions: Record<string, any>;
  question_count: number;
  total_marks: number;
}

interface ExamCardProps {
  exam: Exam;
  formatDateTime: (dateStr: string) => string;
  handleStartExam: (examId: number, category: string) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  formatDateTime,
  handleStartExam,
}) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-xl border-t-4"
      style={{ borderTopColor: "#dbdbdcff" }}
    >
      <div className="p-6">
        <div className="flex flex-col gap-2 mb-6">
          <h4 className="text-xl font-bold text-gray-900">{exam.title}</h4>
          <Badge
            className="rounded-full px-3 py-1 text-sm font-medium w-fit"
            style={{
              background: "linear-gradient(180deg, #6E25B3 0%, #6D28D9 100%)",
              color: "white",
            }}
          >
            {exam.duration} Mins
          </Badge>
        </div>

        <div className="space-y-3 text-gray-700 text-sm mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4" color="#7C3AED" />
            <span>Start: {formatDateTime(exam.window_start)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4" color="#7C3AED" />
            <span>Duration: {exam.duration} mins</span>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4" color="#7C3AED" />
            <span>
              {exam.question_count} Questions: {exam.total_marks} marks
            </span>
          </div>
        </div>

        <Button
          onClick={() => handleStartExam(exam.id, exam.category)}
          className="w-full text-base font-semibold text-white rounded-lg py-3"
          style={{
            background: "linear-gradient(180deg, #6E24A5 0%, #6D28D9 100%)",
            cursor: "pointer",
          }}
        >
          Start Exam Now
        </Button>
      </div>
    </div>
  );
};
