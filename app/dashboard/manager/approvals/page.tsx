import { PendingApprovalList } from "@/components/manager/pending-approval-list";
import { requireRole } from "@/lib/auth/require-role";
import { getPendingApprovalsData } from "@/lib/services/live-data";

export default async function PendingApprovalsPage({ searchParams }: { searchParams?: { success?: string } }) {
  const user = await requireRole(["manager"]);
  const approvals = await getPendingApprovalsData(user.id);
  return (
    <div className="space-y-6">
      {searchParams?.success ? (
        <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{searchParams.success}</p>
      ) : null}
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Pending Approvals</h1>
        <p className="text-slate-500">Review submitted goal sheets from direct reports only.</p>
      </div>
      <PendingApprovalList items={approvals} />
    </div>
  );
}
