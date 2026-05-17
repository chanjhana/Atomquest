import { Card } from "@/components/ui/card";

export function CompletionWidget({
  summary
}: {
  summary: {
    total: number;
    approved: number;
    pending: number;
    checkInSubmitted: number;
    managerReviewed: number;
    checkInRate: number;
    managerReviewRate: number;
  };
}) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-950">Completion Dashboard</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <Metric label="Total Sheets" value={summary.total} />
        <Metric label="Approved" value={summary.approved} />
        <Metric label="Check-ins" value={`${summary.checkInRate}%`} />
        <Metric label="Manager Reviews" value={`${summary.managerReviewRate}%`} />
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
