import React from "react";

export type StatCardType = {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
  icon: React.ElementType;
  color: string;
  extraStats?: { label: string; value: string }[];
};

export type Registration = {
  id: number;
  name: string;
  course: string;
  date: string;
  initials: string;
};

export type ExamActivity = {
  id: number;
  title: string;
  enrolled: number;
  completed: number;
  avg: string;
};

export type UpcomingExam = {
  id: number;
  title: string;
  date: string;
  time: string;
  students: number;
  status: string;
};

export type DashboardResponse = {
  stats: StatCardType[];
  registrations: Registration[];
  examActivity: ExamActivity[];
  upcomingExams: UpcomingExam[];
};
