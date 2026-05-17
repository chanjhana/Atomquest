import type { ScoreDirection, UomType } from "@/lib/domain/enums";

type ScoreInput = {
  uomType: UomType;
  target: string;
  actualValue: string;
  scoreDirection?: ScoreDirection | null;
};

function toNumber(value: string) {
  const match = value.match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : Number.NaN;
}

export function computeProgressScore({ uomType, target, actualValue, scoreDirection }: ScoreInput) {
  if (uomType === "zero") {
    return toNumber(actualValue) === 0 ? 100 : 0;
  }

  if (uomType === "timeline") {
    const actual = new Date(actualValue).getTime();
    const deadline = new Date(target).getTime();
    if (Number.isNaN(actual) || Number.isNaN(deadline)) return 0;
    return actual <= deadline ? 100 : 0;
  }

  const actual = toNumber(actualValue);
  const planned = toNumber(target);
  if (!actual || !planned || Number.isNaN(actual) || Number.isNaN(planned)) return 0;

  const raw = scoreDirection === "lower_is_better" ? planned / actual : actual / planned;
  return Math.min(100, Math.max(0, raw * 100));
}
