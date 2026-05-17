export function WeightageBar({ total }: { total: number }) {
  const isValid = total === 100;
  const width = Math.min(total, 100);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">Total weightage</span>
        <span className={isValid ? "font-semibold text-green-700" : "font-semibold text-amber-700"}>{total}% / 100%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div className={isValid ? "h-full bg-green-500" : "h-full bg-amber-500"} style={{ width: `${width}%` }} />
      </div>
      {!isValid ? <p className="mt-2 text-xs text-amber-700">Submission is blocked until total weightage equals exactly 100%.</p> : null}
    </div>
  );
}
