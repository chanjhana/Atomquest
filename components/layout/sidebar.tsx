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

const roleColors: Record<Role, string> = {
  employee: "bg-blue-100 text-blue-700",
  manager: "bg-violet-100 text-violet-700",
  admin: "bg-teal-100 text-teal-700",
};

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = navByRole[role];

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-5">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Tracko</p>
        <p className="mt-1 text-base font-semibold text-slate-900">Performance Portal</p>
        <span className={cn("mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold", roleColors[role])}>
          {roleLabels[role]}
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== `/dashboard/${role}` && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-teal-50 text-teal-800"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-teal-600" : "text-slate-400")} />
              {item.label}
              {item.label === "Escalations" && !active && (
                <span className="ml-auto h-2 w-2 rounded-full bg-red-400" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
