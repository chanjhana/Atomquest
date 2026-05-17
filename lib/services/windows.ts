import type { Cycle } from "@/lib/domain/types";
import type { Quarter } from "@/lib/domain/enums";

export function isGoalSettingOpen(cycle: Cycle, now = new Date("2026-05-17")) {
  return now >= new Date(cycle.goalSettingStart) && now <= new Date(cycle.goalSettingEnd);
}

export function isQuarterOpen(cycle: Cycle, quarter: Quarter, now = new Date("2026-07-17")) {
  const start = cycle[`${quarter}Start` as const];
  const end = cycle[`${quarter}End` as const];
  return now >= new Date(start) && now <= new Date(end);
}

export function activeQuarter(cycle: Cycle): Quarter {
  if (isQuarterOpen(cycle, "q1")) return "q1";
  if (isQuarterOpen(cycle, "q2")) return "q2";
  if (isQuarterOpen(cycle, "q3")) return "q3";
  return "q4";
}
