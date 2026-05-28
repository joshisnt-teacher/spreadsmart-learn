import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";
import ToolSwitcher from "@/components/ToolSwitcher";
import { TeacherLayout } from "@/components/TeacherLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
