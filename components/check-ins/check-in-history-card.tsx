import { Card } from "@/components/ui/card";
import { ProgressScoreDisplay } from "./progress-score-display";
import type { CheckIn } from "@/lib/domain/types";

export function CheckInHistoryCard({ item }: { item: CheckIn & { goalTitle: string } }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.quarter.toUpperCase()}</p>
          <h3 className="mt-1 font-semibold text-slate-950">{item.goalTitle}</h3>
          <p className="mt-2 text-sm text-slate-600">Actual: {item.actualValue}</p>
          {item.managerComment ? <p className="mt-2 text-sm text-slate-600">Manager comment: {item.managerComment}</p> : null}
        </div>
        <ProgressScoreDisplay score={item.computedScore} />
      </div>
    </Card>
  );
}
