import re

with open("src/IndividualStudent/ViewScorecard.tsx", "r") as f:
    content = f.read()

# Imports
content = content.replace(
    "import { useNavigate } from 'react-router-dom';",
    "import { useNavigate, useLocation } from 'react-router-dom';"
)

# State and empty check
content = content.replace(
    "  const [activeTab, setActiveTab] = useState('Overview');",
    """  const location = useLocation();
  const exam = location.state?.exam;
  const [activeTab, setActiveTab] = useState('Overview');

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">No Scorecard Data Available</h2>
          <button 
            onClick={() => navigate('/student-results')}
            className="text-white bg-[#523de1] px-6 py-2.5 rounded-full transition shadow-sm"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }
"""
)

# Hero Card values
content = content.replace(
    "{402 - (402 * 75) / 100}",
    "{402 - (402 * exam.score) / 100}"
)
content = content.replace(
    "<span className=\"text-5xl font-bold text-[#523de1]\">75%</span>",
    "<span className=\"text-5xl font-bold text-[#523de1]\">{exam.score}%</span>"
)
content = content.replace(
    """<div className="mt-4 bg-green-50 text-green-600 px-6 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Passed
              </div>""",
    """<div className={`mt-4 px-6 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${exam.status === 'Passed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {exam.status === 'Passed' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {exam.status}
              </div>"""
)
# need to add XCircle to imports if not there. Let's do it manually later or now.
# the file has XCircle imported in Results.tsx but not ViewScorecard.tsx
content = content.replace(
    "import { \n  ArrowLeft, Printer, Share2, Download, \n  CheckCircle2, BarChart2, FileText, \n  Trophy, CheckCircle, Zap, BookOpen, ShieldCheck,\n  Clock, CheckSquare, Send, Award\n} from 'lucide-react';",
    "import { \n  ArrowLeft, Printer, Share2, Download, \n  CheckCircle2, BarChart2, FileText, \n  Trophy, CheckCircle, XCircle, Zap, BookOpen, ShieldCheck,\n  Clock, CheckSquare, Send, Award\n} from 'lucide-react';"
)

content = content.replace(
    "Data Structures & Algorithms",
    "{exam.courseName}"
)
content = content.replace(
    "Dynamic Programming Patterns",
    "{exam.title}"
)
content = content.replace(
    "<span className=\"text-5xl font-bold text-[#523de1]\">6</span>",
    "<span className=\"text-5xl font-bold text-[#523de1]\">{exam.marksEarned}</span>"
)
content = content.replace(
    "<span className=\"text-5xl font-bold text-purple-300\">8</span>",
    "<span className=\"text-5xl font-bold text-purple-300\">{exam.totalMarks}</span>"
)
content = content.replace(
    "Excellent work! You've successfully completed the assessment.",
    "{exam.status === 'Passed' ? \"Excellent work! You've successfully passed the assessment.\" : \"Don't give up! Review the material and try again.\"}"
)

# Stats grid
content = re.sub(r'<span className="text-3xl font-bold text-gray-700 mb-1">8</span>', r'<span className="text-3xl font-bold text-gray-700 mb-1">{exam.stats.total}</span>', content)
content = re.sub(r'<span className="text-3xl font-bold text-purple-400 mb-1">8</span>', r'<span className="text-3xl font-bold text-purple-400 mb-1">{exam.stats.attempted}</span>', content)
content = re.sub(r'<span className="text-3xl font-bold text-green-500 mb-1">6</span>', r'<span className="text-3xl font-bold text-green-500 mb-1">{exam.stats.correct}</span>', content)
content = re.sub(r'<span className="text-3xl font-bold text-red-500 mb-1">2</span>', r'<span className="text-3xl font-bold text-red-500 mb-1">{exam.stats.wrong}</span>', content)

# Analytics Tab
content = re.sub(r'<span className="font-bold text-gray-700">8</span>', r'<span className="font-bold text-gray-700">{exam.stats.total}</span>', content)
content = re.sub(r'<span className="font-bold text-purple-600">8</span>', r'<span className="font-bold text-purple-600">{exam.stats.attempted}</span>', content)
content = re.sub(r'<span className="font-bold text-green-600">6</span>', r'<span className="font-bold text-green-600">{exam.stats.correct}</span>', content)
content = re.sub(r'<span className="font-bold text-red-600">2</span>', r'<span className="font-bold text-red-600">{exam.stats.wrong}</span>', content)

content = re.sub(r'<span className="font-bold text-purple-600">6 marks</span>', r'<span className="font-bold text-purple-600">{exam.marksEarned} marks</span>', content)
content = re.sub(r'<span className="font-bold text-gray-700">8 marks</span>', r'<span className="font-bold text-gray-700">{exam.totalMarks} marks</span>', content)

content = re.sub(r'<span className="font-bold text-orange-500">60%</span>', r'<span className="font-bold text-orange-500">{exam.raw?.pass_percentage || 60}%</span>', content)
content = re.sub(r'<span className="font-bold text-green-600">75%</span>', r'<span className={`font-bold ${exam.status === \'Passed\' ? \'text-green-600\' : \'text-red-600\'}`}>{exam.score}%</span>', content)

# Overview Tab
# "100%"
content = content.replace("style={{ width: '100%' }}", "style={{ width: `${exam.stats.total > 0 ? Math.round((exam.stats.attempted / exam.stats.total) * 100) : 0}%` }}")
content = content.replace("text-gray-700 text-sm\">100%", "text-gray-700 text-sm\">{exam.stats.total > 0 ? Math.round((exam.stats.attempted / exam.stats.total) * 100) : 0}%")

# "75%"
content = content.replace("style={{ width: '75%' }}", "style={{ width: `${exam.stats.attempted > 0 ? Math.round((exam.stats.correct / exam.stats.attempted) * 100) : 0}%` }}")
content = content.replace("text-gray-700 text-sm\">75%", "text-gray-700 text-sm\">{exam.stats.attempted > 0 ? Math.round((exam.stats.correct / exam.stats.attempted) * 100) : 0}%")

# score 75% -> score 75%
content = content.replace("<div className=\"h-full bg-blue-500 rounded-full\" style={{ width: `${exam.stats.attempted > 0 ? Math.round((exam.stats.correct / exam.stats.attempted) * 100) : 0}%` }}></div>", "<div className=\"h-full bg-blue-500 rounded-full\" style={{ width: `${exam.score}%` }}></div>")
content = content.replace("<div className=\"w-12 text-right font-bold text-gray-700 text-sm\">{exam.stats.attempted > 0 ? Math.round((exam.stats.correct / exam.stats.attempted) * 100) : 0}%</div>", "<div className=\"w-12 text-right font-bold text-gray-700 text-sm\">{exam.score}%</div>")

# "60%"
content = content.replace("style={{ width: '60%' }}", "style={{ width: `${exam.raw?.pass_percentage || 60}%` }}")
content = content.replace("text-gray-700 text-sm\">60%", "text-gray-700 text-sm\">{exam.raw?.pass_percentage || 60}%")

# Accuracy meter
content = content.replace("style={{ width: \"75%\" }}", "style={{ width: `${exam.stats.attempted > 0 ? Math.round((exam.stats.correct / exam.stats.attempted) * 100) : 0}%` }}")
content = content.replace("75% accurate", "{exam.stats.attempted > 0 ? Math.round((exam.stats.correct / exam.stats.attempted) * 100) : 0}% accurate")

# Feedback
content = content.replace("Outstanding performance! You scored 75%, well above the passing threshold. Your dedication to mastering Data Structures & Algorithms is clearly showing. Keep up this excellent momentum!", "{exam.status === 'Passed' ? `Outstanding performance! You scored ${exam.score}%. Your dedication to mastering ${exam.courseName} is clearly showing. Keep up this excellent momentum!` : `You scored ${exam.score}%. Keep reviewing the material and try again. Practice is the key to success!`}")

# Exam Info Tab
content = content.replace("STU-20240001", "{exam.raw?.student_id || 'N/A'}")
content = content.replace("CRS-DSA-201", "{exam.courseId || 'N/A'}")
content = content.replace("EXM-DP-007", "{exam.raw?.exam_id || 'N/A'}")
content = content.replace("ATT-20240007", "{exam.raw?.attempt_id || 'N/A'}")
content = content.replace(">Coding<", ">{exam.type}<")
content = content.replace("May 28, 2026", "{exam.date}")
content = content.replace(">10:00 AM<", ">{exam.time}<")

# Exam Timeline
content = content.replace("{exam.date} at 10:00 AM", "{exam.date} at {exam.time}")
content = content.replace("8 of 8 answered", "{exam.stats.attempted} of {exam.stats.total} answered")

with open("src/IndividualStudent/ViewScorecard.tsx", "w") as f:
    f.write(content)
