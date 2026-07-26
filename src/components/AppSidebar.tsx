import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { EdufiedLogo } from "@/components/EdufiedLogo";
import { AiUsageIndicator } from "@/components/AiUsageIndicator";

const mainNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Modules", url: "/dashboard/modules", icon: BookOpen },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path)
      ? "bg-black/8 text-sidebar-foreground border-l-[3px] border-primary"
      : "hover:bg-black/5 text-sidebar-foreground/70";
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sidebar className="border-sidebar-border/50 bg-sidebar">
      <SidebarHeader className="h-16 border-b border-sidebar-border/50 flex items-center px-4">
        <EdufiedLogo collapsed={collapsed} className="text-sidebar-foreground" toolName="Circuit" />
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarMenu className="gap-1">
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className={getNavClassName(item.url)}>
                <NavLink to={item.url}>
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        {!collapsed && (
          <div className="mb-3">
            <AiUsageIndicator />
          </div>
        )}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-primary">{initials}</span>
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{displayName}</p>
                <p className="text-xs text-sidebar-foreground/50 truncate">Teacher</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                title="Sign out"
                className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
