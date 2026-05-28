import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  settings: "Settings",
  "compression-test": "Compression Test",
  students: "Students",
};

interface BreadcrumbSegment {
  label: string;
  href: string;
}

function useAppBreadcrumbs(): BreadcrumbSegment[] {
  const location = useLocation();
  const path = location.pathname;
  const parts = path.split("/").filter(Boolean);
  const segments: BreadcrumbSegment[] = [];

  let currentPath = "";
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    currentPath += `/${part}`;
    const label = ROUTE_LABELS[part] || part.charAt(0).toUpperCase() + part.slice(1);
    segments.push({ label, href: currentPath });
  }

  if (segments.length === 0) {
    segments.push({ label: "Dashboard", href: "/dashboard" });
  }

  return segments;
}

export function AppBreadcrumb() {
  const segments = useAppBreadcrumbs();

  if (segments.length <= 1) {
    return null;
  }

  const displaySegments =
    segments.length > 4
      ? [
          segments[0],
          { label: "...", href: segments[0].href },
          ...segments.slice(segments.length - 2),
        ]
      : segments;

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-sm text-muted-foreground">
        {displaySegments.map((segment, index) => {
          const isLast = index === displaySegments.length - 1;
          return (
            <BreadcrumbItem key={`${segment.href}-${index}`}>
              {isLast ? (
                <BreadcrumbPage className="text-foreground font-medium">
                  {segment.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={segment.href}>{segment.label}</Link>
                </BreadcrumbLink>
              )}
              {!isLast && <BreadcrumbSeparator className="mx-1" />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
