import { Card, CardTitle } from "@/components/ui/card";
import { CompletionRateChart } from "@/components/analytics/completion-rate-chart";
import { QoqTrendChart } from "@/components/analytics/qoq-trend-chart";
import { StatusDistributionChart } from "@/components/analytics/status-distribution-chart";
import { requireRole } from "@/lib/auth/require-role";
import { getAnalyticsDashboardData } from "@/lib/services/live-data";

export default async function ManagerAnalyticsPage() {
  await requireRole(["manager"]);
  const data = await getAnalyticsDashboardData();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-950">Team Analytics</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardTitle>QoQ Achievement Trend</CardTitle><QoqTrendChart data={data.qoqTrend} /></Card>
        <Card><CardTitle>Completion Rate</CardTitle><CompletionRateChart data={data.completionRate} /></Card>
        <Card><CardTitle>Status Distribution</CardTitle><StatusDistributionChart data={data.statusDistribution} /></Card>
      </div>
    </div>
  );
}
