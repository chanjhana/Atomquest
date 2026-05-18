import type { LucideIcon } from "lucide-react";

export function StatusCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  accent?: boolean;
}) {
  return (
    <div className={`border-2 border-black p-6 ${accent ? "bg-[#FF3000]" : "bg-white"}`}>
      <div className="flex items-start justify-between gap-2">
        <p className={`text-xs font-black uppercase tracking-wider ${accent ? "text-white/80" : "text-black/60"}`}>
          {label}
        </p>
        {Icon ? <Icon className={`h-4 w-4 shrink-0 ${accent ? "text-white/70" : "text-black/35"}`} /> : null}
      </div>
      <p className={`mt-3 text-4xl font-black tracking-tighter ${accent ? "text-white" : "text-black"}`}>
        {value}
      </p>
      {hint ? (
        <p className={`mt-1 text-xs uppercase tracking-wide ${accent ? "text-white/75" : "text-black/55"}`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
