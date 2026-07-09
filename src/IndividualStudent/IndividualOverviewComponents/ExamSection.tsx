import React from "react";
import { ExamCard, Exam } from "./ExamCard";

interface ExamSectionProps {
  title: string;
  exams: Exam[];
  formatDateTime: (dateStr: string) => string;
  handleStartExam: (examId: number, category: string) => void;
}

export const ExamSection: React.FC<ExamSectionProps> = ({
  title,
  exams,
  formatDateTime,
  handleStartExam,
}) => {
  if (exams.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-200">
        {title}
      </h2>
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {exams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            formatDateTime={formatDateTime}
            handleStartExam={handleStartExam}
          />
        ))}
      </div>
    </div>
  );
};
