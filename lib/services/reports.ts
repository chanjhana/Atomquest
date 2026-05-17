import { getReportRows } from "./demo-store";

export function getAchievementReportRows() {
  return getReportRows();
}

export function toCsv(rows: ReturnType<typeof getAchievementReportRows>) {
  const headers = ["Employee Name", "Department", "Goal Title", "Thrust Area", "UoM", "Target", "Actual", "Score", "Status"];
  const values = rows.map((row) => [
    row.employeeName,
    row.department,
    row.goalTitle,
    row.thrustArea,
    row.uom,
    row.target,
    row.actual,
    row.score,
    row.status
  ]);
  return [headers, ...values].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
}
