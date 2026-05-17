import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusCard } from "@/components/dashboard/status-card";
import { requireRole } from "@/lib/auth/require-role";
import { getActiveCycleData, getGoalSheetForUserData, summarizeSheet } from "@/lib/services/live-data";
import { isGoalSettingOpen } from "@/lib/services/windows";

export default async function EmployeeDashboardPage({ searchParams }: { searchParams?: { success?: string } }) {
  const user = await requireRole(["employee"]);
  const sheet = await getGoalSheetForUserData(user.id);
  const summary = summarizeSheet(sheet);
  const cycle = await getActiveCycleData();
  return (
    <div className="space-y-6">
      {searchParams?.success ? (
        <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{searchParams.success}</p>
      ) : null}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">My Dashboard</h1>
          <p className="text-slate-500">Create goals, track approval status, and submit quarterly achievements.</p>
        </div>
        <Link href="/dashboard/employee/goals/new">
          <Button>{sheet ? "Open Goal Sheet" : "Create Goal Sheet"}</Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard label="Sheet Status" value={summary.status.replaceAll("_", " ")} />
        <StatusCard label="Goals" value={summary.goalCount} hint={`${summary.totalWeightage}% total weightage`} />
        <StatusCard label="Active Cycle" value={cycle.name} hint={isGoalSettingOpen(cycle) ? "Goal setting window open" : "Goal setting closed"} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Current Goal Sheet</CardTitle>
          <Badge tone={summary.status === "approved_locked" ? "green" : "amber"}>{summary.status.replaceAll("_", " ")}</Badge>
        </CardHeader>
        {sheet ? (
          <div className="space-y-2">
            {sheet.goals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span className="font-medium text-slate-800">{goal.title}</span>
                <span className="text-sm text-slate-500">{goal.weightage}%</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No goal sheet yet. Create your goals while the window is open.</p>
        )}
      </Card>
    </div>
  );
}
