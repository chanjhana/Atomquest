import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FlashToast } from "@/components/layout/flash-toast";
import { requireRole } from "@/lib/auth/require-role";
import { getActiveCycleData, getGoalSheetForUserData, summarizeSheet } from "@/lib/services/live-data";
import { activeQuarter, isGoalSettingOpen, isQuarterOpen } from "@/lib/services/windows";
import { formatDate } from "@/lib/utils";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  Target,
} from "lucide-react";

const statusConfig: Record<string, { label: string; accent: string; textColor: string; border: string }> = {
  draft:            { label: "Draft",               accent: "bg-black",       textColor: "text-black",       border: "border-black"       },
  pending_approval: { label: "Pending Approval",    accent: "bg-black",       textColor: "text-black",       border: "border-black"       },
  approved_locked:  { label: "Approved & Locked",   accent: "bg-black",       textColor: "text-black",       border: "border-black"       },
  returned:         { label: "Returned for Edits",  accent: "bg-[#FF3000]",   textColor: "text-[#FF3000]",   border: "border-[#FF3000]"   },
  none:             { label: "No Sheet Yet",          accent: "bg-black/40",    textColor: "text-black/60",    border: "border-black"       },
};

export default async function EmployeeDashboardPage({ searchParams }: { searchParams?: { success?: string } }) {
  const user = await requireRole(["employee"]);
  const [sheet, cycle] = await Promise.all([
    getGoalSheetForUserData(user.id),
    getActiveCycleData(),
  ]);
  const summary = summarizeSheet(sheet);
  const goalSettingOpen = isGoalSettingOpen(cycle);
  const quarter = activeQuarter(cycle);
  const checkInOpen = isQuarterOpen(cycle, quarter);
  const statusKey = sheet ? summary.status : "none";
  const status = statusConfig[statusKey] ?? statusConfig.none;

  return (
    <div className="space-y-6">
      <FlashToast success={searchParams?.success} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b-2 border-black pb-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.4em] text-[#FF3000]">Employee</p>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-tighter text-black">My Dashboard</h1>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-black/60">
            Welcome back, {user.name}
          </p>
        </div>
        <Link href="/dashboard/employee/goals/new">
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            {sheet ? "Open Goal Sheet" : "Create Goal Sheet"}
          </Button>
        </Link>
      </div>

      {/* Goal sheet status banner */}
      <div className={`border-2 p-5 ${status.border}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center ${status.accent}`}>
              {statusKey === "approved_locked" ? (
                <CheckCircle2 className="h-5 w-5 text-white" />
              ) : statusKey === "returned" ? (
                <AlertCircle className="h-5 w-5 text-white" />
              ) : (
                <Clock className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-wider ${status.textColor}`}>
                {status.label}
              </p>
              <p className="mt-1 text-sm text-black/65">
                {statusKey === "approved_locked" && "Your goals are locked and ready for quarterly check-ins."}
                {statusKey === "pending_approval" && "Waiting for your manager to review and approve."}
                {statusKey === "draft" && "Finish adding goals and submit when total weightage reaches 100%."}
                {statusKey === "returned" && sheet?.returnComment && `Manager comment: ${sheet.returnComment}`}
                {statusKey === "none" && (goalSettingOpen ? "Goal setting window is open — create your goals now." : "No goal sheet for this cycle.")}
              </p>
            </div>
          </div>
          <Link href="/dashboard/employee/goals/new">
            <Button variant="secondary" className="gap-1 shrink-0">
              {statusKey === "approved_locked" ? "View" : "Edit"} <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid border-t-2 border-black md:grid-cols-3">
        <div className="border-b-2 border-black p-6 md:border-r-2">
          <p className="text-xs font-black uppercase tracking-wider text-black/60">Goals</p>
          <p className="mt-3 text-5xl font-black tracking-tighter text-black">{summary.goalCount}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-black/55">
            {summary.totalWeightage}% total weightage
          </p>
        </div>
        <div className="border-b-2 border-black p-6 md:border-r-2">
          <p className="text-xs font-black uppercase tracking-wider text-black/60">Active Cycle</p>
          <p className="mt-3 text-2xl font-black uppercase tracking-tighter text-black">{cycle.name}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-black/55">
            Goal setting {goalSettingOpen ? "open" : `closes ${formatDate(cycle.goalSettingEnd)}`}
          </p>
        </div>
        <div className="border-b-2 border-black p-6">
          <p className="text-xs font-black uppercase tracking-wider text-black/60">Check-in</p>
          <p className={`mt-3 text-5xl font-black tracking-tighter ${checkInOpen ? "text-black" : "text-black/40"}`}>
            {quarter.toUpperCase()}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-black/55">
            {checkInOpen
              ? "Window is open"
              : `Opens ${formatDate(cycle[`${quarter}Start` as keyof typeof cycle] as string)}`}
          </p>
        </div>
      </div>

      {/* Check-in CTA */}
      {checkInOpen && statusKey === "approved_locked" ? (
        <div className="flex items-center justify-between border-2 border-black bg-[#F2F2F2] px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="bg-[#FF3000] p-3 shrink-0">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-black">
                {quarter.toUpperCase()} Check-in Window is Open
              </p>
              <p className="mt-1 text-sm text-black/65">
                Submit your actual achievements before the window closes.
              </p>
            </div>
          </div>
          <Link href="/dashboard/employee/check-ins">
            <Button className="gap-2 shrink-0">
              Go to Check-in <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : null}

      {/* Goals list */}
      {sheet && sheet.goals.length > 0 ? (
        <Card className="p-0">
          <div className="flex items-center justify-between border-b-2 border-black px-6 py-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-black">Goal Sheet</h2>
            <span className="text-xs font-bold text-black/55">
              {sheet.goals.length} goal{sheet.goals.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div>
            {sheet.goals.map((goal, i) => (
              <div
                key={goal.id}
                className={`flex items-center gap-4 px-6 py-4 ${i < sheet.goals.length - 1 ? "border-b border-black/12" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-black truncate">{goal.title}</p>
                    {goal.isShared ? (
                      <span className="shrink-0 bg-black px-2 py-0.5 text-xs font-black uppercase tracking-wider text-white">
                        Shared
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-black/55">
                    {goal.thrustArea}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-black text-black">{goal.weightage}%</p>
                  <div className="mt-1.5 h-1.5 w-16 bg-[#F2F2F2]">
                    <div className="h-1.5 bg-black" style={{ width: `${goal.weightage}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t-2 border-black px-6 py-4">
            <p className="text-xs font-black uppercase tracking-wider text-black/60">Total Weightage</p>
            <p className={`text-sm font-black ${summary.totalWeightage === 100 ? "text-black" : "text-[#FF3000]"}`}>
              {summary.totalWeightage}%
            </p>
          </div>
        </Card>
      ) : (
        <Card className="py-14 text-center">
          <Target className="mx-auto h-8 w-8 text-black/20" />
          <p className="mt-4 text-sm font-black uppercase tracking-wider text-black/55">No Goals Yet</p>
          <p className="mt-1 text-sm text-black/45">
            {goalSettingOpen ? "The goal setting window is open." : "Goal setting is closed for this cycle."}
          </p>
          {goalSettingOpen ? (
            <Link href="/dashboard/employee/goals/new">
              <Button className="mt-6 gap-2" variant="secondary">
                <FileText className="h-4 w-4" />
                Create Goal Sheet
              </Button>
            </Link>
          ) : null}
        </Card>
      )}
    </div>
  );
}
