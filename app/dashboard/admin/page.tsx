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

      {/* Header */}
      <div className="border-b-2 border-black pb-6">
        <p className="text-xs font-black uppercase tracking-[0.4em] text-[#FF3000]">Admin</p>
        <h1 className="mt-1 text-3xl font-black uppercase tracking-tighter text-black">Admin Home</h1>
        <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-black/60">
          Org-wide performance management controls
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid border-t-2 border-black md:grid-cols-4">
        {[
          { label: "Employees",        value: employeeCount,                       icon: Users,          accent: false },
          { label: "Submitted",        value: summary.pending + summary.approved,  icon: ClipboardCheck, accent: false },
          { label: "Pending Approval", value: summary.pending,                     icon: CheckSquare,    accent: false },
          { label: "Open Escalations", value: openEscalations,                     icon: AlertTriangle,  accent: openEscalations > 0 },
        ].map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className={`border-b-2 border-black p-6 md:border-r-2 md:last:border-r-0 ${accent ? "bg-[#FF3000]" : ""}`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className={`text-xs font-black uppercase tracking-wider ${accent ? "text-white/80" : "text-black/60"}`}>
                {label}
              </p>
              <Icon className={`h-4 w-4 shrink-0 ${accent ? "text-white/70" : "text-black/35"}`} />
            </div>
            <p className={`mt-3 text-4xl font-black tracking-tighter ${accent ? "text-white" : "text-black"}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Org progress */}
      <Card className="p-0">
        <div className="flex items-center justify-between border-b-2 border-black px-6 py-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-black">Organisation Progress</h2>
          <Link href="/dashboard/admin/completion">
            <Button variant="ghost" className="gap-1 text-xs">
              Full View <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div>
          {[
            { label: "Goals Approved",       value: approvalRate               },
            { label: "Check-ins Submitted",  value: summary.checkInRate        },
            { label: "Manager Reviews Done", value: summary.managerReviewRate  },
          ].map(({ label, value }, i, arr) => (
            <div
              key={label}
              className={`flex items-center gap-6 px-6 py-5 ${i < arr.length - 1 ? "border-b border-black/12" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-black">{label}</span>
                  <span className="text-xs font-black text-black">{value}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#F2F2F2]">
                  <div className="h-1.5 bg-black transition-all" style={{ width: `${value}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Escalation alert */}
      {openEscalations > 0 ? (
        <div className="flex items-center justify-between border-2 border-[#FF3000] px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="bg-[#FF3000] p-3 shrink-0">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-black">
                {openEscalations} Open Escalation{openEscalations !== 1 ? "s" : ""} Need Attention
              </p>
              <p className="mt-1 text-sm text-black/65">
                Overdue goal submissions, approvals, or check-ins.
              </p>
            </div>
          </div>
          <Link href="/dashboard/admin/escalations">
            <Button variant="danger" className="gap-2 shrink-0">
              View <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : null}

      {/* Quick actions grid */}
      <div>
        <h2 className="mb-3 text-xs font-black uppercase tracking-wider text-black">Quick Actions</h2>
        <div className="grid border-t-2 border-black md:grid-cols-3">
          {[
            { href: "/dashboard/admin/cycles",        label: "Cycles",           icon: CalendarRange,  desc: "Configure goal & check-in windows" },
            { href: "/dashboard/admin/org-hierarchy", label: "Org Hierarchy",    icon: GitBranch,      desc: "Manage reporting lines"            },
            { href: "/dashboard/admin/escalations",   label: "Escalations",      icon: AlertTriangle,  desc: "Rule-based overdue tracking"       },
            { href: "/dashboard/admin/reports",       label: "Reports & Export", icon: FileDown,       desc: "Achievement CSV export"            },
            { href: "/dashboard/admin/analytics",     label: "Analytics",        icon: BarChart3,      desc: "QoQ trends and distributions"      },
            { href: "/dashboard/admin/audit-logs",    label: "Audit Logs",       icon: ScrollText,     desc: "Append-only change history"        },
          ].map(({ href, label, icon: Icon, desc }) => (
            <Link key={href} href={href}>
              <div className="group flex items-center gap-4 border-b-2 border-black p-6 transition-colors hover:bg-black md:border-r-2 [&:nth-child(3n)]:md:border-r-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#F2F2F2] group-hover:bg-white/10">
                  <Icon className="h-4 w-4 text-black group-hover:text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-wider text-black group-hover:text-white">
                    {label}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-black/55 group-hover:text-white/70">
                    {desc}
                  </p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-black/30 group-hover:text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Unlock goal sheets */}
      {lockedSheets.length > 0 ? (
        <div>
          <div className="flex items-center gap-3 border-b-2 border-black pb-4">
            <Lock className="h-4 w-4 text-black" />
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-black">Unlock Goal Sheet</h2>
              <p className="text-xs font-semibold uppercase tracking-wide text-black/55">
                Admin-only exception flow with mandatory audit reason.
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {lockedSheets.map((sheet) => (
              <UnlockSheetForm key={sheet.id} sheet={sheet} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
