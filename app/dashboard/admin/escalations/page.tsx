import { EscalationTable } from "@/components/admin/escalation-table";
import { requireRole } from "@/lib/auth/require-role";
import { getEscalationsData } from "@/lib/services/live-data";

export default async function AdminEscalationsPage() {
  await requireRole(["admin"]);
  const items = await getEscalationsData();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Escalations</h1>
        <p className="text-slate-500">Rule-based chain: employee → manager → skip-level / HR.</p>
      </div>
      <EscalationTable items={items} />
    </div>
  );
}
