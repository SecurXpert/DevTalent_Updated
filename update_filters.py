import re

with open("src/IndividualStudent/Results.tsx", "r") as f:
    content = f.read()

# Add states
state_injection = """
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sortOrder, setSortOrder] = useState('Latest');
"""
content = content.replace(
    'const [summary, setSummary] = useState({',
    state_injection + '\n  const [summary, setSummary] = useState({'
)

# Compute filtered results
# I'll put this right before the return statement
filtered_results_logic = """
  const filteredAndSortedResults = resultsData
    .filter(result => {
      // 1. Search text
      if (searchTerm && !result.courseName.toLowerCase().includes(searchTerm.toLowerCase()) && !result.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      // 2. Course
      if (courseFilter !== 'All Courses' && result.courseName !== courseFilter) return false;
      // 3. Type
      if (typeFilter !== 'All Types') {
        const t = typeFilter.toLowerCase();
        if (t === 'mcq' && result.type?.toLowerCase() !== 'mcq') return false;
        if (t === 'coding' && result.type?.toLowerCase() !== 'coding') return false;
      }
      // 4. Status
      if (statusFilter !== 'All Status' && result.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'Latest') return b.createdAt - a.createdAt;
      return a.createdAt - b.createdAt;
    });

  const uniqueCourses = Array.from(new Set(resultsData.map(r => r.courseName))).filter(Boolean);

  return (
"""
content = content.replace("  return (\n", filtered_results_logic)

# Replace length indicator
content = content.replace("resultsData.length", "filteredAndSortedResults.length")

# Replace map call
content = content.replace("resultsData.map((result)", "filteredAndSortedResults.map((result)")


# Replace filter buttons with select dropdowns
buttons_section_old = """          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm text-gray-600 hover:bg-gray-50">
              <BookOpen className="w-4 h-4" />
              All Courses
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm text-gray-600 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              All Types
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm text-gray-600 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              All Status
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-purple-200 text-purple-600 rounded-xl text-sm hover:bg-purple-50">
              <ArrowUpDown className="w-4 h-4" />
              Latest
            </button>
          </div>"""

buttons_section_new = """          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <BookOpen className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select 
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border rounded-xl text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer min-w-[140px]"
              >
                <option value="All Courses">All Courses</option>
                {uniqueCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="relative">
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border rounded-xl text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer min-w-[130px]"
              >
                <option value="All Types">All Types</option>
                <option value="MCQ">MCQ</option>
                <option value="Coding">Coding</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="relative">
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border rounded-xl text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer min-w-[130px]"
              >
                <option value="All Status">All Status</option>
                <option value="Passed">Passed</option>
                <option value="Failed">Failed</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="relative">
              <ArrowUpDown className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border border-purple-200 text-purple-600 rounded-xl text-sm hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer min-w-[120px]"
              >
                <option value="Latest">Latest</option>
                <option value="Oldest">Oldest</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-purple-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>"""

content = content.replace(buttons_section_old, buttons_section_new)

with open("src/IndividualStudent/Results.tsx", "w") as f:
    f.write(content)

print("Done")
