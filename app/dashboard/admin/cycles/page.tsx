import { CycleForm } from "@/components/admin/cycle-form";
import { requireRole } from "@/lib/auth/require-role";
import { getActiveCycleData } from "@/lib/services/live-data";

export default async function AdminCyclesPage() {
  await requireRole(["admin"]);
  const cycle = await getActiveCycleData();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Cycle Management</h1>
        <p className="text-slate-500">Configure and activate workflow windows.</p>
      </div>
      <CycleForm cycle={cycle} />
    </div>
  );
}
