import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ModulePlayer from "./pages/ModulePlayer";
import TeacherSettings from "./pages/TeacherSettings";
import CompressionTest from "./pages/CompressionTest";
import ResetPassword from "./pages/ResetPassword";
import TeacherSSO from "./pages/TeacherSSO";
import StudentSSO from "./pages/StudentSSO";
import NotFound from "./pages/NotFound";
import ToolSwitcher from "@/components/ToolSwitcher";
import { TeacherLayout } from "@/components/TeacherLayout";

const queryClient = new QueryClient();

function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let label = "circuit";
    if (path === "/dashboard") label = "Dashboard";
    else if (path === "/dashboard/settings") label = "Settings";
    else if (path === "/dashboard/compression-test") label = "Compression Test";
    else if (path === "/auth") label = "Auth";
    else if (path === "/student") label = "Student";
    else if (path.startsWith("/module/")) label = "Module";
    else if (path === "/auth/teacher/sso") label = "Signing in...";
    else if (path === "/auth/sso") label = "Signing in...";
    else if (path === "/reset-password") label = "Reset Password";
    else if (path === "/") label = "circuit";

    document.title = label === "circuit" ? "circuit - by edufied" : `circuit - ${label}`;
  }, [location.pathname]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PageTitle />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <TeacherLayout>
                    <TeacherDashboard />
                  </TeacherLayout>
                }
              />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/module/:moduleId" element={<ModulePlayer />} />
              <Route
                path="/dashboard/settings"
                element={
                  <TeacherLayout>
                    <TeacherSettings />
                  </TeacherLayout>
                }
              />
              <Route
                path="/dashboard/compression-test"
                element={
                  <TeacherLayout>
                    <CompressionTest />
                  </TeacherLayout>
                }
              />
              <Route path="/auth/teacher/sso" element={<TeacherSSO />} />
              <Route path="/auth/sso" element={<StudentSSO />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToolSwitcher currentSlug="circuit" />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
