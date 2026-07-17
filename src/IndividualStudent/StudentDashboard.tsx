import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/pages/Services/api/api";

import { DashboardHeader } from "./StudentDashboardComponents/DashboardHeader";
import { PerformanceMetricsCard } from "./StudentDashboardComponents/PerformanceMetricsCard";
import { CoursePerformance } from "./StudentDashboardComponents/CoursePerformance";
import { QuickLinks } from "./StudentDashboardComponents/QuickLinks";
import { PlanSelector } from "./StudentDashboardComponents/PlanSelector";
import { UpgradeBanner } from "./StudentDashboardComponents/UpgradeBanner";
import { ActiveSubscriptionCard } from "./StudentDashboardComponents/ActiveSubscriptionCard";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [course, setCourse] = useState(() => {
    return localStorage.getItem("registeredCourse") || "Technical";
  });
  const [time, setTime] = useState("All Time");
  const [studentName, setStudentName] = useState("Rahul Sharma");
  const [subscription, setSubscription] = useState<any>(null);
  const [allSubscriptions, setAllSubscriptions] = useState<any[]>([]);
  const [courseExams, setCourseExams] = useState<any[]>([]);
  const [codingExams, setCodingExams] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [attemptedExamIds, setAttemptedExamIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
        if (!token || !subscription?.selected_courses || subscription.selected_courses.length === 0) {
          setPerformanceMetrics(null);
          return;
        }

        const targetCourseId = subscription.selected_courses[0].course_id;
        if (!targetCourseId) return;

        const response = await fetch(`${API_BASE_URL}/student/scorecard/courses/${targetCourseId}/performance`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPerformanceMetrics(data);
        } else {
          setPerformanceMetrics(null);
        }
      } catch (error) {
        console.error("Error fetching performance metrics:", error);
        setPerformanceMetrics(null);
      }
    };
    fetchPerformance();
  }, [subscription]);

  useEffect(() => {
    const fetchCourseExams = async () => {
      if (!subscription?.selected_courses || subscription.selected_courses.length === 0) {
        setCourseExams([]);
        setCodingExams([]);
        return;
      }
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
        if (!token) return;

        let allMcqExams: any[] = [];
        let allCodingExams: any[] = [];
        let fetchedAttemptedExamIds = new Set<number>();

        for (const c of subscription.selected_courses) {
          if (!c.course_id) continue;

          // Fetch Scorecard Exams (to know which are attempted)
          const scorecardRes = await fetch(`${API_BASE_URL}/student/scorecard/courses/${c.course_id}/exams`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          if (scorecardRes.ok) {
            const data = await scorecardRes.json();
            const attempted = Array.isArray(data) ? data : [];
            attempted.forEach((e: any) => {
              fetchedAttemptedExamIds.add(e.exam_id || e.id);
            });
          }

          // Fetch MCQ Exams
          const mcqResponse = await fetch(`${API_BASE_URL}/ind/mcq/student/courses/${c.course_id}/exams`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          if (mcqResponse.ok) {
            const data = await mcqResponse.json();
            const exams = Array.isArray(data) ? data : (data.mcq_exams || data.items || data.exams || []);
            allMcqExams = [...allMcqExams, ...exams];
          }

          // Fetch Coding Exams
          const codingResponse = await fetch(`${API_BASE_URL}/ind/coding/student/courses/${c.course_id}/exams`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          if (codingResponse.ok) {
            const data = await codingResponse.json();
            const exams = Array.isArray(data) ? data : (data.coding_exams || data.items || data.exams || []);
            allCodingExams = [...allCodingExams, ...exams];
          }
        }
        setCourseExams(allMcqExams);
        setCodingExams(allCodingExams);
        setAttemptedExamIds(fetchedAttemptedExamIds);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };
    fetchCourseExams();
  }, [subscription]);

  useEffect(() => {
    const fetchActiveSubscription = async () => {
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
          let subs: any[] = [];
          if (Array.isArray(data)) {
            subs = data;
          } else if (data && Array.isArray(data.items)) {
            subs = data.items;
          } else if (data && Array.isArray(data.data)) {
            subs = data.data;
          } else if (data) {
            subs = [data];
          }
          setAllSubscriptions(subs);

          if (subs.length > 0) {
            // Filter active subscriptions and sort to find the one expiring first
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
            localStorage.setItem("selectedPlanId", String(sub.subscription_id));

            // If they have coding exams (coding_total > 0), they are registered for Technical
            if (sub.coding_total > 0) {
              setCourse("Technical");
              localStorage.setItem("registeredCourse", "Technical");
            } else if (sub.mcq_total > 0) {
              // If only MCQ exams are present, it could be Non-Technical or Technical (depending on selection)
              setCourse(localStorage.getItem("registeredCourse") || "Non-Technical");
            }
          }
        }

        // Decode token to get student ID
        let studentId = "";
        try {
          if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            studentId = String(
              payload.user_id || payload.id || payload.candidate_id || payload.sub || ""
            );
          }
        } catch (e) {
          console.error("Error decoding token for student ID", e);
        }

        const endpoint = studentId
          ? `${API_BASE_URL}/student/students/${studentId}`
          : `${API_BASE_URL}/student/students`;

        // Fetch student info
        const studentResponse = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (studentResponse.ok) {
          const studentData = await studentResponse.json();
          const student = Array.isArray(studentData) ? studentData[0] : studentData;
          if (student && student.full_name) {
            setStudentName(student.full_name);
          }
        }
      } catch (error) {
        console.error("Error fetching subscription in dashboard:", error);
      }
    };

    fetchActiveSubscription();
  }, []);

  return (
    <div className="px-4 sm:px-8 pb-10 mt-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardHeader studentName={studentName} course={course} courseExams={courseExams} codingExams={codingExams} attemptedExamIds={attemptedExamIds} subscription={subscription} />
          <PerformanceMetricsCard performanceMetrics={performanceMetrics} />
          <CoursePerformance
            course={course}
            subscription={subscription}
            courseExams={courseExams}
            codingExams={codingExams}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-1 space-y-6 mt-3">

          <QuickLinks course={course} subscription={subscription} />
          <PlanSelector
            subscription={subscription}
            setSubscription={setSubscription}
            allSubscriptions={allSubscriptions}
            setCourse={setCourse}
          />
          <ActiveSubscriptionCard subscription={subscription} />
          <UpgradeBanner />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
