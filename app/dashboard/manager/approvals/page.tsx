import { PendingApprovalList } from "@/components/manager/pending-approval-list";
import { FlashToast } from "@/components/layout/flash-toast";
import { requireRole } from "@/lib/auth/require-role";
import { getPendingApprovalsData } from "@/lib/services/live-data";

export default async function PendingApprovalsPage({ searchParams }: { searchParams?: { success?: string } }) {
  const user = await requireRole(["manager"]);
  const approvals = await getPendingApprovalsData(user.id);
  return (
    <div className="space-y-6">
      <FlashToast success={searchParams?.success} />
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Pending Approvals</h1>
        <p className="text-slate-500">Review submitted goal sheets from direct reports only.</p>
      </div>
      <PendingApprovalList items={approvals} />
    </div>
  );
}
