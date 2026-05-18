"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  CalendarRange,
  CheckCircle2,
  CheckSquare,
  ClipboardCheck,
  ClipboardList,
  Clock,
  FileDown,
  GitBranch,
  LayoutDashboard,
  ScrollText,
  Share2,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/domain/enums";
import { roleLabels } from "@/lib/domain/enums";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: LucideIcon };

const navByRole: Record<Role, NavItem[]> = {
  employee: [
    { href: "/dashboard/employee", label: "My Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/employee/goals/new", label: "Goal Sheet", icon: Target },
    { href: "/dashboard/employee/check-ins", label: "Quarterly Check-in", icon: ClipboardList },
    { href: "/dashboard/employee/check-ins/history", label: "History", icon: Clock },
  ],
  manager: [
    { href: "/dashboard/manager", label: "Team Overview", icon: Users },
    { href: "/dashboard/manager/approvals", label: "Approvals", icon: CheckCircle2 },
    { href: "/dashboard/manager/check-ins", label: "Team Check-ins", icon: ClipboardCheck },
    { href: "/dashboard/manager/shared-goals", label: "Shared Goals", icon: Share2 },
    { href: "/dashboard/manager/analytics", label: "Analytics", icon: TrendingUp },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Admin Home", icon: LayoutDashboard },
    { href: "/dashboard/admin/cycles", label: "Cycles", icon: CalendarRange },
    { href: "/dashboard/admin/org-hierarchy", label: "Org Hierarchy", icon: GitBranch },
    { href: "/dashboard/admin/shared-goals", label: "Shared Goals", icon: Share2 },
    { href: "/dashboard/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
    { href: "/dashboard/admin/escalations", label: "Escalations", icon: AlertTriangle },
    { href: "/dashboard/admin/completion", label: "Completion", icon: CheckSquare },
    { href: "/dashboard/admin/reports", label: "Reports & Export", icon: FileDown },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
  ],
};

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = navByRole[role];

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r-2 border-black bg-white">
      {/* Brand */}
      <div className="border-b-2 border-black px-6 py-6 swiss-diagonal">
        <p className="text-xs font-black uppercase tracking-[0.5em] text-[#FF3000]">Tracko</p>
        <p className="mt-2 text-lg font-black uppercase leading-tight tracking-tighter text-black">
          Performance<br />Portal
        </p>
        <div className="mt-3 inline-flex border-2 border-black px-2.5 py-1">
          <span className="text-xs font-black uppercase tracking-wider text-black">
            {roleLabels[role]}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== `/dashboard/${role}` && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 border-b border-black/15 px-6 py-4 text-xs font-black uppercase tracking-wider transition-colors duration-150",
                active ? "bg-black text-white" : "text-black hover:bg-[#F2F2F2]"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
              {item.label === "Escalations" && !active && (
                <span className="ml-auto h-2 w-2 bg-[#FF3000]" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
