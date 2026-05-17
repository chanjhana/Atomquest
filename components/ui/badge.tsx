import { cn } from "@/lib/utils";

type BadgeTone = "slate" | "blue" | "amber" | "green" | "red" | "teal" | "purple";

const tones: Record<BadgeTone, string> = {
  slate: "bg-slate-100 text-slate-700",
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-800",
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-700",
  teal: "bg-teal-100 text-teal-800",
  purple: "bg-purple-100 text-purple-700"
};

export function Badge({
  children,
  tone = "slate",
  className
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone], className)}>{children}</span>;
}
