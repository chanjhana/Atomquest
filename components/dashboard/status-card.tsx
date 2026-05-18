import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function StatusCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        {Icon ? <Icon className="h-4 w-4 text-slate-300" /> : null}
      </div>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
      {hint ? <p className="mt-1 text-sm text-slate-500">{hint}</p> : null}
    </Card>
  );
}
