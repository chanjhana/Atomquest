import { activateCycle } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Cycle } from "@/lib/domain/types";

function toDateInput(iso: string) {
  return iso.slice(0, 10);
}

export function CycleForm({ cycle }: { cycle: Cycle }) {
  return (
    <form action={activateCycle}>
      <input type="hidden" name="cycleId" value={cycle.id} />
      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Active Cycle</h2>
          <p className="text-sm text-slate-500">Configure windows used by goal setting and quarterly check-ins.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Cycle Name</label>
            <Input name="name" defaultValue={cycle.name} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Goal Setting Start</label>
            <Input type="date" name="goalSettingStart" defaultValue={toDateInput(cycle.goalSettingStart)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Goal Setting End</label>
            <Input type="date" name="goalSettingEnd" defaultValue={toDateInput(cycle.goalSettingEnd)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Q1 Start</label>
            <Input type="date" name="q1Start" defaultValue={toDateInput(cycle.q1Start)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Q1 End</label>
            <Input type="date" name="q1End" defaultValue={toDateInput(cycle.q1End)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Q2 Start</label>
            <Input type="date" name="q2Start" defaultValue={toDateInput(cycle.q2Start)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Q2 End</label>
            <Input type="date" name="q2End" defaultValue={toDateInput(cycle.q2End)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Q3 Start</label>
            <Input type="date" name="q3Start" defaultValue={toDateInput(cycle.q3Start)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Q3 End</label>
            <Input type="date" name="q3End" defaultValue={toDateInput(cycle.q3End)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Q4 Start</label>
            <Input type="date" name="q4Start" defaultValue={toDateInput(cycle.q4Start)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Q4 End</label>
            <Input type="date" name="q4End" defaultValue={toDateInput(cycle.q4End)} />
          </div>
        </div>
        <Button type="submit">Activate Cycle</Button>
      </Card>
    </form>
  );
}
