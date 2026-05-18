import { Card } from "@/components/ui/card";
import type { AuditLog } from "@/lib/domain/types";
import { formatDateTime, formatRelative } from "@/lib/utils";

const actionColors: Record<string, string> = {
  submit: "bg-blue-50 text-blue-700",
  approve: "bg-green-50 text-green-700",
  return: "bg-amber-50 text-amber-700",
  unlock: "bg-violet-50 text-violet-700",
  resolve: "bg-teal-50 text-teal-700",
  submit_checkin: "bg-indigo-50 text-indigo-700",
};

function ActionBadge({ action }: { action: string }) {
  const key = Object.keys(actionColors).find((k) => action.toLowerCase().includes(k)) ?? "";
  const cls = actionColors[key] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {action.replaceAll("_", " ")}
    </span>
  );
}

export function AuditLogTable({ logs }: { logs: AuditLog[] }) {
  if (logs.length === 0) {
    return (
      <Card>
        <p className="py-12 text-center text-sm text-slate-400">No audit events recorded yet.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              {["Date", "Action", "Actor", "Target", "Detail"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-700">{formatDateTime(log.createdAt)}</p>
                  <p className="text-xs text-slate-400">{formatRelative(log.createdAt)}</p>
                </td>
                <td className="px-4 py-3">
                  <ActionBadge action={log.action} />
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">{log.actorName}</td>
                <td className="px-4 py-3 text-slate-600">{log.target}</td>
                <td className="px-4 py-3 text-slate-500">
                  {log.reason ?? (log.oldValue || log.newValue ? `${log.oldValue ?? "—"} → ${log.newValue ?? "—"}` : "—")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
