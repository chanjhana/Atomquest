import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { GoalSheet } from "@/lib/domain/types";

export function PendingApprovalList({ items }: { items: Array<{ ownerName: string; sheet: GoalSheet }> }) {
  if (items.length === 0) return <Card>No pending approvals. The queue is clear.</Card>;
  return (
    <div className="space-y-3">
      {items.map(({ ownerName, sheet }) => {
        const total = sheet.goals.reduce((sum, goal) => sum + goal.weightage, 0);
        return (
          <Card key={sheet.id} className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-950">{ownerName}</h3>
                <Badge tone="amber">Pending Approval</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">{sheet.goals.length} goals · {total}% total weightage · Submitted {sheet.submittedAt}</p>
            </div>
            <Link href={`/dashboard/manager/approvals/${sheet.id}`}>
              <Button>Review</Button>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
