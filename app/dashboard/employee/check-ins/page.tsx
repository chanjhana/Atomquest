import { saveCheckIn, submitCheckIn } from "@/app/actions/check-ins";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckInEntryRow } from "@/components/check-ins/check-in-entry-row";
import { FlashToast } from "@/components/layout/flash-toast";
import { requireRole } from "@/lib/auth/require-role";
import { getActiveCycleData, getCheckInsForUserData, getGoalSheetForUserData } from "@/lib/services/live-data";
import { activeQuarter, isQuarterOpen } from "@/lib/services/windows";
import { ClipboardCheck, Save, Send } from "lucide-react";

export default async function EmployeeCheckInsPage({
  searchParams
}: {
  searchParams?: { success?: string };
}) {
  const user = await requireRole(["employee"]);
  const cycle = await getActiveCycleData();
  const quarter = activeQuarter(cycle);
  const sheet = await getGoalSheetForUserData(user.id);
  const checkIns = await getCheckInsForUserData(user.id, quarter);
  const open = isQuarterOpen(cycle, quarter);

  return (
    <div className="space-y-6">
      <FlashToast success={searchParams?.success} />
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-6 w-6 text-teal-600" />
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Quarterly Check-in</h1>
          <p className="text-slate-500">{quarter.toUpperCase()} achievement capture is {open ? "open" : "closed"}.</p>
        </div>
      </div>
      {!open ? (
        <Card className="border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          The check-in window is currently closed. Edits are disabled.
        </Card>
      ) : null}
      {!sheet || sheet.goals.length === 0 ? (
        <Card>
          <p className="py-8 text-center text-sm text-slate-400">
            No approved goal sheet found. Goals must be approved before check-ins can be submitted.
          </p>
        </Card>
      ) : (
        <form className="space-y-4">
          <input type="hidden" name="quarter" value={quarter} />
          {sheet.goals.map((goal, index) => (
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
              <Button formAction={saveCheckIn} type="submit" variant="secondary" className="gap-2">
                <Save className="h-4 w-4" />Save Progress
              </Button>
              <Button formAction={submitCheckIn} type="submit" className="gap-2">
                <Send className="h-4 w-4" />Submit {quarter.toUpperCase()} Check-in
              </Button>
            </div>
          ) : null}
        </form>
      )}
    </div>
  );
}
