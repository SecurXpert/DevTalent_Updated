import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/pages/Services/api/api";

import { PerformanceHeader } from "./PerformanceComponents/PerformanceHeader";
import { PurchasedPlanDropdown } from "./PerformanceComponents/PurchasedPlanDropdown";
import { PlanSelectionGrid } from "./PerformanceComponents/PlanSelectionGrid";
import { CourseSelectionGrid } from "./PerformanceComponents/CourseSelectionGrid";
import { ContinueButton } from "./PerformanceComponents/ContinueButton";

const Performance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [allSubscriptions, setAllSubscriptions] = useState<any[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [purchasedPlan, setPurchasedPlan] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [lockedCourses, setLockedCourses] = useState<number[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);

  const maxLimit =
    selectedPlan === "Dual Course"
      ? 2
      : selectedPlan === "Multiple Courses"
        ? 3
        : 1;
  const isLimitReached = selectedCourses.length >= maxLimit;

  useEffect(() => {
    if (selectedSubscription) {
      const typeStr = String(
        selectedSubscription.plan_type || ""
      ).toLowerCase();
      const nameStr = String(
        selectedSubscription.plan_name || ""
      ).toLowerCase();
      const planStr = `${typeStr} ${nameStr}`;

      if (planStr.includes("dual")) {
        setSelectedPlan("Dual Course");
        setPurchasedPlan("Dual Course");
      } else if (
        planStr.includes("multiple") ||
        planStr.includes("triple") ||
        planStr.includes("unlimited")
      ) {
        setSelectedPlan("Multiple Courses");
        setPurchasedPlan("Multiple Courses");
      } else {
        setSelectedPlan("Single Course");
        setPurchasedPlan("Single Course");
      }

      if (
        selectedSubscription.selected_courses &&
        Array.isArray(selectedSubscription.selected_courses)
      ) {
        const preSelected = selectedSubscription.selected_courses.map(
          (c: any) => c.course_id || c.id || c
        );
        setSelectedCourses(preSelected);
        setLockedCourses(preSelected);
      } else {
        setSelectedCourses([]);
        setLockedCourses([]);
      }
    }
  }, [selectedSubscription]);

  useEffect(() => {
    setSelectedCourses((prev) => {
      if (prev.length > maxLimit) {
        return prev.slice(0, maxLimit);
      }
      return prev;
    });
  }, [selectedPlan, maxLimit]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          localStorage.getItem("access_token") ||
          localStorage.getItem("userToken");

        // Fetch courses
        const coursesResponse = await fetch(
          `${API_BASE_URL}/admin/catalog/courses`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const coursesData = await coursesResponse.json();
        if (Array.isArray(coursesData)) {
          setCoursesList(coursesData);
        } else if (coursesData && Array.isArray(coursesData.data)) {
          setCoursesList(coursesData.data);
        } else if (coursesData && Array.isArray(coursesData.items)) {
          setCoursesList(coursesData.items);
        }

        // Fetch current subscription for dropdown
        const subResponse = await fetch(
          `${API_BASE_URL}/student/subscription/current`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (subResponse.ok) {
          const subData = await subResponse.json();
          let subs: any[] = [];
          if (Array.isArray(subData)) {
            subs = subData;
          } else if (subData && Array.isArray(subData.items)) {
            subs = subData.items;
          } else if (subData && Array.isArray(subData.data)) {
            subs = subData.data;
          } else if (subData) {
            subs = [subData];
          }
          const activeSubs = subs.filter(
            (s: any) => s.status === "active" || s.status === "Success"
          );
          const targetSubs = activeSubs.length > 0 ? activeSubs : subs;

          setAllSubscriptions(targetSubs);

          if (targetSubs.length > 0) {
            const passedSubId =
              location.state?.subscription_id ||
              localStorage.getItem("selectedPlanId");
            let initialSub = targetSubs[0];
            if (passedSubId) {
              const matched = targetSubs.find(
                (s: any) => String(s.subscription_id) === String(passedSubId)
              );
              if (matched) initialSub = matched;
            }
            setSelectedSubscription(initialSub);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location.state]);

  const handleSaveCourses = async () => {
    if (lockedCourses.length === maxLimit) {
      const targetCourseId = lockedCourses[0];
      localStorage.setItem("selectedCourseId", String(targetCourseId));
      navigate(`/individualterms/${targetCourseId}`);
      return;
    }

    try {
      const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("userToken");
      const payload = {
        subscription_id: Number(selectedSubscription?.subscription_id),
        course_ids: selectedCourses.map((id) => Number(id)),
      };
      console.log("Sending payload to backend:", payload);

      const response = await fetch(
        `${API_BASE_URL}/student/subscription/select-courses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setLockedCourses([...selectedCourses]);

        // Update the local allSubscriptions state so that the selected courses are saved in memory
        setAllSubscriptions((prevSubs) =>
          prevSubs.map((sub) => {
            if (
              String(sub.subscription_id) ===
              String(selectedSubscription?.subscription_id)
            ) {
              return {
                ...sub,
                selected_courses: selectedCourses.map((id) => {
                  const courseObj = coursesList.find((c) => c.id === id);
                  return courseObj
                    ? { course_id: id, course_name: courseObj.name }
                    : { course_id: id };
                }),
              };
            }
            return sub;
          })
        );

        alert("Courses successfully saved!");
        const targetCourseId = selectedCourses[0];
        localStorage.setItem("selectedCourseId", String(targetCourseId));
        navigate(`/individualterms/${targetCourseId}`);
      } else {
        const errorData = await response.json();
        console.error("Save failed:", errorData);
        alert("Failed to save courses. Please try again.");
      }
    } catch (error) {
      console.error("Error saving courses:", error);
      alert("An error occurred while saving courses.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-12 font-sans relative overflow-hidden">
      {/* Background gradients for the soft light effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[30%] h-[30%] bg-blue-100 rounded-full blur-[100px] opacity-70"></div>
        <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-purple-100 rounded-full blur-[100px] opacity-70"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-10 relative z-10">
        <PerformanceHeader navigate={navigate} />

        <PurchasedPlanDropdown
          allSubscriptions={allSubscriptions}
          selectedSubscription={selectedSubscription}
          setSelectedSubscription={setSelectedSubscription}
        />

        <PlanSelectionGrid
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          purchasedPlan={purchasedPlan}
          navigate={navigate}
        />

        <CourseSelectionGrid
          coursesList={coursesList}
          selectedCourses={selectedCourses}
          setSelectedCourses={setSelectedCourses}
          lockedCourses={lockedCourses}
          maxLimit={maxLimit}
          isLimitReached={isLimitReached}
        />

        <ContinueButton
          selectedCourses={selectedCourses}
          lockedCourses={lockedCourses}
          maxLimit={maxLimit}
          handleSaveCourses={handleSaveCourses}
        />
      </div>
    </div>
  );
};

export default Performance;
