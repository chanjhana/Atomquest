"use client";

import { useState } from "react";
import { SharedGoalBadge } from "@/components/goals/shared-goal-badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CheckIn, Goal } from "@/lib/domain/types";
import { computeProgressScore } from "@/lib/services/score-engine";
import { ProgressScoreDisplay } from "./progress-score-display";

export function CheckInEntryRow({
  goal,
  checkIn,
  readOnly = false,
  index = 0
}: {
  goal: Goal;
  checkIn?: CheckIn;
  readOnly?: boolean;
  index?: number;
}) {
  const sharedReadOnly = goal.isShared && !goal.isSharedPrimaryOwner;
  const initialValue = checkIn?.actualValue ?? "";
  const [actualValue, setActualValue] = useState(initialValue);

  const score = checkIn?.computedScore != null && readOnly
    ? checkIn.computedScore
    : computeProgressScore({
        uomType: goal.uomType,
        target: goal.target,
        actualValue: actualValue || "0",
        scoreDirection: goal.scoreDirection
      });

  return (
    <Card className="space-y-4">
      <input type="hidden" name={`entries.${index}.goalId`} value={goal.id} />
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-950">{goal.title}</h3>
            {goal.isShared ? <SharedGoalBadge assignedBy={goal.assignedBy} /> : null}
          </div>
          <p className="mt-1 text-sm text-slate-500">Target: {goal.target} · Weightage: {goal.weightage}%</p>
        </div>
        <ProgressScoreDisplay score={score} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">Actual achievement</span>
          {readOnly || sharedReadOnly ? (
            <input type="hidden" name={`entries.${index}.actualValue`} value={actualValue} />
          ) : null}
          <Input
            value={actualValue}
            onChange={readOnly || sharedReadOnly ? undefined : (e) => setActualValue(e.target.value)}
            disabled={readOnly || sharedReadOnly}
            name={`entries.${index}.actualValue`}
            placeholder="Enter actual"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">Status</span>
          <Select
            defaultValue={checkIn?.status === "manager_reviewed" ? "completed" : checkIn?.status ?? "on_track"}
            disabled={readOnly}
            name={`entries.${index}.status`}
          >
            <option value="not_started">Not Started</option>
            <option value="on_track">On Track</option>
            <option value="completed">Completed</option>
          </Select>
        </label>
        <label className="space-y-1 md:col-span-3">
          <span className="text-xs font-semibold text-slate-500">Employee comment</span>
          <Textarea defaultValue={checkIn?.employeeComment ?? ""} disabled={readOnly} name={`entries.${index}.employeeComment`} />
        </label>
      </div>
      {sharedReadOnly ? <p className="text-xs text-slate-500">Achievement synced from primary owner.</p> : null}
    </Card>
  );
}
