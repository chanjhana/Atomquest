"use client";

import { useRef, useState } from "react";
import { saveGoalSheetDraft, submitGoalSheet, withdrawGoalSheet } from "@/app/actions/goal-sheets";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { Goal, GoalSheet } from "@/lib/domain/types";
import { WeightageBar } from "./weightage-bar";
import { GoalRow } from "./goal-row";

type RowEntry = {
  key: string;
  goal: Goal;
};

function blankGoal(sortOrder: number): Goal {
  return {
    id: "",
    goalSheetId: "",
    title: "",
    description: "",
    thrustArea: "",
    uomType: "numeric",
    scoreDirection: "higher_is_better",
    target: "",
    weightage: 10,
    sortOrder,
    status: "not_started",
    isShared: false
  };
}

function validateForSubmit(rows: RowEntry[], weightages: Record<string, number>): string | null {
  if (rows.length === 0) return "At least one goal is required before submitting.";

  const total = Object.values(weightages).reduce((sum, w) => sum + w, 0);
  if (total !== 100) return `Total weightage must equal exactly 100%. Currently at ${total}%.`;

  for (let i = 0; i < rows.length; i++) {
    const w = weightages[rows[i].key] ?? 0;
    if (w < 10) return `Goal ${i + 1} has less than the minimum 10% weightage.`;
  }

  return null;
}

export function GoalSheetForm({ sheet, serverError, serverSuccess }: { sheet?: GoalSheet; serverError?: string; serverSuccess?: string }) {
  const status = sheet?.status ?? "draft";
  const isEditable = status === "draft" || status === "returned";
  const isPending = status === "pending_approval";
  const isLocked = status === "approved_locked";

  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(serverError ?? null);
  const [success] = useState<string | null>(serverSuccess ?? null);

  const [rows, setRows] = useState<RowEntry[]>(() =>
    (sheet?.goals ?? []).map((g) => ({ key: g.id || `init-${g.sortOrder}`, goal: g }))
  );

  const [weightages, setWeightages] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    (sheet?.goals ?? []).forEach((g) => {
      map[g.id || `init-${g.sortOrder}`] = g.weightage;
    });
    return map;
  });

  const total = Object.values(weightages).reduce((sum, w) => sum + w, 0);

  function addGoal() {
    if (rows.length >= 8) return;
    const key = `new-${Date.now()}`;
    const goal = blankGoal(rows.length + 1);
    setRows((prev) => [...prev, { key, goal }]);
    setWeightages((prev) => ({ ...prev, [key]: 10 }));
  }

  function removeGoal(key: string) {
    setRows((prev) => prev.filter((r) => r.key !== key));
    setWeightages((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setError(null);
  }

  function handleWeightageChange(key: string, val: number) {
    setWeightages((prev) => ({ ...prev, [key]: isNaN(val) ? 0 : val }));
    setError(null);
  }

  function handleSubmitClick(e: React.MouseEvent<HTMLButtonElement>) {
    const validationError = validateForSubmit(rows, weightages);
    if (validationError) {
      e.preventDefault();
      setError(validationError);
    } else {
      setError(null);
    }
  }

  return (
    <form ref={formRef} className="space-y-5">
      {sheet ? <input type="hidden" name="sheetId" value={sheet.id} /> : null}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>{sheet ? "Edit Goal Sheet" : "Create Goal Sheet"}</CardTitle>
            {sheet?.returnComment ? (
              <p className="mt-1 text-sm text-amber-700">Manager comment: {sheet.returnComment}</p>
            ) : null}
            {isLocked ? (
              <p className="mt-1 text-sm text-slate-500">
                Approved sheets are locked. Contact Admin to request an unlock.
              </p>
            ) : null}
          </div>
          <div className="flex gap-2">
            {isEditable ? (
              <Button formAction={saveGoalSheetDraft} type="submit" variant="secondary">
                Save Draft
              </Button>
            ) : null}
            {isEditable ? (
              <Button formAction={submitGoalSheet} type="submit" onClick={handleSubmitClick}>
                Submit for Approval
              </Button>
            ) : null}
            {isPending ? (
              <Button formAction={withdrawGoalSheet} type="submit" variant="secondary">
                Withdraw Submission
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <WeightageBar total={total} />
        {success ? (
          <p className="mt-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>
        ) : null}
        {error ? (
          <p className="mt-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}
      </Card>

      {rows.map((entry, i) => (
        <GoalRow
          key={entry.key}
          goal={{ ...entry.goal, sortOrder: i + 1, weightage: weightages[entry.key] ?? entry.goal.weightage }}
          editable={isEditable}
          index={i}
          onWeightageChange={isEditable ? (val) => handleWeightageChange(entry.key, val) : undefined}
          onRemove={isEditable && !entry.goal.isShared ? () => removeGoal(entry.key) : undefined}
        />
      ))}

      {rows.length === 0 && isEditable ? (
        <Card>
          <p className="py-6 text-center text-sm text-slate-400">
            No goals added yet. Click &quot;Add Goal&quot; to get started.
          </p>
        </Card>
      ) : null}

      {isEditable ? (
        <div className="flex items-center gap-3">
          <Button type="button" variant="secondary" onClick={addGoal} disabled={rows.length >= 8}>
            + Add Goal
          </Button>
          <span className="text-sm text-slate-500">
            {rows.length} / 8 goals
            {rows.length >= 8 ? " · Maximum reached" : ""}
          </span>
        </div>
      ) : null}
    </form>
  );
}
