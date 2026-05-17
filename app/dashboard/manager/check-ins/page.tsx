import { TeamCheckInTable } from "@/components/manager/team-check-in-table";
import { requireRole } from "@/lib/auth/require-role";
import { getTeamCheckInRowsData } from "@/lib/services/live-data";

export default async function ManagerCheckInsPage() {
  const user = await requireRole(["manager"]);
  const rows = await getTeamCheckInRowsData(user.id);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Team Check-ins</h1>
        <p className="text-slate-500">Review planned vs actual achievements and complete manager comments.</p>
      </div>
      <TeamCheckInTable rows={rows} />
    </div>
  );
}
