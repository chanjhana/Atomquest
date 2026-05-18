import { resolveEscalation } from "@/app/actions/escalations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Escalation } from "@/lib/domain/types";
import { escalationLevelLabel } from "@/lib/services/escalations";
import { formatRelative } from "@/lib/utils";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const ruleLabels: Record<string, string> = {
  goal_submission_overdue: "Goal not submitted",
  manager_approval_overdue: "Approval overdue",
  check_in_overdue: "Check-in overdue",
};

export function EscalationTable({ items }: { items: Escalation[] }) {
  if (items.length === 0) {
    return (
      <Card>
        <p className="py-12 text-center text-sm text-slate-400">No escalations at this time.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              {["Employee", "Rule", "Level", "Days Pending", "Triggered", "Status", "Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{item.employeeName}</p>
                  <p className="text-xs text-slate-400">Manager: {item.managerName}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-slate-700">{ruleLabels[item.ruleType] ?? item.ruleType.replaceAll("_", " ")}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{escalationLevelLabel(item.escalationLevel)}</td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${item.daysPending > 10 ? "text-red-600" : "text-amber-600"}`}>
                    {item.daysPending}d
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">{formatRelative(item.triggeredAt)}</td>
                <td className="px-4 py-3">
                  <Badge tone={item.status === "open" ? "red" : item.status === "acknowledged" ? "amber" : "green"}>
                    {item.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {item.status !== "resolved" ? (
                    <form action={resolveEscalation}>
                      <input type="hidden" name="escalationId" value={item.id} />
                      <Button variant="secondary" type="submit" className="gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Resolve
                      </Button>
                    </form>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
