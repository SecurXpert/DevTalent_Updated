import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/pages/Services/api/api";

interface CourseType {
  id: number;
  name: string;
}

interface CodingCourseSettingsProps {
  onSelectionChange?: (selectedIds: number[]) => void;
  examId?: number;
}

const CodingCourseSettings: React.FC<CodingCourseSettingsProps> = ({
  onSelectionChange,
  examId = 0,
}) => {
  const [coursesData, setCoursesData] = useState<CourseType[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch courses so we can render them and get their IDs
    const fetchCourses = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");
        const headers: Record<string, string> = {};
        if (adminToken) headers["Authorization"] = `Bearer ${adminToken}`;

        const response = await fetch(`${API_BASE_URL}/admin/catalog/courses`, { headers });
        if (response.ok) {
          const data = await response.json();
          setCoursesData(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch course types:", response.status);
          // Fallback to default courses if API fails
          setCoursesData([
            { id: 1, name: "Python" },
            { id: 2, name: "Java" },
            { id: 3, name: "C++" },
            { id: 4, name: "JavaScript" }
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch courses data", err);
        // Fallback to default courses if API fails
        setCoursesData([
          { id: 1, name: "Python" },
          { id: 2, name: "Java" },
          { id: 3, name: "C++" },
          { id: 4, name: "JavaScript" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleToggle = async (courseId: number) => {
    const isCurrentlySelected = selectedCourseIds.includes(courseId);
    let newSelectedIds: number[];

    if (isCurrentlySelected) {
      newSelectedIds = selectedCourseIds.filter((id) => id !== courseId);
    } else {
      newSelectedIds = [...selectedCourseIds, courseId];
    }

    // Update local state and parent state
    setSelectedCourseIds(newSelectedIds);
    if (onSelectionChange) {
      onSelectionChange(newSelectedIds);
    }

    // If we are checking the box (not unchecking), attach the course to the exam
    if (!isCurrentlySelected) {
      try {
        const adminToken = localStorage.getItem("adminToken");
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (adminToken) headers["Authorization"] = `Bearer ${adminToken}`;

        const requestBody = {
          course_id: courseId,
          exam_id: examId,
          exam_kind: "coding"
        };

        const response = await fetch(`${API_BASE_URL}/ind/coding/admin/attach-to-course`, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to attach course ${courseId}:`, errorText);
          alert(`Failed to attach course: ${errorText}`);

          // Revert selection on failure
          const revertedIds = selectedCourseIds.filter((id) => id !== courseId);
          setSelectedCourseIds(revertedIds);
          if (onSelectionChange) onSelectionChange(revertedIds);
        } else {
          console.log(`Successfully attached course ${courseId} to coding exam ${examId}`);
        }
      } catch (error) {
        console.error("Error attaching course:", error);

        // Revert selection on failure
        const revertedIds = selectedCourseIds.filter((id) => id !== courseId);
        setSelectedCourseIds(revertedIds);
        if (onSelectionChange) onSelectionChange(revertedIds);
      }
    }
  };

  return (
    <div className="rounded-[16px] border border-[#e1e3ea] bg-white p-4 sm:p-5">
      <h2 className="text-[22px] font-semibold text-[#1f2937] mb-6">
        Attach Course Types
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-[16px] text-[#6b7280]">Loading course types...</div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-10">
          {coursesData.map((course) => (
            <label
              key={course.id}
              className="flex items-center gap-3 text-[#374151] cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-5 h-5 rounded-md border-[#d1d5db] accent-blue-600"
                checked={selectedCourseIds.includes(course.id)}
                onChange={() => handleToggle(course.id)}
              />
              <span className="text-[14px] font-medium">{course.name}</span>
            </label>
          ))}
          {coursesData.length === 0 && (
            <span className="text-sm text-gray-500">No courses available.</span>
          )}
        </div>
      )}
    </div>
  );
};

export default CodingCourseSettings;
