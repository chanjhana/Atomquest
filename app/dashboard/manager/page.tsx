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

export default async function ManagerDashboardPage() {
  const user = await requireRole(["manager"]);
  const [team, approvals, allEscalations, summary] = await Promise.all([
    getTeamMembersData(user.id),
    getPendingApprovalsData(user.id),
    getEscalationsData(),
    getCompletionDashboardData(user.id),
  ]);
  const escalations = allEscalations.filter(
    (item) => item.managerName === user.name && item.status === "open"
  );

  const checkInRate = summary.checkInRate;
  const approvalRate = summary.total > 0 ? Math.round((summary.approved / summary.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-black pb-6">
        <p className="text-xs font-black uppercase tracking-[0.4em] text-[#FF3000]">Manager</p>
        <h1 className="mt-1 text-3xl font-black uppercase tracking-tighter text-black">Team Overview</h1>
        <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-black/60">
          Managing {team.length} direct report{team.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Stats */}
      <div className="grid border-t-2 border-black md:grid-cols-4">
        {[
          { label: "Team Size",   value: team.length,        icon: Users,         sub: "direct reports",  accent: false },
          { label: "Pending",     value: approvals.length,   icon: Clock,         sub: "awaiting review", accent: false },
          { label: "Check-ins",   value: `${checkInRate}%`,  icon: TrendingUp,    sub: "submitted",       accent: false },
          { label: "Escalations", value: escalations.length, icon: AlertTriangle, sub: "open",            accent: escalations.length > 0 },
        ].map(({ label, value, icon: Icon, sub, accent }) => (
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
            <p className={`mt-1 text-xs font-semibold uppercase tracking-wide ${accent ? "text-white/75" : "text-black/55"}`}>
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* Approvals CTA */}
      {approvals.length > 0 ? (
        <div className="flex items-center justify-between border-2 border-black bg-[#F2F2F2] px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="bg-black p-3 shrink-0">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-black">
                {approvals.length} Goal Sheet{approvals.length !== 1 ? "s" : ""} Awaiting Your Approval
              </p>
              <p className="mt-1 text-sm text-black/65">Review and approve or return for revision.</p>
            </div>
          </div>
          <Link href="/dashboard/manager/approvals">
            <Button className="gap-2 shrink-0">
              Review Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-4 border-2 border-black px-6 py-5">
          <div className="bg-black p-3 shrink-0">
            <CheckCircle2 className="h-5 w-5 text-white" />
          </div>
          <p className="text-xs font-black uppercase tracking-wider text-black">
            All Caught Up — No Pending Approvals
          </p>
        </div>
      )}

      {/* Progress bars */}
      <Card className="p-0">
        <div className="border-b-2 border-black px-6 py-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-black">Team Progress</h2>
        </div>
        <div>
          {[
            { label: "Goals Approved",        value: approvalRate,              icon: CheckSquare   },
            { label: "Check-ins Submitted",   value: checkInRate,               icon: ClipboardCheck },
            { label: "Manager Reviews Done",  value: summary.managerReviewRate, icon: CheckCircle2  },
          ].map(({ label, value, icon: Icon }, i, arr) => (
            <div
              key={label}
              className={`flex items-center gap-6 px-6 py-5 ${i < arr.length - 1 ? "border-b border-black/12" : ""}`}
            >
              <Icon className="h-4 w-4 shrink-0 text-black/40" />
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

      {/* Pending approvals list */}
      {approvals.length > 0 ? (
        <div>
          <h2 className="mb-3 text-xs font-black uppercase tracking-wider text-black">Pending Approvals</h2>
          <div className="border-t-2 border-black">
            {approvals.map(({ ownerName, sheet }) => (
              <div
                key={sheet.id}
                className="flex items-center justify-between gap-4 border-b-2 border-black px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-black bg-[#F2F2F2] text-base font-black text-black">
                    {ownerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-black">{ownerName}</p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-black/55">
                      {sheet.goals.length} goals · Submitted {formatDate(sheet.submittedAt)}
                    </p>
                  </div>
                </div>
                <Link href={`/dashboard/manager/approvals/${sheet.id}`}>
                  <Button variant="secondary" className="gap-2 shrink-0">
                    Review <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Quick links */}
      <div>
        <h2 className="mb-3 text-xs font-black uppercase tracking-wider text-black">Quick Links</h2>
        <div className="grid border-t-2 border-black md:grid-cols-3">
          {[
            { href: "/dashboard/manager/check-ins",    label: "Team Check-ins",  icon: ClipboardCheck, desc: "Review quarterly actuals"  },
            { href: "/dashboard/manager/shared-goals", label: "Shared Goals",    icon: CheckSquare,    desc: "Push departmental KPIs"    },
            { href: "/dashboard/manager/analytics",    label: "Analytics",       icon: TrendingUp,     desc: "Achievement trends"        },
          ].map(({ href, label, icon: Icon, desc }) => (
            <Link key={href} href={href}>
              <div className="group flex items-center gap-4 border-b-2 border-black p-6 transition-colors hover:bg-black md:border-r-2 md:last:border-r-0">
                <Icon className="h-5 w-5 shrink-0 text-black/40 group-hover:text-white" />
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
    </div>
  );
}
