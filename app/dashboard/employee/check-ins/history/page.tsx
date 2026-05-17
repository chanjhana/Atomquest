import { CheckInHistoryCard } from "@/components/check-ins/check-in-history-card";
import { requireRole } from "@/lib/auth/require-role";
import { getHistoryRowsData } from "@/lib/services/live-data";

export default async function CheckInHistoryPage() {
  const user = await requireRole(["employee"]);
  const rows = await getHistoryRowsData(user.id);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Check-in History</h1>
        <p className="text-slate-500">Previous quarterly submissions and manager comments.</p>
      </div>
      <div className="space-y-3">
        {rows.map((row) => <CheckInHistoryCard key={row.id} item={row} />)}
      </div>
    </div>
  );
}
