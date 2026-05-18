import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/require-role";
import {
  getCompletionDashboardData,
  getEscalationsData,
  getPendingApprovalsData,
  getTeamMembersData,
} from "@/lib/services/live-data";
import { formatDate } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CheckSquare,
  ClipboardCheck,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";

const sheetStatusConfig: Record<string, { label: string; color: string; dot: string }> = {
  approved_locked:  { label: "Approved",         color: "text-green-700",  dot: "bg-green-500" },
  pending_approval: { label: "Pending Approval",  color: "text-amber-700",  dot: "bg-amber-500" },
  returned:         { label: "Returned",          color: "text-red-700",    dot: "bg-red-500"   },
  draft:            { label: "Draft",             color: "text-slate-500",  dot: "bg-slate-400" },
};

export default async function ManagerDashboardPage() {
  const user = await requireRole(["manager"]);
  const team = await getTeamMembersData(user.id);
  const approvals = await getPendingApprovalsData(user.id);
  const escalations = (await getEscalationsData()).filter(
    (item) => item.managerName === user.name && item.status === "open"
  );
  const summary = await getCompletionDashboardData(user.id);

  const checkInRate = summary.checkInRate;
  const approvalRate = summary.total > 0 ? Math.round((summary.approved / summary.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Team Overview</h1>
        <p className="text-slate-400 text-sm">Managing {team.length} direct report{team.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5"><Users className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Team</p>
              <p className="text-2xl font-bold text-slate-900">{team.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-2.5"><Clock className="h-5 w-5 text-amber-600" /></div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Pending</p>
              <p className="text-2xl font-bold text-slate-900">{approvals.length}</p>
              <p className="text-xs text-slate-500">awaiting review</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-2.5"><TrendingUp className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Check-ins</p>
              <p className="text-2xl font-bold text-slate-900">{checkInRate}%</p>
              <p className="text-xs text-slate-500">submitted</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-2.5 ${escalations.length > 0 ? "bg-red-50" : "bg-slate-50"}`}>
              <AlertTriangle className={`h-5 w-5 ${escalations.length > 0 ? "text-red-500" : "text-slate-400"}`} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Escalations</p>
              <p className="text-2xl font-bold text-slate-900">{escalations.length}</p>
              <p className="text-xs text-slate-500">open</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Approvals CTA */}
      {approvals.length > 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  {approvals.length} goal sheet{approvals.length !== 1 ? "s" : ""} waiting for your approval
                </p>
                <p className="text-xs text-amber-600">Review and approve or return for revision.</p>
              </div>
            </div>
            <Link href="/dashboard/manager/approvals">
              <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
                Review Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <p className="text-sm font-medium text-green-700">All caught up — no pending approvals.</p>
        </div>
      )}

      {/* Progress bars */}
      <Card className="space-y-4">
        <h2 className="font-semibold text-slate-900">Team Progress</h2>
        <div className="space-y-3">
          {[
            { label: "Goals Approved", value: approvalRate, icon: CheckSquare, color: "bg-teal-500" },
            { label: "Check-ins Submitted", value: checkInRate, icon: ClipboardCheck, color: "bg-blue-500" },
            { label: "Manager Reviews Done", value: summary.managerReviewRate, icon: CheckCircle2, color: "bg-violet-500" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-sm text-slate-600">{label}</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">{value}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Pending approvals list */}
      {approvals.length > 0 ? (
        <div className="space-y-3">
          <h2 className="font-semibold text-slate-900">Pending Approvals</h2>
          {approvals.map(({ ownerName, sheet }) => (
            <Card key={sheet.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                  {ownerName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{ownerName}</p>
                  <p className="text-xs text-slate-400">
                    {sheet.goals.length} goals · submitted {formatDate(sheet.submittedAt)}
                  </p>
                </div>
              </div>
              <Link href={`/dashboard/manager/approvals/${sheet.id}`}>
                <Button variant="secondary" className="gap-2 shrink-0">
                  Review <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      ) : null}

      {/* Quick links */}
      <div className="grid gap-3 md:grid-cols-3">
        {[
          { href: "/dashboard/manager/check-ins",    label: "Team Check-ins",   icon: ClipboardCheck, desc: "Review quarterly actuals" },
          { href: "/dashboard/manager/shared-goals", label: "Shared Goals",     icon: CheckSquare,    desc: "Push departmental KPIs" },
          { href: "/dashboard/manager/analytics",    label: "Analytics",        icon: TrendingUp,     desc: "Achievement trends" },
        ].map(({ href, label, icon: Icon, desc }) => (
          <Link key={href} href={href}>
            <Card className="flex items-center gap-3 p-4 hover:border-teal-200 hover:bg-teal-50 transition-colors cursor-pointer">
              <Icon className="h-5 w-5 text-teal-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-slate-300" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
