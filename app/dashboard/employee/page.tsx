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
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  Target,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  draft:            { label: "Draft",               color: "text-slate-600",  bg: "bg-slate-50",   border: "border-slate-200" },
  pending_approval: { label: "Pending Approval",    color: "text-amber-700",  bg: "bg-amber-50",   border: "border-amber-200" },
  approved_locked:  { label: "Approved & Locked",   color: "text-green-700",  bg: "bg-green-50",   border: "border-green-200" },
  returned:         { label: "Returned for Edits",  color: "text-red-700",    bg: "bg-red-50",     border: "border-red-200"   },
  none:             { label: "No Sheet Yet",         color: "text-slate-500",  bg: "bg-slate-50",   border: "border-slate-200" },
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">My Dashboard</h1>
          <p className="text-slate-400 text-sm">Welcome back, {user.name}</p>
        </div>
        <Link href="/dashboard/employee/goals/new">
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            {sheet ? "Open Goal Sheet" : "Create Goal Sheet"}
          </Button>
        </Link>
      </div>

      {/* Goal sheet status banner */}
      <div className={`rounded-2xl border p-5 ${status.bg} ${status.border}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {statusKey === "approved_locked" ? <CheckCircle2 className={`h-5 w-5 ${status.color}`} /> :
             statusKey === "returned"         ? <AlertCircle  className={`h-5 w-5 ${status.color}`} /> :
                                               <Clock        className={`h-5 w-5 ${status.color}`} />}
            <div>
              <p className={`text-sm font-semibold ${status.color}`}>{status.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {statusKey === "approved_locked" && "Your goals are locked and ready for quarterly check-ins."}
                {statusKey === "pending_approval" && "Waiting for your manager to review and approve."}
                {statusKey === "draft" && "Finish adding goals and submit when total weightage reaches 100%."}
                {statusKey === "returned" && sheet?.returnComment && `Manager comment: ${sheet.returnComment}`}
                {statusKey === "none" && goalSettingOpen ? "Goal setting window is open — create your goals now." : "No goal sheet for this cycle."}
              </p>
            </div>
          </div>
          <Link href="/dashboard/employee/goals/new">
            <Button variant="ghost" className="gap-1 text-xs">
              {statusKey === "approved_locked" ? "View" : "Edit"} <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-teal-50 p-2.5"><Target className="h-5 w-5 text-teal-600" /></div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Goals</p>
              <p className="text-2xl font-bold text-slate-900">{summary.goalCount}</p>
              <p className="text-xs text-slate-500">{summary.totalWeightage}% total weightage</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-2.5"><CalendarDays className="h-5 w-5 text-violet-600" /></div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Active Cycle</p>
              <p className="text-lg font-bold text-slate-900">{cycle.name}</p>
              <p className="text-xs text-slate-500">Goal setting {goalSettingOpen ? "open" : `closes ${formatDate(cycle.goalSettingEnd)}`}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-2.5 ${checkInOpen ? "bg-green-50" : "bg-slate-50"}`}>
              <ClipboardList className={`h-5 w-5 ${checkInOpen ? "text-green-600" : "text-slate-400"}`} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Check-in</p>
              <p className="text-lg font-bold text-slate-900">{quarter.toUpperCase()}</p>
              <p className="text-xs text-slate-500">{checkInOpen ? "Window is open" : `Opens ${formatDate(cycle[`${quarter}Start` as keyof typeof cycle] as string)}`}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Check-in CTA */}
      {checkInOpen && statusKey === "approved_locked" ? (
        <div className="flex items-center justify-between rounded-2xl border border-teal-200 bg-teal-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-5 w-5 text-teal-700" />
            <div>
              <p className="text-sm font-semibold text-teal-800">{quarter.toUpperCase()} check-in window is open</p>
              <p className="text-xs text-teal-600">Submit your actual achievements before the window closes.</p>
            </div>
          </div>
          <Link href="/dashboard/employee/check-ins">
            <Button className="gap-2 bg-teal-700 hover:bg-teal-800">
              Go to Check-in <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : null}

      {/* Goals list */}
      {sheet && sheet.goals.length > 0 ? (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Goal Sheet</h2>
            <span className="text-xs text-slate-400">{sheet.goals.length} goal{sheet.goals.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="space-y-2">
            {sheet.goals.map((goal) => (
              <div key={goal.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-800 truncate">{goal.title}</p>
                    {goal.isShared ? (
                      <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">Shared</span>
                    ) : null}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{goal.thrustArea}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-slate-700">{goal.weightage}%</p>
                  <div className="mt-1 h-1.5 w-16 rounded-full bg-slate-200">
                    <div className="h-1.5 rounded-full bg-teal-500" style={{ width: `${goal.weightage}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Total bar */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <p className="text-xs font-semibold text-slate-500">Total Weightage</p>
            <p className={`text-sm font-bold ${summary.totalWeightage === 100 ? "text-green-600" : "text-amber-600"}`}>
              {summary.totalWeightage}%
            </p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="py-10 text-center">
            <Target className="mx-auto h-10 w-10 text-slate-200" />
            <p className="mt-3 text-sm font-medium text-slate-500">No goals yet</p>
            <p className="text-xs text-slate-400">{goalSettingOpen ? "The goal setting window is open." : "Goal setting is closed for this cycle."}</p>
            {goalSettingOpen ? (
              <Link href="/dashboard/employee/goals/new">
                <Button className="mt-4 gap-2" variant="secondary"><FileText className="h-4 w-4" />Create Goal Sheet</Button>
              </Link>
            ) : null}
          </div>
        </Card>
      )}
    </div>
  );
}
