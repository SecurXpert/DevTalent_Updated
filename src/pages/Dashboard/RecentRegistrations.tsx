import React from "react";
import { Card } from "@/components/ui/card";

type Registration = {
  id: number;
  name: string;
  course: string;
  date: string;
  initials: string;
};

type RecentRegistrationsProps = {
  registrations: Registration[];
};

const RecentRegistrations: React.FC<RecentRegistrationsProps> = ({
  registrations,
}) => {
  return (
    <Card
      className="p-4 rounded-xl"
      style={{
        borderTop: "1.32px solid #F3E8FF",
        boxShadow:
          "0px 1.32px 2.65px -1.32px #0000001A, 0px 1.32px 3.97px 0px #0000001A",
      }}
    >
      <h2 className="text-lg font-semibold mb-4">Recent Registrations</h2>
      <div className="space-y-3">
        {registrations.map((reg) => (
          <div key={reg.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white text-md font-medium">
                {reg.initials}
              </div>
              <div>
                <p className="font-medium text-sm">{reg.name}</p>
                <p className="text-xs text-gray-500">{reg.course}</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">{reg.date}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentRegistrations;
