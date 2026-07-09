import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { ProfileProvider } from "./contexts/ProfileContext";
import Landing from "./pages/Landing";
import Terms from "./pages/Terms";
import Overview from "./pages/Overview";
import Exam from "./pages/Exam";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import DevTalentComponent from "./pages/Dev";
import FullPage from "./pages/gallery";
import CoddingExam from "./pages/CoddingExam ";
import OnlineCompiler from "./pages/OnlineCompiler";
import IndividualCompiler from "./pages/IndividualCompiler";
import Privacy from "./pages/Privacy";
import Conditions from "./pages/Conditions";
// import MCQQuestionPaperCard from "./components/MCQQuestionPaperCard";
import MCQPaper from "./pages/MCQPaper";
import Login from "./pages/Login";
import ImpactSection from "./pages/ImpactSection";
import Subscription from "./IndividualStudent/Subscription";
import Summary from "./IndividualStudent/Summary";
import StudentDashboard from "./IndividualStudent/StudentDashboard";
import Profile from "./IndividualStudent/Profile";
import Individual from "./IndividualStudent/Individual";
import Technical from "./IndividualStudent/Technical";
import NonTechnical from "./IndividualStudent/NonTechnical";
import Register from "./IndividualStudent/Register";
import ForgotPassword from "./pages/Forgotpassword";
import Success1 from "./IndividualStudent/Success1";
import Registration from "./pages/Registration";
import Performance from "./IndividualStudent/Performance";
import Payments from "./IndividualStudent/Payments";
import Certificate from "./pages/Certificate";
import IndividualOverview from "./IndividualStudent/IndividualOverview";
import IndividualTerms from "./IndividualStudent/IndividualTerms";
import StudentResults from "./IndividualStudent/Results";
import ViewScorecard from "./IndividualStudent/ViewScorecard";
import UpgradePage from "./pages/UpgradePage";
import Adminlogin from "./pages/Adminlogin";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import SidebarLayout from "./components/SidebarLayout";
import StudentSidebarLayout from "./components/StudentSidebarLayout";
import Subscriptions from "./pages/Subscriptions";
import Result from "./pages/Results/index";
import ResultDetails from "./pages/Results/ResultDetails";
import Notifications from "./pages/Notifications/Notifications";
import SystemSettings from "./pages/Settings/SystemSettings";
import ProfileSettings from "./pages/Settings/ProfileSettings";
import Student from "./pages/Students/Student";
import ViewStudent from "./pages/Students/ViewStudent";
import EditStudent from "./pages/Students/EditStudent";
import StudentProfile from "./pages/Students/StudentProfile";
import StudentResult from "./pages/Students/StudentResult";
import Report from "./pages/Report";
import CoursesPage from "./pages/Courses/CoursesPage";
import CreateCourse from "./pages/Courses/CreateCoursePage";
import EditCourse from "./pages/Courses/EditCoursePage";
import { CoddingPage, McqPage } from "./pages/Exams";
import ExamDetails from "./pages/Exams/Shared/ExamDetails";
import EditMcq from "./pages/Exams/Mcq/EditMcq";
import EditCoding from "./pages/Exams/Codding/EditCoding";
// import ExamsTab from "./pages/ExamsTab";
import ExamsTab from "./pages/Exams/ExamsPage";
import AdminManagement from "./pages/AdminManagement/AdminManagement";
import CreateAdmin from "./pages/AdminManagement/CreateAdmin";
import CodingLanguages from "./pages/CodingLanguages";
import CreateLanguage from "./pages/CodingLanguages/CreateLanguage";
import EditLanguage from "./pages/CodingLanguages/EditLanguage";
import ViewLanguage from "./pages/CodingLanguages/ViewLanguage";
import EditAdmin from "./pages/AdminManagement/EditAdmin";



const queryClient = new QueryClient();

// Route guard to restrict access by admin login and role
const AdminRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const isAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole"); // "super_admin" or "admin"

  if (!isAuthenticated) {
    return <Navigate to="/adminlogin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole || "")) {
    // If they aren't authorized for this specific dashboard/management page, redirect them accordingly
    return <Navigate to={userRole === "super_admin" ? "/superadmindashboard" : "/admindashboard"} replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ProfileProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" richColors />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/success" element={<Success />} />
            <Route path="/adminlogin" element={<Adminlogin />} />

            <Route path="/dev" element={<DevTalentComponent />} />
            <Route path="/gallery" element={<FullPage />} />
            <Route path="/coddingExam" element={<CoddingExam />} />
            <Route path="/online-compiler" element={<OnlineCompiler />} />
            <Route path="/individual-compiler" element={<IndividualCompiler />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/condition" element={<Conditions />} />
            {/* <Route path="/mcq" element={<MCQQuestionPaperCard />} /> */}
            <Route path="/mcqpaper/:attemptId" element={<MCQPaper />} />
            <Route path="/login" element={<Login />} />
            <Route path="/impactsection" element={<ImpactSection />} />
            <Route path="/studentdashboard" element={<StudentSidebarLayout><StudentDashboard /></StudentSidebarLayout>} />
            <Route path="/profile" element={<StudentSidebarLayout><Profile /></StudentSidebarLayout>} />
            <Route path="/individual" element={<Individual />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/success1" element={<Success1 />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/performance" element={<StudentSidebarLayout><Performance /></StudentSidebarLayout>} />
            <Route path="/payments" element={<StudentSidebarLayout><Payments /></StudentSidebarLayout>} />
            <Route path="/certificate" element={<StudentSidebarLayout><Certificate /></StudentSidebarLayout>} />
            <Route path="/individualoverview" element={<IndividualOverview />} />
            <Route path="/individualoverview/:courseId" element={<IndividualOverview />} />
            <Route path="/individualterms" element={<IndividualTerms />} />
            <Route path="/individualterms/:courseId" element={<IndividualTerms />} />
            <Route path="/student-results" element={<StudentSidebarLayout><StudentResults /></StudentSidebarLayout>} />
            <Route path="/scorecard" element={<StudentSidebarLayout><ViewScorecard /></StudentSidebarLayout>} />
            <Route path="/upgrade" element={<UpgradePage />} />
            <Route path="/adminlogin" element={<Adminlogin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subscription" element={<StudentSidebarLayout><Subscription /></StudentSidebarLayout>} />
            <Route path="/summary" element={<StudentSidebarLayout><Summary /></StudentSidebarLayout>} />
            <Route path="/technical" element={<Technical />} />
            <Route path="/non-technical" element={<NonTechnical />} />

            <Route
              path="/student/:id"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <StudentProfile />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/students/studentresult/:id"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <StudentResult />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/result/:id"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <ResultDetails />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admindashboard"
              element={
                <AdminRoute allowedRoles={["admin"]}>
                  <SidebarLayout>
                    <AdminDashboard />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/superadmindashboard"
              element={
                <AdminRoute allowedRoles={["super_admin"]}>
                  <SidebarLayout>
                    <AdminDashboard />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/profile-settings"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <ProfileSettings />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/students"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <Student />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/students/view/:id"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <ViewStudent />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/students/edit/:id"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <EditStudent />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <CoursesPage />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/create-course"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <CreateCourse />
                  </SidebarLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/edit-course"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <EditCourse />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/exams"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <ExamsTab />
                  </SidebarLayout>
                </AdminRoute>
              }
            />


            <Route
              path="/coding"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <CoddingPage />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/exams/coding/edit/:id"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <EditCoding />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/exams/mcq/edit/:id"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <EditMcq />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/exams/details/:id"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <ExamDetails />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/mcq"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <McqPage />
                  </SidebarLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/results"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <Result />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/subscriptions"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <Subscriptions />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin-management"
              element={
                <AdminRoute allowedRoles={["super_admin"]}>
                  <SidebarLayout>
                    <AdminManagement />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/create-admin"
              element={
                <AdminRoute allowedRoles={["super_admin"]}>
                  <SidebarLayout>
                    <CreateAdmin />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/coding-languages"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <CodingLanguages />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/create-language"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <CreateLanguage />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/edit-language/:id"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <EditLanguage />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/view-language/:id"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <ViewLanguage />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin-management/create"
              element={
                <AdminRoute allowedRoles={["super_admin"]}>
                  <SidebarLayout>
                    <CreateAdmin />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin-management/edit/:id"
              element={
                <AdminRoute allowedRoles={["super_admin"]}>
                  <SidebarLayout>
                    <EditAdmin />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin-management/view/:id"
              element={
                <AdminRoute allowedRoles={["super_admin"]}>
                  <SidebarLayout>
                    <EditAdmin />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route path="/subscription" element={<Subscription />} />

            <Route
              path="/reports"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <Report />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <Notifications />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <AdminRoute>
                  <SidebarLayout>
                    <SystemSettings />
                  </SidebarLayout>
                </AdminRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ProfileProvider>
  </QueryClientProvider>
);

export default App;
