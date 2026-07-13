import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiX, FiBookOpen } from 'react-icons/fi';
import { API_BASE_URL } from '@/pages/Services/api/api';

const EditCourse = () => {
  const navigate = useNavigate();
  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('Computer Science');
  const [courseType, setCourseType] = useState('Technical');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [loading, setLoading] = useState(false);

  // Load course ID from localStorage on mount
  useEffect(() => {
    const storedId = localStorage.getItem('editingCourseId');
    if (storedId) {
      setCourseId(storedId);
    }
  }, []);

  const handleCancel = () => {
    navigate('/courses');
  };

  const handleUpdate = async () => {
    if (!courseName.trim()) {
      alert('Course name is required');
      return;
    }

    // Use the courseId from state (either from localStorage or manual input)
    const courseIdToUse = courseId.trim();
    if (!courseIdToUse) {
      alert('Course ID is missing. Please enter a course ID.');
      return;
    }

    setLoading(true);

    try {
      const adminToken = localStorage.getItem('adminToken');
      console.log('Admin token:', adminToken ? 'Found' : 'Not found');

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      console.log('Request headers:', headers);
      console.log('Updating course:', { courseId: courseIdToUse, type_id: 1, name: courseName.trim() });

      // Directly update the course using PUT API
      const updateResponse = await fetch(`${API_BASE_URL}/admin/catalog/courses/${courseIdToUse}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          type_id: 1,
          name: courseName.trim()
        })
      });

      if (updateResponse.ok) {
        alert('Course updated successfully');
        navigate('/courses');
      } else {
        const errorText = await updateResponse.text();
        throw new Error(`Failed to update course: ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to update course'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3FF] px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleCancel}
          className="p-2 rounded-lg hover:bg-white transition"
        >
          <FiArrowLeft size={22} className="text-gray-600" />
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Edit Course
          </h1>
          <p className="text-sm text-gray-500">
            Update course details on your platform
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm">

        {/* Top Section */}
        <div className="flex items-start gap-4 p-6 border-b border-gray-200">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm transform -translate-y-[-6px] translate-x-[1px]"
            style={{
              background: 'linear-gradient(135deg, #6366F1, #9333EA)'
            }}
          >
            <FiBookOpen className="text-white" size={20} />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Course Information
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Update the course details below
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">

          {/* Course ID */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Course ID <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              placeholder="Enter course ID"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              The ID of the course you want to edit
            </p>
          </div>

          {/* Course Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Course Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              placeholder="e.g., Computer Science, Digital Marketing"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Course Type */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Course Type <span className="text-red-500">*</span>
            </label>

            <select
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
              className="w-full h-11 px-4 border border-gray-300 rounded-lg font-normal text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option>Technical</option>
              <option>Non-Technical</option>
            </select>

            <p className="text-sm text-gray-500 mt-1">
              Select the category that best describes this course
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Description (Optional)
            </label>

            <textarea
              rows={4}
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description of the course content and objectives..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 outline-none"
            />

            <div className="text-right mt-1 text-xs text-gray-500">
              {description.length}/500 characters
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-11 px-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <p className="text-xs text-gray-500 mt-1">
              Set the course status. Only active courses are visible to students.
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 h-21 bg-[#F9FAFB]" >

          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-5 h-10 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-[#F3F4F6] bg-white"
          >
            <FiX size={16} />
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex items-center gap-2 px-5 h-10 text-white rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #6366F1, #9333EA)'
            }}
          >
            <FiBookOpen size={16} />
            {loading ? 'Updating...' : 'Update Course'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
