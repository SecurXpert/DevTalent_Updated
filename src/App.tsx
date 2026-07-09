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



const queryClient = new QueryClient();

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
          <Route path="/examtab" element={<ExamsTab />} />
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
              <SidebarLayout>
                <StudentProfile />
              </SidebarLayout>
            }
          />
          <Route
            path="/students/studentresult/:id"
            element={
              <SidebarLayout>
                <StudentResult />
              </SidebarLayout>
            }
          />
          <Route
            path="/result/:id"
            element={
              <SidebarLayout>
                <ResultDetails />
              </SidebarLayout>
            }
          />
          <Route
            path="/admindashboard"
            element={
              <SidebarLayout>
                <AdminDashboard />
              </SidebarLayout>
            }
          />
          <Route
            path="/profile-settings"
            element={
              <SidebarLayout>
                <ProfileSettings />
              </SidebarLayout>
            }
          />
          <Route
            path="/students"
            element={
              <SidebarLayout>
                <Student />
              </SidebarLayout>
            }
          />
          <Route
            path="/students/view/:id"
            element={
              <SidebarLayout>
                <ViewStudent />
              </SidebarLayout>
            }
          />
          <Route
            path="/students/edit/:id"
            element={
              <SidebarLayout>
                <EditStudent />
              </SidebarLayout>
            }
          />
          <Route
            path="/courses"
            element={
              <SidebarLayout>
                <CoursesPage />
              </SidebarLayout>
            }
          />
          <Route
            path="/create-course"
            element={
              <SidebarLayout>
                <CreateCourse />
              </SidebarLayout>
            }
          />

          <Route
            path="/edit-course"
            element={
              <SidebarLayout>
                <EditCourse />
              </SidebarLayout>
            }
          />
          <Route
            path="/exams"
            element={
              <SidebarLayout>
                <ExamsTab  />
              </SidebarLayout>
            }
          />


          <Route
              path="/coding"
              element={
                <SidebarLayout>
                  <CoddingPage />
                </SidebarLayout>
              }
            />
            <Route
              path="/exams/coding/edit/:id"
              element={
                <SidebarLayout>
                  <EditCoding />
                </SidebarLayout>
              }
            />
            <Route
              path="/exams/mcq/edit/:id"
              element={
                <SidebarLayout>
                  <EditMcq />
                </SidebarLayout>
              }
            />
            <Route
              path="/exams/details/:id"
              element={
                <SidebarLayout>
                  <ExamDetails />
                </SidebarLayout>
              }
            />
            <Route
              path="/mcq"
              element={
                <SidebarLayout>
                  <McqPage />
                </SidebarLayout>
              }
            />
 
          <Route
            path="/results"
            element={
              <SidebarLayout>
                <Result />
              </SidebarLayout>
            }
          />
            <Route
            path="/subscriptions"
            element={
              <SidebarLayout>
                <Subscriptions />
              </SidebarLayout>
            }
          />
          <Route path="/subscription" element={<StudentSidebarLayout><Subscription /></StudentSidebarLayout>} /> 

          <Route
            path="/reports"
            element={
              <SidebarLayout>
               <Report />
              </SidebarLayout>
            }
          />
          <Route
            path="/notifications"
            element={
              <SidebarLayout>
                <Notifications />
              </SidebarLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <SidebarLayout>
                <SystemSettings />
              </SidebarLayout>
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
