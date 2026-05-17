import { resolveEscalation } from "@/app/actions/escalations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import type { Escalation } from "@/lib/domain/types";
import { escalationLevelLabel } from "@/lib/services/escalations";

export function EscalationTable({ items }: { items: Escalation[] }) {
  return (
    <Card>
      <Table>
        <thead>
          <tr>
            <Th>Employee</Th>
            <Th>Rule</Th>
            <Th>Level</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <Td>{item.employeeName}<br /><span className="text-xs text-slate-500">Manager: {item.managerName}</span></Td>
              <Td>{item.ruleType.replaceAll("_", " ")}</Td>
              <Td>{escalationLevelLabel(item.escalationLevel)}</Td>
              <Td><Badge tone={item.status === "open" ? "red" : item.status === "acknowledged" ? "amber" : "green"}>{item.status}</Badge></Td>
              <Td>
                {item.status !== "resolved" ? (
                  <form action={resolveEscalation}>
                    <input type="hidden" name="escalationId" value={item.id} />
                    <Button variant="secondary" type="submit">Resolve</Button>
                  </form>
                ) : null}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
