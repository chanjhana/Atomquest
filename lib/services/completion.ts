import { getCompletionSummary } from "./demo-store";

export function completionRate(completed: number, total: number) {
  return total === 0 ? 0 : Math.round((completed / total) * 100);
}

export function getCompletionDashboard(managerId?: string) {
  const summary = getCompletionSummary(managerId);
  return {
    ...summary,
    checkInRate: completionRate(summary.checkInSubmitted, summary.total),
    managerReviewRate: completionRate(summary.managerReviewed, summary.total)
  };
}
