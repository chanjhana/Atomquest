import { Badge } from "@/components/ui/badge";

export function ProgressScoreDisplay({ score }: { score: number }) {
  const tone = score >= 90 ? "green" : score >= 70 ? "amber" : "red";
  return <Badge tone={tone}>{Math.round(score)}% score</Badge>;
}
