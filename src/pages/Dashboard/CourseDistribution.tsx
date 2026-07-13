import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Computer Science", value: 30, color: "#4f46e5" },
  { name: "Data Science", value: 22, color: "#06b6d4" },
  { name: "Software Eng.", value: 19, color: "#8b5cf6" },
  { name: "IT", value: 17, color: "#10b981" },
  { name: "Others", value: 12, color: "#f59e0b" },
];

export default function CourseDistribution() {
  return (
    <div className="bg-white">
      <h2 className="text-xl font-semibold text-gray-800">
        Course Distribution
      </h2>
      <p className="text-gray-500 mb-4">Students by course</p>

      <div className="relative flex items-center justify-center">
        <ResponsiveContainer width={300} height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={0}
              outerRadius={80}
              paddingAngle={0.5}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Labels */}
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-8 right-0 text-indigo-600 text-sm">
            Computer Science: 30%
          </span>
          <span className="absolute top-12 left-4  text-cyan-500 text-sm">
            Data Science: 22%
          </span>
          <span className="absolute bottom-12 left-0 text-purple-500 text-sm">
            Software Eng.: 19%
          </span>
          <span className="absolute bottom-12 right-20 text-green-500 text-sm">
            IT: 17%
          </span>
          <span className="absolute right-0  bottom-24 text-amber-500 text-sm">
            Others: 12%
          </span>
        </div>
      </div>
    </div>
  );
}
