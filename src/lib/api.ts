// src/lib/api.ts
// Centralized API helper for student data

export const BASE_URL = "http://192.168.0.103:8000";

/**
 * Student list item as returned by GET /student/students
 */
export interface Student {
  id: number;
  full_name: string;
  email_id: string;
  college_name: string;
  phone_number: string;
  registered_date: string; // ISO string
  status?: string; // optional if not provided
  // Additional fields may be added by backend
}

/**
 * Detailed student information returned by GET /student/students/{id}
 */
export interface StudentDetails extends Student {
  avg?: number; // average score (optional)
  mcq_total?: number;
  coding_total?: number;
  selected_courses: {
    course_id: number;
    course_name: string;
  }[];
}

/**
 * Fetch the list of registered students.
 */
export async function fetchStudents(): Promise<Student[]> {
  const token = localStorage.getItem("adminToken");
  const headers: HeadersInit = { Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}/student/students`, {
    method: "GET",
    headers,
    cache: "no-cache",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch students: ${response.status}`);
  }
  const data = await response.json();
  if (Array.isArray(data)) {
    return data as Student[];
  }
  if (data && typeof data === "object") {
    const obj = data as any;
    if (Array.isArray(obj.students)) {
      return obj.students as Student[];
    }
    if (Array.isArray(obj.data)) {
      return obj.data as Student[];
    }
    if (Array.isArray(obj.results)) {
      return obj.results as Student[];
    }
    if (Array.isArray(obj.items)) {
      return obj.items as Student[];
    }
    if (obj.id || obj.full_name) {
      return [obj] as Student[];
    }
  }
  return [];
}

/**
 * Fetch detailed information for a single student by ID.
 */
export async function fetchStudentById(id: number): Promise<StudentDetails> {
  const token = localStorage.getItem("adminToken");
  const headers: HeadersInit = { Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}/student/students/${id}`, {
    method: "GET",
    headers,
    cache: "no-cache",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch student ${id}: ${response.status}`);
  }
  const data = (await response.json()) as StudentDetails;
  return data;
}

/**
 * Delete a student by ID.
 */
export async function deleteStudent(id: number): Promise<void> {
  const token = localStorage.getItem("adminToken");
  const headers: HeadersInit = { Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}/student/students/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) {
    throw new Error(`Failed to delete student ${id}: ${response.status}`);
  }
}

/**
 * Fetch course performance statistics.
 */
export async function fetchCoursePerformance(params?: {
  student_id?: number;
  course_id?: number;
  q?: string;
  is_completed?: boolean;
  eligible_for_certificate?: boolean;
  min_percentage?: number;
  max_percentage?: number;
  from_date?: string;
  to_date?: string;
  limit?: number;
}): Promise<any> {
  const token = localStorage.getItem("adminToken");
  const headers: HeadersInit = { Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const url = new URL(`${BASE_URL}/student/scorecard/admin/courses/performance`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch course performance: ${response.status}`);
  }

  return await response.json();
}

/**
 * Fetch course performance summary statistics.
 */
export async function fetchCoursePerformanceSummary(params?: {
  student_id?: number;
  course_id?: number;
  q?: string;
  is_completed?: boolean;
  eligible_for_certificate?: boolean;
  min_percentage?: number;
  max_percentage?: number;
  from_date?: string;
  to_date?: string;
  limit?: number;
}): Promise<any> {
  const token = localStorage.getItem("adminToken");
  const headers: HeadersInit = { Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const url = new URL(`${BASE_URL}/student/scorecard/admin/courses/performance-summary?limit=200`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch course performance summary: ${response.status}`);
  }

  return await response.json();
}

/**
 * Fetch all exam results for admin.
 */
export async function fetchExamResults(limit: number = 200): Promise<any> {
  const token = localStorage.getItem("adminToken");
  const headers: HeadersInit = { Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}/student/scorecard/admin/exam-results?limit=${limit}`, {
    method: "GET",
    headers,
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch exam results: ${response.status}`);
  }

  return await response.json();
}
