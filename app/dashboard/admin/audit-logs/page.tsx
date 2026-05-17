import { AuditLogTable } from "@/components/admin/audit-log-table";
import { requireRole } from "@/lib/auth/require-role";
import { getAuditLogsData } from "@/lib/services/live-data";

export default async function AdminAuditLogsPage() {
  await requireRole(["admin"]);
  const logs = await getAuditLogsData();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Audit Logs</h1>
        <p className="text-slate-500">Append-only history of sensitive workflow changes.</p>
      </div>
      <AuditLogTable logs={logs} />
    </div>
  );
}
