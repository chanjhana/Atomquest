import Link from "next/link";
import { UnlockSheetForm } from "@/components/admin/unlock-sheet-form";
import { FlashToast } from "@/components/layout/flash-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/require-role";
import {
  getAllAssignableUsersData,
  getCompletionDashboardData,
  getEscalationsData,
  getLockedGoalSheetsData,
} from "@/lib/services/live-data";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarRange,
  CheckSquare,
  ClipboardCheck,
  FileDown,
  GitBranch,
  Lock,
  ScrollText,
  TrendingUp,
  Users,
} from "lucide-react";

export default async function AdminDashboardPage({ searchParams }: { searchParams?: { success?: string } }) {
  await requireRole(["admin"]);
  const [allUsers, escalations, summary, lockedSheets] = await Promise.all([
    getAllAssignableUsersData(),
    getEscalationsData(),
    getCompletionDashboardData(),
    getLockedGoalSheetsData(),
  ]);
  const employeeCount = allUsers.filter((u) => u.role === "employee").length;
  const openEscalations = escalations.filter((item) => item.status === "open").length;

  const approvalRate = summary.total > 0 ? Math.round((summary.approved / summary.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <FlashToast success={searchParams?.success} />

      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Admin Home</h1>
        <p className="text-slate-400 text-sm">Org-wide performance management controls</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Employees", value: employeeCount,                          icon: Users,         color: "bg-blue-50",   icon_color: "text-blue-600"   },
          { label: "Submitted", value: summary.pending + summary.approved,     icon: ClipboardCheck, color: "bg-teal-50",  icon_color: "text-teal-600"   },
          { label: "Pending Approval", value: summary.pending,                 icon: CheckSquare,   color: "bg-amber-50",  icon_color: "text-amber-600"  },
          { label: "Open Escalations", value: openEscalations,                 icon: AlertTriangle, color: openEscalations > 0 ? "bg-red-50" : "bg-slate-50", icon_color: openEscalations > 0 ? "text-red-500" : "text-slate-400" },
        ].map(({ label, value, icon: Icon, color, icon_color }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-xl p-2.5 ${color}`}><Icon className={`h-5 w-5 ${icon_color}`} /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Org progress */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Organisation Progress</h2>
          <Link href="/dashboard/admin/completion">
            <Button variant="ghost" className="gap-1 text-xs text-slate-500">
              Full view <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {[
            { label: "Goals Approved",         value: approvalRate,                color: "bg-teal-500"   },
            { label: "Check-ins Submitted",    value: summary.checkInRate,         color: "bg-blue-500"   },
            { label: "Manager Reviews Done",   value: summary.managerReviewRate,   color: "bg-violet-500" },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div className="flex justify-between mb-1.5">
                <span className="text-sm text-slate-600">{label}</span>
                <span className="text-sm font-semibold text-slate-800">{value}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Escalation alert */}
      {openEscalations > 0 ? (
        <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm font-semibold text-red-800">{openEscalations} open escalation{openEscalations !== 1 ? "s" : ""} need attention</p>
              <p className="text-xs text-red-500">Overdue goal submissions, approvals, or check-ins.</p>
            </div>
          </div>
          <Link href="/dashboard/admin/escalations">
            <Button className="gap-2 bg-red-600 hover:bg-red-700">
              View <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : null}

      {/* Quick actions grid */}
      <div>
        <h2 className="mb-3 font-semibold text-slate-900">Quick Actions</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { href: "/dashboard/admin/cycles",        label: "Cycles",           icon: CalendarRange,  desc: "Configure goal & check-in windows" },
            { href: "/dashboard/admin/org-hierarchy", label: "Org Hierarchy",    icon: GitBranch,      desc: "Manage reporting lines" },
            { href: "/dashboard/admin/escalations",   label: "Escalations",      icon: AlertTriangle,  desc: "Rule-based overdue tracking" },
            { href: "/dashboard/admin/reports",       label: "Reports & Export", icon: FileDown,       desc: "Achievement CSV export" },
            { href: "/dashboard/admin/analytics",     label: "Analytics",        icon: BarChart3,      desc: "QoQ trends and distributions" },
            { href: "/dashboard/admin/audit-logs",    label: "Audit Logs",       icon: ScrollText,     desc: "Append-only change history" },
          ].map(({ href, label, icon: Icon, desc }) => (
            <Link key={href} href={href}>
              <Card className="flex items-center gap-3 p-4 hover:border-teal-200 hover:bg-teal-50 transition-colors cursor-pointer">
                <div className="rounded-xl bg-slate-100 p-2.5 shrink-0">
                  <Icon className="h-4 w-4 text-slate-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  <p className="text-xs text-slate-400 truncate">{desc}</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-slate-300 shrink-0" />
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Unlock goal sheets */}
      {lockedSheets.length > 0 ? (
        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-slate-500" />
            <div>
              <h2 className="font-semibold text-slate-950">Unlock Goal Sheet</h2>
              <p className="text-xs text-slate-400">Admin-only exception flow with mandatory audit reason.</p>
            </div>
          </div>
          {lockedSheets.map((sheet) => (
            <UnlockSheetForm key={sheet.id} sheet={sheet} />
          ))}
        </Card>
      ) : null}
    </div>
  );
}
