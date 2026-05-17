import { CompletionWidget } from "@/components/dashboard/completion-widget";
import { StatusCard } from "@/components/dashboard/status-card";
import { PendingApprovalList } from "@/components/manager/pending-approval-list";
import { requireRole } from "@/lib/auth/require-role";
import { getCompletionDashboardData, getEscalationsData, getPendingApprovalsData, getTeamMembersData } from "@/lib/services/live-data";

export default async function ManagerDashboardPage() {
  const user = await requireRole(["manager"]);
  const team = await getTeamMembersData(user.id);
  const approvals = await getPendingApprovalsData(user.id);
  const escalations = (await getEscalationsData()).filter((item) => item.managerName === user.name && item.status === "open");
  const summary = await getCompletionDashboardData(user.id);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Team Overview</h1>
        <p className="text-slate-500">Approval queue, team completion, shared KPIs, and check-in readiness.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard label="Team Members" value={team.length} />
        <StatusCard label="Pending Approvals" value={approvals.length} />
        <StatusCard label="Open Escalations" value={escalations.length} />
      </div>
      <CompletionWidget summary={summary} />
      <PendingApprovalList items={approvals} />
    </div>
  );
}
