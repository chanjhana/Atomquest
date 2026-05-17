import { SharedGoalForm } from "@/components/shared-goals/shared-goal-form";
import { SharedGoalList } from "@/components/shared-goals/shared-goal-list";
import { requireRole } from "@/lib/auth/require-role";
import { getSharedGoalsData, getTeamMembersData } from "@/lib/services/live-data";

export default async function ManagerSharedGoalsPage() {
  const user = await requireRole(["manager"]);
  const [items, members] = await Promise.all([
    getSharedGoalsData(),
    getTeamMembersData(user.id)
  ]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Shared Goals</h1>
        <p className="text-slate-500">Create and assign departmental KPIs to direct reports.</p>
      </div>
      <SharedGoalForm members={members} />
      <SharedGoalList items={items} />
    </div>
  );
}
