import { Card, CardTitle } from "@/components/ui/card";
import { CompletionRateChart } from "@/components/analytics/completion-rate-chart";
import { ManagerEffectivenessChart } from "@/components/analytics/manager-effectiveness-chart";
import { QoqTrendChart } from "@/components/analytics/qoq-trend-chart";
import { StatusDistributionChart } from "@/components/analytics/status-distribution-chart";
import { requireRole } from "@/lib/auth/require-role";
import { getAnalyticsDashboardData } from "@/lib/services/live-data";

export default async function AdminAnalyticsPage() {
  await requireRole(["admin"]);
  const data = await getAnalyticsDashboardData();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-950">Organization Analytics</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardTitle>QoQ Achievement Trend</CardTitle><QoqTrendChart data={data.qoqTrend} /></Card>
        <Card><CardTitle>Completion Rate by Quarter</CardTitle><CompletionRateChart data={data.completionRate} /></Card>
        <Card><CardTitle>Goal Status Distribution</CardTitle><StatusDistributionChart data={data.statusDistribution} /></Card>
        <Card><CardTitle>Goal Distribution by Thrust Area</CardTitle><StatusDistributionChart data={data.thrustAreaDistribution} /></Card>
        <Card className="lg:col-span-2"><CardTitle>Manager Effectiveness — Check-in Review Completion</CardTitle><ManagerEffectivenessChart data={data.managerEffectiveness} /></Card>
      </div>
    </div>
  );
}
