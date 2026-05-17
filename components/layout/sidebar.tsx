import Link from "next/link";
import type { Role } from "@/lib/domain/enums";
import { roleLabels } from "@/lib/domain/enums";

const navByRole: Record<Role, Array<{ href: string; label: string }>> = {
  employee: [
    { href: "/dashboard/employee", label: "My Dashboard" },
    { href: "/dashboard/employee/goals/new", label: "Goal Sheet" },
    { href: "/dashboard/employee/check-ins", label: "Quarterly Check-in" },
    { href: "/dashboard/employee/check-ins/history", label: "History" }
  ],
  manager: [
    { href: "/dashboard/manager", label: "Team Overview" },
    { href: "/dashboard/manager/approvals", label: "Approvals" },
    { href: "/dashboard/manager/check-ins", label: "Team Check-ins" },
    { href: "/dashboard/manager/shared-goals", label: "Shared Goals" },
    { href: "/dashboard/manager/analytics", label: "Analytics" }
  ],
  admin: [
    { href: "/dashboard/admin", label: "Admin Home" },
    { href: "/dashboard/admin/cycles", label: "Cycles" },
    { href: "/dashboard/admin/org-hierarchy", label: "Org Hierarchy" },
    { href: "/dashboard/admin/shared-goals", label: "Shared Goals" },
    { href: "/dashboard/admin/audit-logs", label: "Audit Logs" },
    { href: "/dashboard/admin/escalations", label: "Escalations" },
    { href: "/dashboard/admin/completion", label: "Completion" },
    { href: "/dashboard/admin/reports", label: "Reports & Export" },
    { href: "/dashboard/admin/analytics", label: "Analytics" }
  ]
};

export function Sidebar({ role }: { role: Role }) {
  return (
    <aside className="min-h-screen w-72 border-r border-slate-200 bg-white/90 p-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Tracko</p>
        <h1 className="mt-2 text-xl font-semibold text-slate-950">Performance Portal</h1>
        <p className="mt-1 text-sm text-slate-500">{roleLabels[role]}</p>
      </div>
      <nav className="mt-8 space-y-2">
        {navByRole[role].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-800"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
