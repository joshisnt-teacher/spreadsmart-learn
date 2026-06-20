import { Moon, Sun } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { useTheme } from "@/contexts/ThemeContext";
import { useAIUsage } from "@/hooks/useAIUsage";

function AIUsageMeter() {
  const { data, isLoading } = useAIUsage();

  return (
    <div className="hidden md:flex items-center gap-2 px-2 text-xs opacity-70">
      <span>AI</span>
      {isLoading || !data ? (
        <span>…</span>
      ) : (
        <span className="tabular-nums">{data.used}/{data.cap}</span>
      )}
    </div>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

export function AppHeader() {
  return (
    <header className="h-14 flex items-center border-b border-border px-4 bg-background/80 backdrop-blur-md sticky top-0 z-30">
      <SidebarTrigger className="mr-2 md:hidden" />
      <div className="flex-1 min-w-0">
        <AppBreadcrumb />
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <AIUsageMeter />
        <ThemeToggle />
      </div>
    </header>
  );
}
