"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Goal } from "@/lib/domain/types";
import { SharedGoalBadge } from "./shared-goal-badge";

function HiddenField({ name, value }: { name: string; value: string | number | boolean | null | undefined }) {
  return <input type="hidden" name={name} value={value == null ? "" : String(value)} />;
}

export function GoalRow({
  goal,
  editable = false,
  managerEdit = false,
  index = 0,
  onWeightageChange,
  onRemove
}: {
  goal: Goal;
  editable?: boolean;
  managerEdit?: boolean;
  index?: number;
  onWeightageChange?: (val: number) => void;
  onRemove?: () => void;
}) {
  const canEditMetadata = editable && !goal.isShared;
  const canEditTarget = managerEdit && !goal.isShared;
  const canEditWeightage = editable || managerEdit;
  const prefix = `goals.${index}`;

  return (
    <Card className="space-y-4 p-4">
      <HiddenField name={`${prefix}.id`} value={goal.id} />
      <HiddenField name={`${prefix}.sortOrder`} value={goal.sortOrder} />
      <HiddenField name={`${prefix}.isShared`} value={goal.isShared} />
      <HiddenField name={`${prefix}.sharedGoalGroupId`} value={goal.sharedGoalGroupId} />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-950">Goal {goal.sortOrder}</h3>
          {goal.isShared ? <SharedGoalBadge assignedBy={goal.assignedBy} /> : null}
        </div>
        <div className="flex items-center gap-2">
          {goal.id ? (
            <Badge tone={goal.status === "completed" ? "green" : "blue"}>{goal.status.replaceAll("_", " ")}</Badge>
          ) : null}
          {onRemove ? (
            <Button type="button" variant="secondary" onClick={onRemove}>
              Remove
            </Button>
          ) : null}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">Title</span>
          {canEditMetadata ? (
            <Input defaultValue={goal.title} name={`${prefix}.title`} placeholder="Goal title" required />
          ) : (
            <>
              <HiddenField name={`${prefix}.title`} value={goal.title} />
              <p className="rounded-xl bg-slate-50 p-3 text-sm">{goal.title || "—"}</p>
            </>
          )}
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">Thrust Area</span>
          {canEditMetadata ? (
            <Input defaultValue={goal.thrustArea} name={`${prefix}.thrustArea`} placeholder="Thrust area" required />
          ) : (
            <>
              <HiddenField name={`${prefix}.thrustArea`} value={goal.thrustArea} />
              <p className="rounded-xl bg-slate-50 p-3 text-sm">{goal.thrustArea || "—"}</p>
            </>
          )}
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-xs font-semibold text-slate-500">Description</span>
          {canEditMetadata ? (
            <Textarea defaultValue={goal.description} name={`${prefix}.description`} placeholder="Describe the goal and expected outcome." />
          ) : (
            <>
              <HiddenField name={`${prefix}.description`} value={goal.description} />
              <p className="rounded-xl bg-slate-50 p-3 text-sm">{goal.description || "—"}</p>
            </>
          )}
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">UoM</span>
          {canEditMetadata ? (
            <Select defaultValue={goal.uomType} name={`${prefix}.uomType`}>
              <option value="numeric">Numeric</option>
              <option value="percentage">Percentage</option>
              <option value="timeline">Timeline</option>
              <option value="zero">Zero-based</option>
            </Select>
          ) : (
            <>
              <HiddenField name={`${prefix}.uomType`} value={goal.uomType} />
              <p className="rounded-xl bg-slate-50 p-3 text-sm">{goal.uomType}</p>
            </>
          )}
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">Score Direction</span>
          {canEditMetadata ? (
            <Select defaultValue={goal.scoreDirection ?? "higher_is_better"} name={`${prefix}.scoreDirection`}>
              <option value="higher_is_better">Higher is better</option>
              <option value="lower_is_better">Lower is better</option>
            </Select>
          ) : (
            <>
              <HiddenField name={`${prefix}.scoreDirection`} value={goal.scoreDirection} />
              <p className="rounded-xl bg-slate-50 p-3 text-sm">{goal.scoreDirection?.replaceAll("_", " ") ?? "Not applicable"}</p>
            </>
          )}
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">Target</span>
          {canEditTarget ? (
            <Input defaultValue={goal.target} name={`${prefix}.target`} placeholder="e.g. 100" />
          ) : canEditMetadata ? (
            <Input defaultValue={goal.target} name={`${prefix}.target`} placeholder="e.g. 100" required />
          ) : (
            <>
              <HiddenField name={`${prefix}.target`} value={goal.target} />
              <p className="rounded-xl bg-slate-50 p-3 text-sm">{goal.target || "—"}</p>
            </>
          )}
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">Weightage (%)</span>
          {canEditWeightage ? (
            onWeightageChange ? (
              <Input
                value={goal.weightage}
                onChange={(e) => onWeightageChange(Number(e.target.value) || 0)}
                name={`${prefix}.weightage`}
                type="number"
                min={10}
                max={100}
              />
            ) : (
              <Input
                defaultValue={goal.weightage}
                name={`${prefix}.weightage`}
                type="number"
                min={10}
              />
            )
          ) : (
            <>
              <HiddenField name={`${prefix}.weightage`} value={goal.weightage} />
              <p className="rounded-xl bg-slate-50 p-3 text-sm">{goal.weightage}%</p>
            </>
          )}
        </label>
      </div>
    </Card>
  );
}
