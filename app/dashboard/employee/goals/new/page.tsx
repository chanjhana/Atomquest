import { GoalSheetForm } from "@/components/goals/goal-sheet-form";
import { requireRole } from "@/lib/auth/require-role";
import { getGoalSheetForUserData } from "@/lib/services/live-data";

export default async function NewGoalSheetPage({ searchParams }: { searchParams?: { error?: string; success?: string } }) {
  const user = await requireRole(["employee"]);
  const sheet = await getGoalSheetForUserData(user.id);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Goal Creation / Edit Form</h1>
        <p className="text-slate-500">Validation rules: max 8 goals, minimum 10% per goal, total exactly 100%.</p>
      </div>
      <GoalSheetForm sheet={sheet ?? undefined} serverError={searchParams?.error} serverSuccess={searchParams?.success} />
    </div>
  );
}
