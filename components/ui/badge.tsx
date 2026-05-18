import { cn } from "@/lib/utils";

type BadgeTone = "slate" | "blue" | "amber" | "green" | "red" | "teal" | "purple";

const tones: Record<BadgeTone, string> = {
  slate:  "bg-[#F2F2F2] text-black border border-black",
  blue:   "bg-black text-white",
  amber:  "border-2 border-black bg-white text-black",
  green:  "bg-black text-white",
  red:    "bg-[#FF3000] text-white",
  teal:   "bg-black text-white",
  purple: "bg-[#F2F2F2] text-black border border-black",
};

export function Badge({
  children,
  tone = "slate",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex px-2.5 py-1 text-xs font-black uppercase tracking-wider", tones[tone], className)}>
      {children}
    </span>
  );
}
