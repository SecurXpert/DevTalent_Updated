import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Check,
  BookOpen,
  BookMarked,
  GraduationCap,
  Clock,
  FileText,
  BarChart2,
  Play,
  Sparkles,
  ArrowRight
} from "lucide-react";
import Devlogo from "../assests/Devlogo.png";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/pages/Services/api/api";

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

  const maxLimit = selectedPlan === "Dual Course" ? 2 : selectedPlan === "Multiple Courses" ? 3 : 1;
  const isLimitReached = selectedCourses.length >= maxLimit;

  useEffect(() => {
    if (selectedSubscription) {
      const typeStr = String(selectedSubscription.plan_type || "").toLowerCase();
      const nameStr = String(selectedSubscription.plan_name || "").toLowerCase();
      const planStr = `${typeStr} ${nameStr}`;

      if (planStr.includes("dual")) {
        setSelectedPlan("Dual Course");
        setPurchasedPlan("Dual Course");
      } else if (planStr.includes("multiple") || planStr.includes("triple") || planStr.includes("unlimited")) {
        setSelectedPlan("Multiple Courses");
        setPurchasedPlan("Multiple Courses");
      } else {
        setSelectedPlan("Single Course");
        setPurchasedPlan("Single Course");
      }

      if (selectedSubscription.selected_courses && Array.isArray(selectedSubscription.selected_courses)) {
        const preSelected = selectedSubscription.selected_courses.map((c: any) => c.course_id || c.id || c);
        setSelectedCourses(preSelected);
        setLockedCourses(preSelected);
      } else {
        setSelectedCourses([]);
        setLockedCourses([]);
      }
    }
  }, [selectedSubscription]);

  useEffect(() => {
    setSelectedCourses(prev => {
      if (prev.length > maxLimit) {
        return prev.slice(0, maxLimit);
      }
      return prev;
    });
  }, [selectedPlan, maxLimit]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");

        // Fetch courses
        const coursesResponse = await fetch(`${API_BASE_URL}/admin/catalog/courses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const coursesData = await coursesResponse.json();
        if (Array.isArray(coursesData)) {
          setCoursesList(coursesData);
        } else if (coursesData && Array.isArray(coursesData.data)) {
          setCoursesList(coursesData.data);
        } else if (coursesData && Array.isArray(coursesData.items)) {
          setCoursesList(coursesData.items);
        }

        // Fetch current subscription for dropdown
        const subResponse = await fetch(`${API_BASE_URL}/student/subscription/current`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (subResponse.ok) {
          const subData = await subResponse.json();
          let subs = Array.isArray(subData) ? subData : (subData ? [subData] : []);
          const activeSubs = subs.filter((s: any) => s.status === 'active' || s.status === 'Success');
          const targetSubs = activeSubs.length > 0 ? activeSubs : subs;

          setAllSubscriptions(targetSubs);

          if (targetSubs.length > 0) {
            const passedSubId = location.state?.subscription_id || localStorage.getItem("selectedPlanId");
            let initialSub = targetSubs[0];
            if (passedSubId) {
              const matched = targetSubs.find((s: any) => String(s.subscription_id) === String(passedSubId));
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

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-12 font-sans relative overflow-hidden">
      {/* Background gradients for the soft light effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[30%] h-[30%] bg-blue-100 rounded-full blur-[100px] opacity-70"></div>
        <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-purple-100 rounded-full blur-[100px] opacity-70"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-10 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/studentdashboard")}
          className="flex items-center gap-2 text-gray-800 font-medium hover:text-black mb-10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="text-center mb-14">
          <img src={Devlogo} alt="DevTalent" className="w-16 h-16 mx-auto mb-6 object-contain" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Choose Your Learning Path</h1>
          <p className="text-gray-500 text-lg">Select your course plan to continue with assessments and certifications.</p>
        </div>

        {/* Purchased Plans Dropdown */}
        <div className="max-w-md mx-auto mb-16">
          <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
            Select Purchased Plan
          </label>
          <div className="relative">
            <select
              value={selectedSubscription?.subscription_id || ""}
              onChange={(e) => {
                const selected = allSubscriptions.find(sub => String(sub.subscription_id) === e.target.value);
                if (selected) setSelectedSubscription(selected);
              }}
              className="w-full py-4 px-5 rounded-2xl border-2 border-gray-200 bg-white text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 appearance-none shadow-sm font-medium text-lg transition-all"
            >
              {allSubscriptions.length === 0 && (
                <option value="">No active plans</option>
              )}
              {allSubscriptions.map((sub, idx) => (
                <option key={sub.subscription_id || idx} value={sub.subscription_id}>
                  {sub.plan_name || "Unnamed Plan"} - {sub.plan_type || "Unknown Type"}
                </option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">

          {/* Plan 1: Single Course */}
          <div
            onClick={() => setSelectedPlan("Single Course")}
            className={`relative bg-white rounded-2xl p-8 shadow-sm border-2 cursor-pointer transition-all duration-200 ${selectedPlan === "Single Course" ? "border-indigo-500 shadow-md scale-[1.02]" : "border-gray-100 hover:border-gray-200"
              }`}
          >
            <div className="relative inline-block mb-6">
              {selectedPlan === "Single Course" && (
                <div className="absolute -top-2 -left-2 z-10 rounded-full bg-white">
                  <CheckCircle2 className="w-6 h-6 fill-indigo-500 text-white" />
                </div>
              )}
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-indigo-500" />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2 text-gray-900">Single Course</h3>
            <p className="text-gray-500 text-sm mb-8 h-10">Focus on mastering one specialized course.</p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> 1 Course Access
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Course-specific Exams
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Completion Certificate
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Beginner Friendly
              </li>
            </ul>

            <button
              onClick={(e) => {
                if (purchasedPlan !== "Single Course") {
                  e.stopPropagation();
                  navigate("/subscription");
                }
              }}
              className={`w-full py-3.5 rounded-xl font-medium transition-colors ${selectedPlan === "Single Course"
                ? "bg-[#5b61f4] text-white hover:bg-indigo-600"
                : "bg-indigo-50 text-[#5b61f4] hover:bg-indigo-100"
                }`}
            >
              {purchasedPlan === "Single Course" ? "Selected" : "Upgrade"}
            </button>
          </div>

          {/* Plan 2: Dual Course */}
          <div
            onClick={() => setSelectedPlan("Dual Course")}
            className={`relative bg-white rounded-2xl p-8 shadow-sm border-2 cursor-pointer transition-all duration-200 ${selectedPlan === "Dual Course" ? "border-indigo-500 shadow-md scale-[1.02]" : "border-gray-100 hover:border-gray-200"
              }`}
          >
            <div className="absolute top-0 right-0 bg-[#5b61f4] text-white text-xs font-semibold px-4 py-1.5 rounded-bl-lg rounded-tr-xl">
              Most Popular
            </div>

            <div className="relative inline-block mb-6">
              {selectedPlan === "Dual Course" && (
                <div className="absolute -top-2 -left-2 z-10 rounded-full bg-white">
                  <CheckCircle2 className="w-6 h-6 fill-indigo-500 text-white" />
                </div>
              )}
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <BookMarked className="w-7 h-7 text-indigo-500" />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2 text-gray-900">Dual Course</h3>
            <p className="text-gray-500 text-sm mb-8 h-10">Learn and get certified in two related technologies.</p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> 2 Courses Access
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Combined Exam Dashboard
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Dual Certificates
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Better Skill Coverage
              </li>
            </ul>

            <button
              onClick={(e) => {
                if (purchasedPlan !== "Dual Course") {
                  e.stopPropagation();
                  navigate("/subscription");
                }
              }}
              className={`w-full py-3.5 rounded-xl font-medium transition-colors ${selectedPlan === "Dual Course"
                ? "bg-[#5b61f4] text-white hover:bg-indigo-600"
                : "bg-indigo-50 text-[#5b61f4] hover:bg-indigo-100"
                }`}
            >
              {purchasedPlan === "Dual Course" ? "Selected" : "Upgrade"}
            </button>
          </div>

          {/* Plan 3: Multiple Courses */}
          <div
            onClick={() => setSelectedPlan("Multiple Courses")}
            className={`relative bg-white rounded-2xl p-8 shadow-sm border-2 cursor-pointer transition-all duration-200 ${selectedPlan === "Multiple Courses" ? "border-indigo-500 shadow-md scale-[1.02]" : "border-gray-100 hover:border-gray-200"
              }`}
          >
            <div className="relative inline-block mb-6">
              {selectedPlan === "Multiple Courses" && (
                <div className="absolute -top-2 -left-2 z-10 rounded-full bg-white">
                  <CheckCircle2 className="w-6 h-6 fill-indigo-500 text-white" />
                </div>
              )}
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-indigo-500" />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2 text-gray-900">Triple Courses</h3>
            <p className="text-gray-500 text-sm mb-8 h-10">Access triple courses and advanced examination tracks.</p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> 3 Courses Access
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Multiple Exams
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Advanced Certifications
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Career-Focused Learning
              </li>
            </ul>

            <button
              onClick={(e) => {
                if (purchasedPlan !== "Multiple Courses") {
                  e.stopPropagation();
                  navigate("/subscription");
                }
              }}
              className={`w-full py-3.5 rounded-xl font-medium transition-colors ${selectedPlan === "Multiple Courses"
                ? "bg-[#5b61f4] text-white hover:bg-indigo-600"
                : "bg-indigo-50 text-[#5b61f4] hover:bg-indigo-100"
                }`}
            >
              {purchasedPlan === "Multiple Courses" ? "Selected" : "Upgrade"}
            </button>
          </div>
        </div>

        {/* Select Courses Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#5b61f4]" />
              <h2 className="text-2xl font-bold text-gray-900">Select Courses</h2>
            </div>
            <span className="text-sm font-medium bg-indigo-50 text-indigo-600 px-3.5 py-1.5 rounded-lg border border-indigo-100">
              Selected: {selectedCourses.length} / {maxLimit} {maxLimit > 1 ? "Courses" : "Course"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coursesList.map((course) => {
              const isSelected = selectedCourses.includes(course.id);
              const isLocked = lockedCourses.includes(course.id);
              const canSwap = maxLimit === 1 && lockedCourses.length === 0;
              const isDisabled = isLocked || (!isSelected && isLimitReached && !canSwap);
              return (
                <div
                  key={course.id}
                  onClick={() => {
                    if (isDisabled) return;
                    if (isSelected) {
                      setSelectedCourses(selectedCourses.filter(id => id !== course.id));
                    } else {
                      if (maxLimit === 1) {
                        setSelectedCourses([course.id]);
                      } else {
                        setSelectedCourses([...selectedCourses, course.id]);
                      }
                    }
                  }}
                  className={`relative bg-white rounded-xl p-5 border transition-all duration-200 ${isSelected
                    ? `border-[#5b61f4] shadow-sm ${isLocked ? "cursor-not-allowed opacity-90 bg-indigo-50/30" : "cursor-pointer"}`
                    : isDisabled
                      ? "border-gray-100 opacity-40 cursor-not-allowed"
                      : "border-gray-200 hover:border-gray-300 cursor-pointer"
                    }`}
                >
                  <div className="pr-10">
                    <h3 className="text-[15px] font-semibold text-gray-900 mb-1">{course.name}</h3>
                    <p className="text-[13px] text-gray-500">Course</p>
                  </div>
                  <div className="absolute top-5 right-5">
                    {isSelected ? (
                      <div className="w-[20px] h-[20px] rounded-full bg-[#5b61f4] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-[20px] h-[20px] rounded-full border-[1.5px] border-gray-300"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center mt-12 mb-8">
          <button
            disabled={selectedCourses.length !== maxLimit}
            onClick={async () => {
              if (lockedCourses.length === maxLimit) {
                alert("Proceeding to Exams!");
                return;
              }

              try {
                const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
                const payload = {
                  subscription_id: Number(selectedSubscription?.subscription_id),
                  course_ids: selectedCourses.map(id => Number(id))
                };
                console.log("Sending payload to backend:", payload);

                const response = await fetch(`${API_BASE_URL}/student/subscription/select-courses`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
                  body: JSON.stringify(payload)
                });

                if (response.ok) {
                  setLockedCourses([...selectedCourses]);
                  
                  // Update the local allSubscriptions state so that the selected courses are saved in memory
                  setAllSubscriptions(prevSubs => prevSubs.map(sub => {
                    if (String(sub.subscription_id) === String(selectedSubscription?.subscription_id)) {
                      return {
                        ...sub,
                        selected_courses: selectedCourses.map(id => {
                          const courseObj = coursesList.find(c => c.id === id);
                          return courseObj ? { course_id: id, course_name: courseObj.name } : { course_id: id };
                        })
                      };
                    }
                    return sub;
                  }));

                  alert("Courses successfully saved!");
                } else {
                  const errorData = await response.json();
                  console.error("Save failed:", errorData);
                  alert("Failed to save courses. Please try again.");
                }
              } catch (error) {
                console.error("Error saving courses:", error);
                alert("An error occurred while saving courses.");
              }
            }}
            className={`px-8 py-4 text-white rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg ${selectedCourses.length !== maxLimit
              ? "bg-gray-300 cursor-not-allowed shadow-none opacity-80"
              : "bg-[#5b61f4] hover:bg-indigo-600 shadow-indigo-200 hover:shadow-indigo-300"
              }`}
          >
            {lockedCourses.length === maxLimit ? (
              <>Continue to Exams <ArrowRight className="w-5 h-5" /></>
            ) : (
              <>{maxLimit === 1 ? "Select Course" : "Select Courses"} <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Performance;
