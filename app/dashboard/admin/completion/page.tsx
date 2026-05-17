import { CompletionWidget } from "@/components/dashboard/completion-widget";
import { requireRole } from "@/lib/auth/require-role";
import { getCompletionDashboardData } from "@/lib/services/live-data";

export default async function AdminCompletionPage() {
  await requireRole(["admin"]);
  const summary = await getCompletionDashboardData();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Completion Dashboard</h1>
        <p className="text-slate-500">Org-wide pending vs completed goal and check-in activity.</p>
      </div>
      <CompletionWidget summary={summary} />
    </div>
  );
}
