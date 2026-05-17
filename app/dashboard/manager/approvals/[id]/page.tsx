import { ApprovalInlineEditor } from "@/components/manager/approval-inline-editor";
import { requireRole } from "@/lib/auth/require-role";
import { getGoalSheetByIdData, getUserByIdData } from "@/lib/services/live-data";

export default async function ApprovalDetailPage({ params }: { params: { id: string } }) {
  await requireRole(["manager"]);
  const sheet = await getGoalSheetByIdData(params.id);
  if (!sheet) return <p>Goal sheet not found.</p>;
  const owner = await getUserByIdData(sheet.userId);
  return <ApprovalInlineEditor sheet={sheet} ownerName={owner?.name ?? "Employee"} />;
}
