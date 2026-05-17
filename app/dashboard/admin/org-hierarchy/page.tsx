import { EditUserModal } from "@/components/admin/edit-user-modal";
import { OrgHierarchyTable } from "@/components/admin/org-hierarchy-table";
import { requireRole } from "@/lib/auth/require-role";
import { getOrgRowsData } from "@/lib/services/live-data";

export default async function OrgHierarchyPage() {
  await requireRole(["admin"]);
  const rows = await getOrgRowsData();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Org Hierarchy Management</h1>
        <p className="text-slate-500">Reporting lines power manager dashboards, approvals, and escalation chains.</p>
      </div>
      <OrgHierarchyTable rows={rows} />
      <EditUserModal users={rows} />
    </div>
  );
}
