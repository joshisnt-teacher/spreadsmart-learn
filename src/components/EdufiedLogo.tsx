import { Link } from "react-router-dom";

interface EdufiedLogoProps {
  className?: string;
  collapsed?: boolean;
  href?: string;
  toolName?: string;
}

export function EdufiedLogo({ className, collapsed, href = "/dashboard", toolName }: EdufiedLogoProps) {
  const content = (
    <>
      <div
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7.7 8 H10 a2.5 2.5 0 0 1 2.5 2.5 V13.5 a2.5 2.5 0 0 0 2.5 2.5 H16.3" />
          <circle cx="6" cy="8" r="1.7" />
          <circle cx="18" cy="16" r="1.7" />
        </svg>
      </div>
      {!collapsed && toolName && (
        <div className="flex flex-col">
          <span className="text-base font-semibold tracking-tight leading-tight text-sidebar-foreground">
            {toolName}
          </span>
          <span className="text-[11px] leading-tight text-sidebar-foreground/60">
            by Edufied
          </span>
        </div>
      )}
      {!collapsed && !toolName && (
        <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
          Edufied
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link to={href} className={`flex items-center gap-2 ${className ?? ""}`}>
        {content}
      </Link>
    );
  }

  return <div className={`flex items-center gap-2 ${className ?? ""}`}>{content}</div>;
}
