import { CycleForm } from "@/components/admin/cycle-form";
import { requireRole } from "@/lib/auth/require-role";
import { getActiveCycleData } from "@/lib/services/live-data";

export default async function AdminCyclesPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  await requireRole(["admin"]);
  const cycle = await getActiveCycleData();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Cycle Management</h1>
        <p className="text-slate-500">Configure and activate workflow windows.</p>
      </div>
      {searchParams?.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {searchParams.error}
        </p>
      ) : null}
      <CycleForm cycle={cycle} />
    </div>
  );
}
