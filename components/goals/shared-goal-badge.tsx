import { Badge } from "@/components/ui/badge";

export function SharedGoalBadge({ assignedBy }: { assignedBy?: string | null }) {
  return (
    <span title={`This shared KPI was assigned by ${assignedBy ?? "a manager/admin"}. Title and target are locked.`}>
      <Badge tone="teal">Shared KPI</Badge>
    </span>
  );
}
