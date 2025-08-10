import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Classes from "./pages/Classes";
import ClassDetail from "./pages/ClassDetail";
import Quiz from "./pages/Quiz";
import TeacherDashboard from "./pages/TeacherDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudyRoom from "./pages/StudyRoom";
import Navbar from "./components/layout/Navbar";
import MainLayout from "./components/layout/MainLayout";
import { AuthProvider, RequireAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Student Routes */}
            <Route path="/student" element={<RequireAuth><MainLayout userRole="student"><StudentDashboard /></MainLayout></RequireAuth>} />
            <Route path="/student/classes" element={<RequireAuth><MainLayout userRole="student"><Classes /></MainLayout></RequireAuth>} />
            <Route path="/student/study-room" element={<RequireAuth><MainLayout userRole="student"><StudyRoom /></MainLayout></RequireAuth>} />
            <Route path="/student/quizzes" element={<RequireAuth><MainLayout userRole="student"><div className="p-6"><h1 className="text-2xl font-bold">Available Quizzes</h1><p>Select a quiz to take</p></div></MainLayout></RequireAuth>} />
            <Route path="/student/quiz/:id" element={<RequireAuth><MainLayout userRole="student"><Quiz /></MainLayout></RequireAuth>} />
            <Route path="/student/progress" element={<RequireAuth><MainLayout userRole="student"><div className="p-6"><h1 className="text-2xl font-bold">Progress</h1><p>Track your learning progress</p></div></MainLayout></RequireAuth>} />
            <Route path="/student/groups" element={<RequireAuth><MainLayout userRole="student"><div className="p-6"><h1 className="text-2xl font-bold">Study Groups</h1><p>Collaborate with other students</p></div></MainLayout></RequireAuth>} />
            <Route path="/student/ai-assistant" element={<RequireAuth><MainLayout userRole="student"><div className="p-6"><h1 className="text-2xl font-bold">AI Assistant</h1><p>Get help from our AI tutor</p></div></MainLayout></RequireAuth>} />
            <Route path="/student/calendar" element={<RequireAuth><MainLayout userRole="student"><div className="p-6"><h1 className="text-2xl font-bold">Calendar</h1><p>Schedule and deadlines</p></div></MainLayout></RequireAuth>} />
            
            {/* Teacher Routes */}
            <Route path="/teacher" element={<RequireAuth><MainLayout userRole="teacher"><TeacherDashboard /></MainLayout></RequireAuth>} />
            <Route path="/teacher/classes" element={<RequireAuth><MainLayout userRole="teacher"><div className="p-6"><h1 className="text-2xl font-bold">My Classes</h1><p>View and manage your classes</p></div></MainLayout></RequireAuth>} />
            <Route path="/teacher/students" element={<RequireAuth><MainLayout userRole="teacher"><div className="p-6"><h1 className="text-2xl font-bold">Students</h1><p>Manage your students</p></div></MainLayout></RequireAuth>} />
            <Route path="/teacher/content" element={<RequireAuth><MainLayout userRole="teacher"><div className="p-6"><h1 className="text-2xl font-bold">Content</h1><p>Create and manage learning content</p></div></MainLayout></RequireAuth>} />
            <Route path="/teacher/quizzes" element={<RequireAuth><MainLayout userRole="teacher"><div className="p-6"><h1 className="text-2xl font-bold">Quizzes</h1><p>Create and manage quizzes</p></div></MainLayout></RequireAuth>} />
            <Route path="/teacher/analytics" element={<RequireAuth><MainLayout userRole="teacher"><div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p>View class performance data</p></div></MainLayout></RequireAuth>} />
            <Route path="/teacher/reports" element={<RequireAuth><MainLayout userRole="teacher"><div className="p-6"><h1 className="text-2xl font-bold">Reports</h1><p>Generate student reports</p></div></MainLayout></RequireAuth>} />
            <Route path="/teacher/calendar" element={<RequireAuth><MainLayout userRole="teacher"><div className="p-6"><h1 className="text-2xl font-bold">Calendar</h1><p>Schedule classes and events</p></div></MainLayout></RequireAuth>} />
            
            {/* Parent Routes */}
            <Route path="/parent" element={<RequireAuth><MainLayout userRole="parent"><ParentDashboard /></MainLayout></RequireAuth>} />
            <Route path="/parent/children" element={<RequireAuth><MainLayout userRole="parent"><div className="p-6"><h1 className="text-2xl font-bold">Children</h1><p>View your children's information</p></div></MainLayout></RequireAuth>} />
            <Route path="/parent/progress" element={<RequireAuth><MainLayout userRole="parent"><div className="p-6"><h1 className="text-2xl font-bold">Progress</h1><p>Track your child's learning progress</p></div></MainLayout></RequireAuth>} />
            <Route path="/parent/reports" element={<RequireAuth><MainLayout userRole="parent"><div className="p-6"><h1 className="text-2xl font-bold">Reports</h1><p>View detailed reports</p></div></MainLayout></RequireAuth>} />
            <Route path="/parent/communication" element={<RequireAuth><MainLayout userRole="parent"><div className="p-6"><h1 className="text-2xl font-bold">Communication</h1><p>Communicate with teachers</p></div></MainLayout></RequireAuth>} />
            <Route path="/parent/resources" element={<RequireAuth><MainLayout userRole="parent"><div className="p-6"><h1 className="text-2xl font-bold">Resources</h1><p>Helpful resources for parents</p></div></MainLayout></RequireAuth>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<RequireAuth><MainLayout userRole="admin"><div className="p-6"><h1 className="text-2xl font-bold">Admin Dashboard</h1><p>System administration</p></div></MainLayout></RequireAuth>} />
            <Route path="/admin/users" element={<RequireAuth><MainLayout userRole="admin"><div className="p-6"><h1 className="text-2xl font-bold">Users</h1><p>Manage system users</p></div></MainLayout></RequireAuth>} />
            <Route path="/admin/classes" element={<RequireAuth><MainLayout userRole="admin"><div className="p-6"><h1 className="text-2xl font-bold">Classes</h1><p>Manage all classes</p></div></MainLayout></RequireAuth>} />
            <Route path="/admin/analytics" element={<RequireAuth><MainLayout userRole="admin"><div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p>System-wide analytics</p></div></MainLayout></RequireAuth>} />
            <Route path="/admin/settings" element={<RequireAuth><MainLayout userRole="admin"><div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>System configuration</p></div></MainLayout></RequireAuth>} />
            
            {/* Legacy Routes - keeping for compatibility */}
            <Route path="/classes" element={<RequireAuth><Classes /></RequireAuth>} />
            <Route path="/classes/:id" element={<RequireAuth><ClassDetail /></RequireAuth>} />
            <Route path="/quiz/:id" element={<RequireAuth><Quiz /></RequireAuth>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
