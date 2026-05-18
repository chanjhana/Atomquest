"use client";

import { useFormState, useFormStatus } from "react-dom";
import { activateCycle } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Cycle } from "@/lib/domain/types";
import { CheckCircle2, Loader2, Zap } from "lucide-react";

function toDateInput(iso: string) {
  return iso.slice(0, 10);
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="gap-2">
      {pending ? (
        <><Loader2 className="h-4 w-4 animate-spin" />Activating…</>
      ) : (
        <><Zap className="h-4 w-4" />Activate Cycle</>
      )}
    </Button>
  );
}

export function CycleForm({ cycle }: { cycle: Cycle }) {
  const [state, formAction] = useFormState(activateCycle, {});

  return (
    <form action={formAction}>
      <input type="hidden" name="cycleId" value={cycle.id} />
      <Card className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Active Cycle</h2>
          <p className="text-sm text-slate-500">Configure windows used by goal setting and quarterly check-ins.</p>
        </div>

        {state.success ? (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {state.success}
          </div>
        ) : null}
        {state.error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Cycle Name</label>
            <Input name="name" defaultValue={cycle.name} />
          </div>
          {([
            ["goalSettingStart", "Goal Setting Start", cycle.goalSettingStart],
            ["goalSettingEnd", "Goal Setting End", cycle.goalSettingEnd],
            ["q1Start", "Q1 Start", cycle.q1Start],
            ["q1End", "Q1 End", cycle.q1End],
            ["q2Start", "Q2 Start", cycle.q2Start],
            ["q2End", "Q2 End", cycle.q2End],
            ["q3Start", "Q3 Start", cycle.q3Start],
            ["q3End", "Q3 End", cycle.q3End],
            ["q4Start", "Q4 Start", cycle.q4Start],
            ["q4End", "Q4 End", cycle.q4End],
          ] as const).map(([name, label, value]) => (
            <div key={name}>
              <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
              <Input type="date" name={name} defaultValue={toDateInput(value)} />
            </div>
          ))}
        </div>

        <SubmitButton />
      </Card>
    </form>
  );
}
