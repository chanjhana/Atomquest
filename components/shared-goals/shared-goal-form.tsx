import { pushSharedGoal } from "@/app/actions/shared-goals";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@/lib/domain/types";

export function SharedGoalForm({ members }: { members: User[] }) {
  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Create Shared Goal</h2>
        <p className="text-sm text-slate-500">
          Push a departmental KPI to selected employees. Recipients can adjust only their own weightage (default 20%).
        </p>
      </div>
      <form action={pushSharedGoal} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Goal Title</span>
            <Input name="title" placeholder="e.g. Cost per Acquisition" required />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Thrust Area</span>
            <Input name="thrustArea" placeholder="e.g. Cost Optimization" required />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-semibold text-slate-500">Description</span>
            <Textarea name="description" placeholder="Describe the departmental KPI and expected outcome." />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">UoM Type</span>
            <Select name="uomType" defaultValue="numeric">
              <option value="numeric">Numeric</option>
              <option value="percentage">Percentage</option>
              <option value="timeline">Timeline</option>
              <option value="zero">Zero-based</option>
            </Select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Score Direction</span>
            <Select name="scoreDirection" defaultValue="lower_is_better">
              <option value="higher_is_better">Higher is better</option>
              <option value="lower_is_better">Lower is better</option>
            </Select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Target</span>
            <Input name="target" placeholder="e.g. 10" required />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Primary Owner</span>
            <Select name="primaryOwnerUserId" defaultValue={members[0]?.id ?? ""}>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.designation})
                </option>
              ))}
            </Select>
          </label>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500">Recipients (primary owner must be checked)</p>
          {members.length === 0 ? (
            <p className="text-sm text-slate-400">No team members available.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <label key={member.id} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                  <input
                    type="checkbox"
                    name="recipientUserIds"
                    value={member.id}
                    className="h-4 w-4 accent-indigo-600"
                  />
                  <span className="font-medium text-slate-700">{member.name}</span>
                  <span className="text-slate-400">{member.department}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" disabled={members.length === 0}>
          Create &amp; Assign Shared Goal
        </Button>
      </form>
    </Card>
  );
}
