import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { SharedGoalGroup } from "@/lib/domain/types";

export function SharedGoalList({
  items
}: {
  items: Array<{ group: SharedGoalGroup; primaryOwnerName: string }>;
}) {
  return (
    <div className="space-y-3">
      {items.map(({ group: goal, primaryOwnerName }) => {
        return (
          <Card key={goal.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-950">{goal.title}</h3>
                  <Badge tone="teal">Shared KPI</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">Target: {goal.target} · Primary owner: {primaryOwnerName}</p>
                <p className="mt-2 text-sm text-slate-600">{goal.description}</p>
              </div>
              <Badge tone="blue">Assigned to {goal.recipientUserIds.length}</Badge>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
