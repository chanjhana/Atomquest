import { updateOrgHierarchy } from "@/app/actions/users";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

type OrgRow = { id: string; name: string; role: string };

export function EditUserModal({ users }: { users: OrgRow[] }) {
  const assignable = users.filter((u) => u.role !== "admin");
  const managers = users.filter((u) => u.role === "manager" || u.role === "admin");

  return (
    <Card className="border-dashed">
      <h3 className="font-semibold text-slate-950">Edit Reporting Line</h3>
      <p className="mt-1 text-sm text-slate-500">Change who an employee or manager reports to. Changes take effect immediately.</p>
      <form action={updateOrgHierarchy} className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Employee to update</label>
          <Select name="targetUserId">
            {assignable.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Reports to</label>
          <Select name="newManagerId">
            {managers.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-2">
          <Button type="submit">Save Hierarchy Change</Button>
        </div>
      </form>
    </Card>
  );
}
