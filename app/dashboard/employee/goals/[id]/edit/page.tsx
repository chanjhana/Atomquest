import { GoalSheetForm } from "@/components/goals/goal-sheet-form";
import { requireRole } from "@/lib/auth/require-role";
import { getGoalSheetByIdData } from "@/lib/services/live-data";

export default async function EditGoalSheetPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams?: { error?: string; success?: string };
}) {
  await requireRole(["employee"]);
  const sheet = await getGoalSheetByIdData(params.id);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Edit Goal Sheet</h1>
        <p className="text-slate-500">Returned or draft sheets are editable. Shared KPI metadata remains locked.</p>
      </div>
      <GoalSheetForm sheet={sheet ?? undefined} serverError={searchParams?.error} serverSuccess={searchParams?.success} />
    </div>
  );
}
