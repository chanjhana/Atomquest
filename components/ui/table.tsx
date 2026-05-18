import { cn } from "@/lib/utils";

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("w-full border-separate border-spacing-0 text-left text-sm", className)}>{children}</table>
    </div>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b-2 border-black bg-[#F2F2F2] px-4 py-3 text-xs font-black uppercase tracking-wider text-black">
      {children}
    </th>
  );
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={cn("border-b border-black/15 px-4 py-3.5 align-top text-sm text-black", className)}>
      {children}
    </td>
  );
}
