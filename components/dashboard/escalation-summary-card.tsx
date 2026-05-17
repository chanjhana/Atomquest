import Link from "next/link";
import { Card } from "@/components/ui/card";

export function EscalationSummaryCard({ open }: { open: number }) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wide text-red-600">Escalations</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{open}</p>
      <Link className="mt-2 block text-sm font-semibold text-teal-700" href="/dashboard/admin/escalations">View escalation log</Link>
    </Card>
  );
}
