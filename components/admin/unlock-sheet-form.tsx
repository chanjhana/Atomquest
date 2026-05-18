"use client";

import { useFormState, useFormStatus } from "react-dom";
import { unlockGoalSheet, type UnlockFormState } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="secondary" disabled={pending} className="gap-2">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
      {pending ? "Unlocking…" : "Unlock Goal Sheet"}
    </Button>
  );
}

interface Sheet {
  id: string;
  user: { name: string };
  approvedAt: Date | null;
}

export function UnlockSheetForm({ sheet }: { sheet: Sheet }) {
  const [state, formAction] = useFormState<UnlockFormState, FormData>(unlockGoalSheet, {});

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-slate-200 p-4">
      <input type="hidden" name="sheetId" value={sheet.id} />
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
          {sheet.user.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900">{sheet.user.name}</p>
          <p className="text-xs text-slate-400">Approved {formatDate(sheet.approvedAt)}</p>
        </div>
      </div>
      <Textarea name="reason" placeholder="Reason for unlock (required for audit log)" className="text-sm" />
      {state.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-700">{state.success}</p>
      )}
      <SubmitButton />
    </form>
  );
}
