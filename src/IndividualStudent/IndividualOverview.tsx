import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { API_BASE_URL } from "@/pages/Services/api/api";

import { OverviewHeader } from "./IndividualOverviewComponents/OverviewHeader";
import { ExamSection } from "./IndividualOverviewComponents/ExamSection";
import { Exam } from "./IndividualOverviewComponents/ExamCard";

export default function IndividualOverview() {
  const navigate = useNavigate();
  const { courseId: routeCourseId } = useParams<{ courseId?: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const queryCourseId = searchParams.get("courseId");
  const stateCourseId = (location.state as any)?.courseId;
  const localCourseId = localStorage.getItem("selectedCourseId");

  // Layered courseId resolution
  const [courseId, setCourseId] = useState(routeCourseId || queryCourseId || stateCourseId || localCourseId || "1");

  const [allSubscriptions, setAllSubscriptions] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);

  // Keep stored in localStorage for subsequent requests/pages
  useEffect(() => {
    if (courseId) {
      localStorage.setItem("selectedCourseId", courseId);
    }
  }, [courseId]);

  const [exams, setExams] = useState<Exam[]>([]);
  const [submittedExamIds, setSubmittedExamIds] = useState<Set<number>>(
    new Set(),
  );
  const [loading, setLoading] = useState(true);

  const [collageName, setCollageName] = useState<string>("Loading...");
  const [studentEmail, setStudentEmail] = useState<string>("Loading...");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
        if (!token) {
          setCollageName("Guest College");
          setStudentEmail("Guest User");
          return;
        }

        let studentId = "";
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          studentId = String(payload.user_id || payload.id || payload.candidate_id || payload.sub || "");
          const tokenEmail = payload.email || payload.email_id;
          if (tokenEmail) setStudentEmail(tokenEmail);
        } catch (e) {
          console.error("Error decoding token", e);
        }

        if (studentId) {
          const response = await fetch(`${API_BASE_URL}/student/students/${studentId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setCollageName(data.college_name || localStorage.getItem("userCollege") || "Unknown College");
            const apiEmail = data.email || data.email_id;
            if (apiEmail) {
              setStudentEmail(apiEmail);
            } else {
              setStudentEmail((prev) => prev !== "Loading..." ? prev : (localStorage.getItem("userEmail") || "Unknown User"));
            }
          } else {
            setCollageName(localStorage.getItem("userCollege") || "Unknown College");
            setStudentEmail((prev) => prev !== "Loading..." ? prev : (localStorage.getItem("userEmail") || "Unknown User"));
          }
        } else {
          setCollageName(localStorage.getItem("userCollege") || "Unknown College");
          setStudentEmail((prev) => prev !== "Loading..." ? prev : (localStorage.getItem("userEmail") || "Unknown User"));
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
        setCollageName(localStorage.getItem("userCollege") || "Unknown College");
      }
    };
    fetchStudentData();
  }, []);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/student/subscription/current`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          let subs = Array.isArray(data) ? data : (data ? [data] : []);
          setAllSubscriptions(subs);

          if (subs.length > 0) {
            const activeSubs = subs.filter((s: any) => s.status === 'active' || s.status === 'Success');
            const targetSubs = activeSubs.length > 0 ? activeSubs : subs;

            targetSubs.sort((a: any, b: any) => new Date(a.end_at).getTime() - new Date(b.end_at).getTime());

            const storedPlanId = localStorage.getItem("selectedPlanId");
            let sub = targetSubs[0];
            if (storedPlanId) {
              const matched = targetSubs.find((s: any) => String(s.subscription_id) === String(storedPlanId));
              if (matched) sub = matched;
            }

            setSubscription(sub);

            // Initialize course selection with the one already in route/storage if valid
            if (sub.selected_courses && sub.selected_courses.length > 0) {
              const currentInSub = sub.selected_courses.find((c: any) => String(c.course_id) === String(courseId));
              if (!currentInSub) {
                setCourseId(String(sub.selected_courses[0].course_id));
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };
    fetchSubscriptions();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const userToken = localStorage.getItem("access_token");

      const [mcqRes, codingRes] = await Promise.all([
        fetch(`${API_BASE_URL}/ind/mcq/student/courses/${courseId}/exams`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`,
          },
        }).catch((e) => {
          console.error("Failed to fetch MCQ exams:", e);
          return null;
        }),
        fetch(`${API_BASE_URL}/ind/coding/student/courses/${courseId}/exams`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`,
          },
        }).catch((e) => {
          console.error("Failed to fetch Coding exams:", e);
          return null;
        }),
      ]);

      let allExamsList: any[] = [];

      // Process MCQ Exams
      if (mcqRes && mcqRes.ok) {
        const data = await mcqRes.json();
        let examsList: any[] = [];
        if (Array.isArray(data)) {
          examsList = data;
        } else if (data && Array.isArray(data.mcq_exams)) {
          examsList = data.mcq_exams;
        } else if (data) {
          examsList = [data];
        }
        allExamsList = [...allExamsList, ...examsList.map(e => ({ ...e, exam_category: "MCQ" }))];
      }

      // Process Coding Exams
      if (codingRes && codingRes.ok) {
        const data = await codingRes.json();
        let examsList: any[] = [];
        if (Array.isArray(data)) {
          examsList = data;
        } else if (data && Array.isArray(data.coding_exams)) {
          examsList = data.coding_exams;
        } else if (data && Array.isArray(data.exams)) {
          examsList = data.exams;
        } else if (data) {
          examsList = [data];
        }
        allExamsList = [...allExamsList, ...examsList.map(e => ({ ...e, exam_category: "Coding" }))];
      }

      // Map API data to our Exam interface
      const mappedExams: Exam[] = await Promise.all(allExamsList.map(async (item: any) => {
        let questionsData = item.questions || null;
        let qCount = typeof item.question_count === "number" ? item.question_count : 0;
        let totalMarks = item.total_marks || 0;


        const actualQuestionsCount = questionsData ? (Array.isArray(questionsData) ? questionsData.length : Object.keys(questionsData).length) : 0;
        qCount = actualQuestionsCount > 0 ? actualQuestionsCount : qCount;

        let calculatedMarks = 0;
        if (questionsData) {
          const questionValues = Array.isArray(questionsData) ? questionsData : Object.values(questionsData);
          calculatedMarks = questionValues.reduce((sum: number, q: any) => sum + (Number(q.marks) || Number(q.score) || 10), 0);
        }

        const finalTotalMarks = calculatedMarks > 0 ? calculatedMarks : (totalMarks || (qCount * 10));

        return {
          id: item.id || item.exam_id,
          title: item.title || "Untitled Exam",
          description: item.description || "No description available",
          collage: item.college_name || collageName || "N/A",
          window_start: item.window_start || item.created_at || new Date().toISOString(),
          window_end: item.window_end || new Date(Date.now() + 86400000).toISOString(),
          duration: item.duration_minutes || item.duration || 60,
          category: item.exam_category || "MCQ",
          questions: questionsData || {},
          question_count: qCount,
          total_marks: finalTotalMarks,
        };
      }));

      setExams(mappedExams);
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Failed to load exams. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [courseId]);

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return (
      date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handleStartExam = async (examId: number, category: string) => {
    console.log("Starting exam with ID:", examId, "category:", category);

    if (category === "Coding" || category === "Coding Only") {
      try {
        const userToken = localStorage.getItem("access_token") || localStorage.getItem("userToken");
        const response = await fetch(`${API_BASE_URL}/ind/coding/student/exams/${examId}/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
          },
          body: JSON.stringify({ course_id: parseInt(courseId as string) || 0 })
        });

        if (response.ok) {
          const data = await response.json();
          const attemptId = typeof data === 'string' ? data : (data.attempt_id || data.id);

          const currentExam = exams.find(e => String(e.id) === String(examId));

          navigate("/individual-compiler", {
            state: {
              examId: examId,
              attemptId: attemptId,
              examData: {
                title: data.exam?.title || currentExam?.title || "Coding Exam",
                duration: data.exam?.duration_minutes || currentExam?.duration || 60,
                questions: data.questions || currentExam?.questions || [],
                examId: examId
              }
            }
          });
        } else {
          const errData = await response.json().catch(() => ({}));
          const errorMessage = errData.detail || errData.message || "Failed to start Coding exam. Please try again.";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Error starting Coding exam:", error);
        toast.error("An error occurred while starting the exam.");
      }
    } else {
      // Default to MCQ routing
      try {
        const userToken = localStorage.getItem("access_token") || localStorage.getItem("userToken");
        const response = await fetch(`${API_BASE_URL}/ind/mcq/student/exams/${examId}/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
          },
          body: JSON.stringify({ course_id: parseInt(courseId as string) || 0 })
        });

        if (response.ok) {
          const data = await response.json();
          const attemptId = typeof data === 'string' ? data : (data.attempt_id || data.id);

          // Find the exam to pass title and duration to the paper component
          const currentExam = exams.find(e => String(e.id) === String(examId));
          console.log("Found current exam:", currentExam);

          navigate(`/mcqpaper/${attemptId}`, {
            state: {
              examData: {
                title: currentExam?.title || "MCQ Exam",
                duration: currentExam?.duration || 10,
                questions: currentExam?.questions || [],
                examId: examId,
                courseId: parseInt(courseId as string) || 0
              }
            }
          });
        } else {
          const errData = await response.json().catch(() => ({}));
          const errorMessage = errData.detail || errData.message || "Failed to start MCQ exam. Please try again.";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Error starting MCQ exam:", error);
        toast.error("An error occurred while starting the exam.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  const courseName = subscription?.selected_courses?.find((c: any) => String(c.course_id) === String(courseId))?.course_name || "Technical MCQ Exams";
  const mcqExams = exams.filter(e => e.category === "MCQ");
  const codingExams = exams.filter(e => e.category === "Coding" || e.category === "Coding Only");

  return (
    <div className="min-h-screen bg-white py-12 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <OverviewHeader
          navigate={navigate}
          courseId={courseId as string}
          studentEmail={studentEmail}
          courseName={courseName}
        />

        {exams.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">No active exams found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            <ExamSection
              title="MCQ Exams"
              exams={mcqExams}
              formatDateTime={formatDateTime}
              handleStartExam={handleStartExam}
            />

            <ExamSection
              title="Coding Exams"
              exams={codingExams}
              formatDateTime={formatDateTime}
              handleStartExam={handleStartExam}
            />
          </div>
        )}
      </div>
    </div>
  );
}
