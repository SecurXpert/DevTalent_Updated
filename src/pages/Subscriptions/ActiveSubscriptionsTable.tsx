import React from "react";
import { MoreHorizontal } from "lucide-react";

type ActiveSubscriptionItem = {
  id: number;
  institution: string;
  planType: string;
  startDate: string;
  endDate: string;
  status: string;
  amount: number;
  mcqRemaining: number;
  codingRemaining: number;
};

type ActiveSubscriptionsTableProps = {
  subscriptions: ActiveSubscriptionItem[];
};

const ActiveSubscriptionsTable: React.FC<ActiveSubscriptionsTableProps> = ({
  subscriptions,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        {/* Header */}
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-6 py-4 text-left">Std. name</th>
            <th className="px-6 py-4 text-left">Plan Type</th>
            <th className="px-6 py-4 text-left">Start Date</th>
            <th className="px-6 py-4 text-left">End Date</th>
            <th className="px-6 py-4 text-left">MCQ Remaining</th>
            <th className="px-6 py-4 text-left">Coding Remaining</th>
            <th className="px-6 py-4 text-left">Payment Status</th>
            <th className="px-6 py-4 text-left">Actions</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="text-sm text-gray-700">
          {subscriptions.map((item) => (
            <tr key={item.id} className="border-t">
              {/* Institution */}
              <td className="px-6 py-5">
                <div>
                  <div className="font-medium text-gray-900">
                    {item.institution}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: #{item.id.toString().padStart(6, "0")}
                  </div>
                </div>
              </td>

              {/* Plan Type */}
              <td className="px-6 py-5">
                <div className="font-medium">{item.planType}</div>
              </td>

              {/* Start Date */}
              <td className="px-6 py-5">
                <span>{item.startDate}</span>
              </td>

              {/* End Date */}
              <td className="px-6 py-5">
                <div>
                  <span>{item.endDate}</span>
                  <div className="mt-1">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${new Date(item.endDate) < new Date()
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                        }`}
                    >
                      {new Date(item.endDate) < new Date()
                        ? "Expired"
                        : "Active"}
                    </span>
                  </div>
                </div>
              </td>

              {/* MCQ Remaining */}
              <td className="px-6 py-5">
                <span className="font-semibold text-gray-900">{item.mcqRemaining}</span>
              </td>

              {/* Coding Remaining */}
              <td className="px-6 py-5">
                <span className="font-semibold text-gray-900">{item.codingRemaining}</span>
              </td>

              {/* Status */}
              <td className="px-6 py-5">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : item.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {item.status}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <a
                    href="#"
                    className="hover:opacity-80 text-sm font-medium"
                    style={{ color: "#4F39F6" }}
                  >
                    Update
                  </a>
                  <a
                    href="#"
                    className="hover:opacity-80 text-sm font-medium"
                    style={{ color: "#155DFC" }}
                  >
                    Renew
                  </a>
                  <a
                    href="#"
                    className="hover:opacity-80 text-sm font-medium"
                    style={{ color: "#E7000B" }}
                  >
                    Suspend
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveSubscriptionsTable;
