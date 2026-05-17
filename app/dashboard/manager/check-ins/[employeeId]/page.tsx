import { completeManagerCheckIn } from "@/app/actions/check-ins";
import { CheckInEntryRow } from "@/components/check-ins/check-in-entry-row";
import { ManagerCommentModal } from "@/components/check-ins/manager-comment-modal";
import { requireRole } from "@/lib/auth/require-role";
import { getCheckInsForUserData, getGoalSheetForUserData, getUserByIdData } from "@/lib/services/live-data";

export default async function ManagerCheckInDetailPage({ params }: { params: { employeeId: string } }) {
  await requireRole(["manager"]);
  const employee = await getUserByIdData(params.employeeId);
  const sheet = await getGoalSheetForUserData(params.employeeId);
  const checkIns = await getCheckInsForUserData(params.employeeId, "q1");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Review {employee?.name}&apos;s Check-in</h1>
        <p className="text-slate-500">Goal-level progress is read-only for manager review.</p>
      </div>
      <form action={completeManagerCheckIn} className="space-y-4">
        <input type="hidden" name="employeeId" value={params.employeeId} />
        <input type="hidden" name="quarter" value="q1" />
        {sheet?.goals.map((goal, index) => (
          <CheckInEntryRow key={goal.id} goal={goal} checkIn={checkIns.find((item) => item.goalId === goal.id)} readOnly index={index} />
        ))}
        <ManagerCommentModal />
      </form>
    </div>
  );
}
