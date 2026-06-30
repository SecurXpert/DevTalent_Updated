import React from "react";
import { useNavigate } from "react-router-dom";
import { ResultData } from "../../data/resultsData";

interface ResultsTableProps {
  results: ResultData[];
}

const getColor = (percent: number) => {
  if (percent >= 80) return "bg-green-500";
  if (percent >= 60) return "bg-blue-500";
  if (percent >= 40) return "bg-yellow-500";
  return "bg-red-500";
};

function ResultsTable({ results }: ResultsTableProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm mt-6">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Results List</h2>
        <span className="text-sm text-gray-500">Showing {results.length} results</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-xl overflow-hidden">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exam
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Percentage
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((item, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-4">{item.course}</td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  {item.name}
                </td>
                <td className="px-6 py-4">{item.exam}</td>
                <td className="px-6 py-4">{item.score}</td>

                {/* Percentage with bar */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getColor(item.percent)}`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <span>{item.percent}%</span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      item.status === "Pass"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">{item.time}</td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => navigate(`/result/${item.id}`)}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResultsTable;
