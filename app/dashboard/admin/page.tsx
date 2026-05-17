import { unlockGoalSheet } from "@/app/actions/admin";
import { CompletionWidget } from "@/components/dashboard/completion-widget";
import { EscalationSummaryCard } from "@/components/dashboard/escalation-summary-card";
import { StatusCard } from "@/components/dashboard/status-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { requireRole } from "@/lib/auth/require-role";
import { getCompletionDashboardData, getEscalationsData, getLockedGoalSheetsData, getTeamMembersData } from "@/lib/services/live-data";

export default async function AdminDashboardPage() {
  await requireRole(["admin"]);
  const employees = await getTeamMembersData("manager-1");
  const escalations = await getEscalationsData();
  const openEscalations = escalations.filter((item) => item.status === "open").length;
  const summary = await getCompletionDashboardData();
  const lockedSheets = await getLockedGoalSheetsData();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Admin Home</h1>
        <p className="text-slate-500">Cycle governance, hierarchy, audit trail, escalations, reports, and analytics.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatusCard label="Employees" value={employees.length} />
        <StatusCard label="Submitted" value={2} />
        <StatusCard label="Approvals" value={1} />
        <StatusCard label="Escalations" value={openEscalations} />
      </div>
      <CompletionWidget summary={summary} />
      <EscalationSummaryCard open={openEscalations} />
      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Unlock Goal Sheet</h2>
          <p className="text-sm text-slate-500">Admin-only exception flow with a mandatory audit reason.</p>
        </div>
        {lockedSheets.length === 0 ? (
          <p className="text-sm text-slate-500">No locked goal sheets available right now.</p>
        ) : (
          lockedSheets.map((sheet) => (
            <form key={sheet.id} className="space-y-2 rounded-xl border border-slate-200 p-4">
              <input type="hidden" name="sheetId" value={sheet.id} />
              <p className="font-medium text-slate-900">{sheet.user.name}</p>
              <p className="text-sm text-slate-500">Approved on {sheet.approvedAt?.toISOString().slice(0, 10) ?? "n/a"}</p>
              <Textarea name="reason" placeholder="Reason for unlock" />
              <Button formAction={unlockGoalSheet} type="submit" variant="secondary">Unlock Goal Sheet</Button>
            </form>
          ))
        )}
      </Card>
    </div>
  );
}
