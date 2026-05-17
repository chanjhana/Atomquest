import { ReportFilterBar } from "@/components/reports/report-filter-bar";
import { ReportTable } from "@/components/reports/report-table";
import { requireRole } from "@/lib/auth/require-role";
import { getReportRowsData } from "@/lib/services/live-data";

export default async function AdminReportsPage({
  searchParams
}: {
  searchParams?: { department?: string; quarter?: string };
}) {
  await requireRole(["admin"]);
  const department = searchParams?.department;
  const quarter = searchParams?.quarter;
  const rows = await getReportRowsData({ department, quarter });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Reports & Export</h1>
        <p className="text-slate-500">Export planned vs actual achievement in CSV format.</p>
      </div>
      <ReportFilterBar department={department} quarter={quarter} />
      <ReportTable rows={rows} />
    </div>
  );
}
