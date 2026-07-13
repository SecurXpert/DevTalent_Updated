import { useNavigate, useParams } from "react-router-dom";
import { resultsData } from "../../data/resultsData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FiArrowLeft,
  FiMail,
  FiCalendar,
  FiBookOpen,
  FiTrendingUp,
  FiAward,
} from "react-icons/fi";

interface StudentProfileProps {
  student?: any;
  onClose?: () => void;
}

const StudentProfile = ({ onClose }: StudentProfileProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Find the base student from resultsData using the ID
  const baseStudent = resultsData.find(
    (result) => result.id === parseInt(id || "0"),
  );

  // Generate derived properties that don't exist in ResultData
  const studentWithData = baseStudent
    ? {
        ...baseStudent,
        initials: baseStudent.name
          .split(" ")
          .map((n) => n[0])
          .join(""),
        year: `Year ${Math.floor(Math.random() * 4) + 1}`, // Random year 1-4
        registered: "2025-09-15", // Default registration date
      }
    : null;

  const handleBack = () => {
    // Navigate back to students list
    navigate("/students");
    // Scroll to top when going back to students list
    window.scrollTo(0, 0);
  };

  // Generate dynamic performance data based on student's actual percent
  const performanceData = [
    {
      month: "Sep",
      value: Math.max(60, (studentWithData?.percent || 80) - 15),
    },
    {
      month: "Oct",
      value: Math.max(65, (studentWithData?.percent || 80) - 10),
    },
    {
      month: "Nov",
      value: Math.max(70, (studentWithData?.percent || 80) - 5),
    },
    {
      month: "Dec",
      value: Math.max(75, (studentWithData?.percent || 80) - 3),
    },
    {
      month: "Jan",
      value: Math.max(78, (studentWithData?.percent || 80) - 2),
    },
    {
      month: "Feb",
      value: Math.max(80, (studentWithData?.percent || 80) - 1),
    },
    { month: "Mar", value: studentWithData?.percent || 80 },
  ];

  // Use the actual exam data from the student's result
  const examData = studentWithData
    ? [
        {
          id: studentWithData.id,
          name: studentWithData.exam,
          score: studentWithData.score,
          date: studentWithData.time.split(",")[0], // Extract date from timestamp
          status: studentWithData.status,
          duration: studentWithData.duration,
          questions:
            studentWithData.mcqTotal + studentWithData.codingProblems * 5, // Estimate total questions
          correct:
            studentWithData.mcqCorrect +
            Math.round(
              (studentWithData.codingScore / studentWithData.codingMaxScore) *
                (studentWithData.codingProblems * 5),
            ),
          incorrect:
            studentWithData.mcqTotal -
            studentWithData.mcqCorrect +
            Math.round(
              ((studentWithData.codingMaxScore - studentWithData.codingScore) /
                studentWithData.codingMaxScore) *
                (studentWithData.codingProblems * 5),
            ),
          topics: ["MCQ", "Coding Problems"],
          instructor: "Various",
          feedback:
            studentWithData.status === "Pass"
              ? "Good performance overall."
              : "Needs improvement in key areas.",
        },
      ]
    : [];

  return (
    <div className="bg-[#F3F0FF] min-h-screen px-1 sm:px-4 md:p-6">
      {/* Back */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-purple-600 mb-3 sm:mb-4 md:mb-6 hover:text-purple-800 transition-colors"
      >
        <FiArrowLeft /> Back to Students
      </button>

      {/* Header Card */}
      <div className="w-full mx-auto bg-white border rounded-2xl px-1 sm:px-3 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 shadow-sm mb-4 sm:mb-6">
        {/* Mobile Layout - Block Structure */}
        <div className="sm:hidden flex flex-row gap-4">
          {/* Avatar Block */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
              {studentWithData?.initials || "ST"}
            </div>
          </div>

          {/* Name Block */}
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {studentWithData?.name || "Student Name"}
            </h2>
            <p className="text-gray-500 text-xs">
              {studentWithData?.course} - {studentWithData?.year}
            </p>
          </div>

          {/* Details Block */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-center gap-2">
              <FiMail className="text-gray-400 text-sm flex-shrink-0" />
              <div className="text-center">
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-xs text-gray-700 font-medium truncate max-w-[160px]">
                  {studentWithData?.email || "studentWithData@university.edu"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <FiCalendar className="text-gray-400 text-sm flex-shrink-0" />
              <div className="text-center">
                <p className="text-xs text-gray-400">Registration Date</p>
                <p className="text-xs text-gray-700 font-medium">
                  {studentWithData?.registered || "2025-09-15"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <FiBookOpen className="text-gray-400 text-sm flex-shrink-0" />
              <div className="text-center">
                <p className="text-xs text-gray-400">Total Exams</p>
                <p className="text-xs text-gray-700 font-medium">
                  {studentWithData ? 1 : 0}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons Block */}
          <div className="space-y-3">
            <button className="w-full px-3 py-3 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition">
              Edit Profile
            </button>
            <button className="w-full px-3 py-3 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition">
              Disable Account
            </button>
          </div>
        </div>

        {/* Desktop Layout - Flex Structure */}
        <div className="hidden sm:flex sm:flex-row sm:justify-between sm:items-center">
          {/* LEFT SECTION */}
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-2xl">
              {studentWithData?.initials || "ST"}
            </div>

            {/* Info */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {studentWithData?.name || "Student Name"}
              </h2>
              <p className="text-gray-500 mt-1">
                {studentWithData?.course} - {studentWithData?.year}
              </p>

              {/* DETAILS */}
              <div className="flex items-center gap-8 mt-5">
                <div className="flex items-center gap-2">
                  <FiMail className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-xs text-gray-700 font-medium">
                      {studentWithData?.email ||
                        "studentWithData@university.edu"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FiCalendar className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Registration Date</p>
                    <p className="text-xs text-gray-700 font-medium">
                      {studentWithData?.registered || "2025-09-15"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FiBookOpen className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Total Exams</p>
                    <p className="text-xs text-gray-700 font-medium">
                      {studentWithData ? 1 : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-4">
            <button className="px-5 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition">
              Edit Profile
            </button>
            <button className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition">
              Disable Account
            </button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6">
        <div className="bg-white rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-sm">
          <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
            <FiBookOpen className="text-blue-700 text-sm sm:text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Exams</p>
            <p className="text-sm sm:text-xl font-semibold">
              {studentWithData ? 1 : 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-sm">
          <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
            <FiAward className="text-green-700 text-sm sm:text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Average Score</p>
            <p className="text-sm sm:text-xl font-semibold">
              {studentWithData?.percent || 0}%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-sm">
          <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
            <FiTrendingUp className="text-blue-700 text-sm sm:text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Pass Rate</p>
            <p className="text-sm sm:text-xl font-semibold">91.7%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-sm">
          <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
            <FiAward className="text-purple-700 text-sm sm:text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Rank</p>
            <p className="text-sm sm:text-xl font-semibold">#24</p>
          </div>
        </div>
      </div>

      {/* Performance Trend */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-4 sm:mt-6">
        {/* Header */}
        <div className="px-1 sm:px-6 lg:px-8 py-2 sm:py-4 lg:py-6 border-b border-gray-300">
          <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">
            Performance Trend
          </h2>
        </div>

        {/* Chart */}
        <div className="p-2 sm:p-4 lg:p-6">
          <div className="h-48 sm:h-64 md:h-80 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { month: "Sep", value: 78 },
                  { month: "Oct", value: 75 },
                  { month: "Nov", value: 82 },
                  { month: "Dec", value: 80 },
                  { month: "Jan", value: 85 },
                  { month: "Feb", value: 88 },
                  { month: "Mar", value: 86 },
                ]}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                {/* Grid */}
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#e5e7eb"
                  vertical={true}
                />

                {/* Axes */}
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  axisLine={{ stroke: "#9ca3af" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  axisLine={{ stroke: "#9ca3af" }}
                  tickLine={false}
                />

                {/* Tooltip */}
                <Tooltip />

                {/* Line */}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    stroke: "#4f46e5",
                    strokeWidth: 3,
                    fill: "#ffffff",
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Exam History */}
      <div className="w-full mx-auto bg-white rounded-2xl shadow-sm mt-8 overflow-hidden">
        {/* Header */}
        <div className="px-1 sm:px-6 py-3 sm:py-4 border-b border-gray-300">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Exam History
          </h2>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            {/* Table Head */}
            <thead className="bg-gray-200 text-gray-600 text-xs sm:text-sm uppercase">
              <tr>
                <th className="px-1 sm:px-6 py-2 sm:py-3">Exam Name</th>
                <th className="px-1 sm:px-6 py-2 sm:py-3">Score</th>
                <th className="px-1 sm:px-6 py-2 sm:py-3">Status</th>
                <th className="px-1 sm:px-6 py-2 sm:py-3">Date</th>
                <th className="px-1 sm:px-6 py-2 sm:py-3">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-gray-800">
              {examData.map((exam) => (
                <tr key={exam.id} className="border-b border-gray-200">
                  <td className="px-1 sm:px-6 py-2 sm:py-4">
                    <div className="max-w-[80px] sm:max-w-none truncate">
                      <span className="text-xs sm:text-sm">{exam.name}</span>
                    </div>
                  </td>
                  <td className="px-1 sm:px-6 py-2 sm:py-4">
                    <span className="text-xs sm:text-sm">{exam.score}</span>
                  </td>
                  <td className="px-1 sm:px-6 py-2 sm:py-4">
                    <span className="px-1 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-1 sm:px-6 py-2 sm:py-4 text-gray-600">
                    <span className="text-xs sm:text-sm">{exam.date}</span>
                  </td>
                  <td className="px-1 sm:px-6 py-2 sm:py-4">
                    <button
                      onClick={() =>
                        navigate(`/students/studentresult/${exam.id}`)
                      }
                      className="text-indigo-600 hover:underline text-xs sm:text-sm"
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
    </div>
  );
};

export default StudentProfile;
