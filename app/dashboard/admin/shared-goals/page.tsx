import { SharedGoalForm } from "@/components/shared-goals/shared-goal-form";
import { SharedGoalList } from "@/components/shared-goals/shared-goal-list";
import { requireRole } from "@/lib/auth/require-role";
import { getAllAssignableUsersData, getSharedGoalsData } from "@/lib/services/live-data";

export default async function AdminSharedGoalsPage() {
  await requireRole(["admin"]);
  const [items, members] = await Promise.all([
    getSharedGoalsData(),
    getAllAssignableUsersData()
  ]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Shared Goals</h1>
        <p className="text-slate-500">Admin can push cross-team KPIs and verify recipient links.</p>
      </div>
      <SharedGoalForm members={members} />
      <SharedGoalList items={items} />
    </div>
  );
}
