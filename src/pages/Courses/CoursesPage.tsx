import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiEdit, FiTrash2, FiPlus, FiBookOpen, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { API_BASE_URL } from '@/pages/Services/api/api';

const CourseManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);
  const [courseExams, setCourseExams] = useState<Record<number, { mcq: any[], coding: any[], loading: boolean }>>({});

  const fetchExamsForCourse = async (courseId: number, currentCourses?: any[]) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      setCourseExams(prev => ({
        ...prev,
        [courseId]: {
          mcq: prev[courseId]?.mcq || [],
          coding: prev[courseId]?.coding || [],
          loading: true
        }
      }));

      const [mcqRes, codingRes] = await Promise.all([
        fetch(`${API_BASE_URL}/ind/mcq/admin/mapped-exams?course_id=${courseId}`, { headers }),
        fetch(`${API_BASE_URL}/ind/coding/admin/mapped-coding-exams?course_id=${courseId}`, { headers })
      ]);

      let mcqExams = [];
      let codingExams = [];

      if (mcqRes.ok) {
        const data = await mcqRes.json();
        mcqExams = Array.isArray(data) ? data : (data.items || data.data || data.exams || []);
      }
      if (codingRes.ok) {
        const data = await codingRes.json();
        codingExams = Array.isArray(data) ? data : (data.items || data.data || data.exams || []);
      }

      setCourseExams(prev => ({
        ...prev,
        [courseId]: {
          mcq: mcqExams,
          coding: codingExams,
          loading: false
        }
      }));

      setCourses(prevCourses => {
        const targetList = prevCourses.length > 0 ? prevCourses : (currentCourses || []);
        return targetList.map(c => {
          if (c.id === courseId) {
            const total = mcqExams.length + codingExams.length;
            const activeMcq = mcqExams.filter((e: any) => e.is_active || e.status === 'Active').length;
            const activeCoding = codingExams.filter((e: any) => e.is_active || e.status === 'Active').length;
            return {
              ...c,
              totalExams: total,
              examsAvailable: total,
              activeExams: activeMcq + activeCoding
            };
          }
          return c;
        });
      });

    } catch (error) {
      console.error(`Error fetching exams for course ${courseId}:`, error);
      setCourseExams(prev => ({
        ...prev,
        [courseId]: {
          mcq: prev[courseId]?.mcq || [],
          coding: prev[courseId]?.coding || [],
          loading: false
        }
      }));
    }
  };

  const handleToggleExpand = (course: any) => {
    if (expandedCourseId === course.id) {
      setExpandedCourseId(null);
    } else {
      setExpandedCourseId(course.id);
      if (!courseExams[course.id] || courseExams[course.id].loading) {
        fetchExamsForCourse(course.id);
      }
    }
  };

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const adminToken = localStorage.getItem('adminToken');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (adminToken) {
          headers['Authorization'] = `Bearer ${adminToken}`;
        }

        const response = await fetch(`${API_BASE_URL}/admin/catalog/courses`, {
          method: 'GET',
          headers
        });

        if (response.ok) {
          const data = await response.json();
          // Map API response to match UI structure
          const mappedCourses = data.map((course: any) => ({
            id: course.id,
            name: course.name,
            examsAvailable: 0, // Will need to fetch from exams API
            totalExams: 0, // Will need to fetch from exams API
            type: course.type_id.toString(), // Show type_id for now
            activeExams: course.is_active ? 1 : 0,
          }));
          setCourses(mappedCourses);

          // Proactively fetch exam count for all loaded courses in the background
          mappedCourses.forEach((course: any) => {
            fetchExamsForCourse(course.id, mappedCourses);
          });
        } else {
          console.error('Failed to fetch courses:', response.status);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Delete course function
  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const adminToken = localStorage.getItem('adminToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/admin/catalog/courses/${courseId}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        alert('Course deleted successfully');
        // Refresh the courses list
        setCourses(courses.filter(course => course.id !== courseId));
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to delete course: ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to delete course'}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#F3F0FF] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-[inter,sans-serif]  text-gray-800 tracking-[0.5px] font-semibold">Course Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">Create and manage all Exams on the platform</p>
        </div>
        <button
          onClick={() => navigate('/create-course')}
          className="px-4 sm:px-6 py-2 text-white rounded-lg shadow-md hover:opacity-90 transition-all flex items-center gap-2 text-sm sm:text-base"
          style={{ background: 'linear-gradient(135deg, #615FFF 0%, #9810FA 100%)' }}
        >
          <FiPlus className="text-sm" />
          Create New Course
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search exams by name or type..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent FONT-INTER"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative min-w-[280px]">
          <select
            className="appearance-none w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Table - Desktop View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-100 " style={{ background: 'linear-gradient(90deg, rgba(238, 242, 255, 0.5) 0%, rgba(250, 245, 255, 0.5) 100%)' }}>
            <tr>
              <th className="text-left px-6 py-4 text-sm font-bold text-gray-900 uppercase tracking-normal">
                Course Name
              </th>
              <th className="text-left px-6 py-4 text-sm font-bold text-gray-900 uppercase tracking-normal">
                Total Exams
              </th>
              <th className="text-left px-6 py-4 text-sm font-bold text-gray-900 uppercase tracking-normal">
                Course Type
              </th>
              <th className="text-left px-6 py-4 text-sm font-bold text-gray-900 uppercase tracking-normal">
                Active Exams
              </th>
              <th className="text-left px-6 py-4 text-sm font-bold text-gray-900 uppercase tracking-normal">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {courses.map((course) => {
              const isExpanded = expandedCourseId === course.id;
              const examsData = courseExams[course.id];
              return (
                <React.Fragment key={course.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md flex-shrink-0" style={{ background: 'linear-gradient(135deg, #615FFF 0%, #9810FA 100%)' }}>
                          <FiBookOpen className="text-white text-lg" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{course.name}</p>
                          <p className="text-xs text-gray-500">{course.examsAvailable} exams available</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-semibold">{course.totalExams}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full font-inter font-medium">
                        {course.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#DCFCE7] text-[#008236]">
                        {course.activeExams} Active
                      </span>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            localStorage.setItem('editingCourseId', course.id.toString());
                            navigate('/edit-course');
                          }}
                          className="text-blue-500 hover:text-blue-800 transition-colors"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-red-500 hover:text-red-800 transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="md:hidden space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md flex-shrink-0" style={{ background: 'linear-gradient(135deg, #615FFF 0%, #9810FA 100%)' }}>
                  <FiBookOpen className="text-white text-lg" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{course.name}</p>
                  <p className="text-xs text-gray-500">{course.examsAvailable} exams available</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Exams</p>
                <p className="font-medium text-gray-800">{course.totalExams}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Course Type</p>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  {course.type}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                {course.activeExams} Active
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    localStorage.setItem('editingCourseId', course.id.toString());
                    navigate('/edit-course');
                  }}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FiEdit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseManagement;
