import { cn } from "@/lib/utils";

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("w-full border-separate border-spacing-0 text-left text-sm", className)}>{children}</table>
    </div>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return <th className="border-b border-slate-200 px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{children}</th>;
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("border-b border-slate-100 px-3 py-3 align-top text-slate-700", className)}>{children}</td>;
}
