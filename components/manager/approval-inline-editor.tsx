import { approveGoalSheet, returnGoalSheet } from "@/app/actions/goal-sheets";
import { GoalRow } from "@/components/goals/goal-row";
import { WeightageBar } from "@/components/goals/weightage-bar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { GoalSheet } from "@/lib/domain/types";

export function ApprovalInlineEditor({ sheet, ownerName }: { sheet: GoalSheet; ownerName: string }) {
  const total = sheet.goals.reduce((sum, goal) => sum + goal.weightage, 0);
  return (
    <form className="space-y-5">
      <input type="hidden" name="sheetId" value={sheet.id} />
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Review {ownerName}&apos;s Goal Sheet</CardTitle>
            <p className="mt-1 text-sm text-slate-500">Manager can edit target or weightage before approval. Shared goal targets remain locked.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" formAction={returnGoalSheet} type="submit">Return for Rework</Button>
            <Button formAction={approveGoalSheet} type="submit">Approve Goal Sheet</Button>
          </div>
        </CardHeader>
        <WeightageBar total={total} />
      </Card>
      <Card className="space-y-2">
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">Return comment</span>
          <Textarea name="returnComment" placeholder="Please explain the required rework before returning the sheet." />
        </label>
      </Card>
      {sheet.goals.map((goal, index) => <GoalRow key={goal.id} goal={goal} managerEdit index={index} />)}
    </form>
  );
}
