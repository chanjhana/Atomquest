import { saveCheckIn, submitCheckIn } from "@/app/actions/check-ins";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckInEntryRow } from "@/components/check-ins/check-in-entry-row";
import { requireRole } from "@/lib/auth/require-role";
import { getActiveCycleData, getCheckInsForUserData, getGoalSheetForUserData } from "@/lib/services/live-data";
import { activeQuarter, isQuarterOpen } from "@/lib/services/windows";

export default async function EmployeeCheckInsPage() {
  const user = await requireRole(["employee"]);
  const cycle = await getActiveCycleData();
  const quarter = activeQuarter(cycle);
  const sheet = await getGoalSheetForUserData(user.id);
  const checkIns = await getCheckInsForUserData(user.id, quarter);
  const open = isQuarterOpen(cycle, quarter);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Quarterly Check-in</h1>
        <p className="text-slate-500">{quarter.toUpperCase()} achievement capture is {open ? "open" : "closed"}.</p>
      </div>
      {!open ? <Card className="border-amber-200 bg-amber-50 text-amber-900">The check-in window is closed. Edits are disabled.</Card> : null}
      <form className="space-y-4">
        <input type="hidden" name="quarter" value={quarter} />
        {sheet?.goals.map((goal, index) => (
          <CheckInEntryRow
            key={goal.id}
            goal={goal}
            checkIn={checkIns.find((item) => item.goalId === goal.id)}
            readOnly={!open}
            index={index}
          />
        ))}
        {open ? (
          <div className="flex gap-2">
            <Button formAction={saveCheckIn} type="submit" variant="secondary">Save Progress</Button>
            <Button formAction={submitCheckIn} type="submit">Submit {quarter.toUpperCase()} Check-in</Button>
          </div>
        ) : null}
      </form>
    </div>
  );
}
