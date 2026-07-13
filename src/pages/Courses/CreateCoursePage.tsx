import React, { useState, useEffect } from "react";
import { ArrowLeft, X, FileText, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/pages/Services/api/api";

const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [createdTypeId, setCreatedTypeId] = useState<number | null>(null);
  const [courseTypes, setCourseTypes] = useState<{ id: number, name: string }[]>([]);
  const [form, setForm] = useState({
    courseName: "",
    courseType: "",
    description: "",
    status: "Active"
  });

  // Fetch existing course types on mount
  useEffect(() => {
    const fetchCourseTypes = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          console.error('No auth token found');
          return;
        }

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Authorization': token,
        };

        const response = await fetch(`${API_BASE_URL}/admin/catalog/course-types`, {
          method: 'GET',
          headers
        });

        if (response.ok) {
          const data = await response.json();
          setCourseTypes(data);
          // Set first type as default
          if (data.length > 0 && !form.courseType) {
            setForm(prev => ({ ...prev, courseType: data[0].name }));
            setCreatedTypeId(data[0].id);
          }
        } else {
          console.error('Failed to fetch course types:', response.status);
        }
      } catch (error) {
        console.error('Error fetching course types:', error);
      }
    };

    fetchCourseTypes();
  }, []);

  const statusOptions = [
    { value: "Active", label: "Active", description: "Course is available for enrollment" },
    { value: "Draft", label: "Draft", description: "Course is not yet published" },
    { value: "Inactive", label: "Inactive", description: "Course is temporarily unavailable" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCourseTypeChange = (value: string) => {
    setForm(prev => ({ ...prev, courseType: value }));
    // Find the type_id for the selected course type
    const selectedType = courseTypes.find(type => type.name === value);
    if (selectedType) {
      setCreatedTypeId(selectedType.id);
      console.log('Selected course type:', value, 'with ID:', selectedType.id);
    }
  };

  // Get authentication token from localStorage, sessionStorage, or cookies
  const getAuthToken = () => {
    // Try multiple possible token keys
    const possibleKeys = ['token', 'access_token', 'auth_token', 'jwt', 'userToken', 'adminToken'];
    let token = null;
    let source = '';

    // Check localStorage and sessionStorage
    for (const key of possibleKeys) {
      token = localStorage.getItem(key);
      if (token) {
        source = `localStorage.${key}`;
        break;
      }
      token = sessionStorage.getItem(key);
      if (token) {
        source = `sessionStorage.${key}`;
        break;
      }
    }

    // If not found in storage, check cookies
    if (!token) {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (possibleKeys.some(key => name.toLowerCase().includes(key.toLowerCase()))) {
          token = decodeURIComponent(value);
          source = `cookie.${name}`;
          break;
        }
      }
    }

    if (token) {
      console.log(`Token found in: ${source}`);
      // Remove Bearer prefix if it exists (to avoid double Bearer)
      const cleanToken = token.replace(/^Bearer\s+/i, '');
      return `Bearer ${cleanToken}`;
    }

    // Debug: Show all available storage
    console.log('=== DEBUG: Token Search ===');
    console.log('localStorage keys:', Object.keys(localStorage));
    console.log('sessionStorage keys:', Object.keys(sessionStorage));
    console.log('cookies:', document.cookie);
    console.log('===========================');

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.courseName.trim()) {
      alert('Please enter a course name');
      return;
    }

    setIsLoading(true);

    try {
      const token = getAuthToken();
      console.log('Auth token retrieved:', token ? 'Token exists' : 'No token');

      if (!token) {
        alert('Authentication token not found. Please login first.');
        navigate('/login');
        return;
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': token,
      };

      console.log('Request headers:', headers);

      // Use the stored type_id from course type selection
      const typeId = createdTypeId || 1;
      console.log('Using type_id:', typeId);

      // Create course with the type_id
      const courseResponse = await fetch(`${API_BASE_URL}/admin/catalog/courses`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type_id: typeId,
          name: form.courseName.trim()
        })
      });

      if (courseResponse.ok) {
        const result = await courseResponse.json();
        console.log('Course created successfully:', result);

        // Navigate back to courses page
        navigate('/courses');

        // Show success message
        alert('Course created successfully!');
      } else {
        const errorText = await courseResponse.text();
        console.error('Course creation failed:', courseResponse.status, errorText);
        let errorMessage = `Failed to create course: ${courseResponse.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail?.[0]?.msg || errorData.message || errorMessage;
        } catch {
          if (errorText) errorMessage += ` - ${errorText.substring(0, 200)}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to create course'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/courses');
  };

  const descriptionLength = form.description.length;
  const maxDescriptionLength = 500;

  return (
    <div className="min-h-screen bg-[#f3f2fb] px-2 py-3 sm:px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[800px]">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e1e3ea] bg-white text-[#6b7280] transition-colors hover:bg-[#f8f9fc] hover:text-[#5865f2]"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-[28px] font-bold text-[#1f2937]">
              Create New Course
            </h1>
            <p className="text-[14px] text-[#6b7280]">
              Add a new course to your platform
            </p>
          </div>
        </div>

        {/* Main Form */}
        <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Course Information Section */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef0ff]">
                  <BookOpen className="h-5 w-5 text-[#5865f2]" />
                </div>
                <h2 className="text-[20px] font-semibold text-[#1f2937]">
                  Course Information
                </h2>
              </div>

              <div className="space-y-6">
                {/* Course Name */}
                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#1f2937]">
                    Course Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.courseName}
                    onChange={(e) => handleInputChange('courseName', e.target.value)}
                    placeholder="e.g., Computer Science, Digital Marketing"
                    className="w-full rounded-[8px] border border-[#e1e3ea] bg-white py-3 px-4 text-[14px] focus:border-[#5865f2] focus:outline-none focus:ring-1 focus:ring-[#5865f2]"
                    required
                  />
                </div>

                {/* Course Type */}
                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#1f2937]">
                    Course Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.courseType}
                    onChange={(e) => handleCourseTypeChange(e.target.value)}
                    className="w-full rounded-[8px] border border-[#e1e3ea] bg-white py-3 px-4 text-[14px] focus:border-[#5865f2] focus:outline-none focus:ring-1 focus:ring-[#5865f2] appearance-none"
                    required
                  >
                    {courseTypes.map(type => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[12px] text-[#6b7280]">
                    Select the category that best describes this course
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#1f2937]">
                    Description (Optional)
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Provide a brief description of the course content and objectives..."
                    rows={4}
                    maxLength={maxDescriptionLength}
                    className="w-full rounded-[8px] border border-[#e1e3ea] bg-white py-3 px-4 text-[14px] focus:border-[#5865f2] focus:outline-none focus:ring-1 focus:ring-[#5865f2] resize-none"
                  />
                  <div className="mt-1 flex justify-between">
                    <p className="text-[12px] text-[#6b7280]">
                      Brief overview of what students will learn
                    </p>
                    <p className="text-[12px] text-[#6b7280]">
                      {descriptionLength}/{maxDescriptionLength} characters
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#1f2937]">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full rounded-[8px] border border-[#e1e3ea] bg-white py-3 px-4 text-[14px] focus:border-[#5865f2] focus:outline-none focus:ring-1 focus:ring-[#5865f2] appearance-none"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[12px] text-[#6b7280]">
                    Set the course status. Only active courses are visible to students
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center justify-center gap-2 rounded-[8px] border border-[#e1e3ea] bg-white py-3 px-6 text-[14px] font-medium text-[#6b7280] transition-colors hover:bg-[#f8f9fc]"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !form.courseName.trim()}
                className="flex items-center justify-center gap-2 rounded-[8px] py-3 px-6 text-[14px] font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
                  boxShadow: "0px 5.29px 7.94px -5.29px #0000001A, 0px 13.23px 19.85px -3.97px #0000001A",
                }}
              >
                <FileText size={16} />
                {isLoading ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;
