import { Card } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import type { AuditLog } from "@/lib/domain/types";
import { formatDate } from "@/lib/utils";

export function AuditLogTable({ logs }: { logs: AuditLog[] }) {
  return (
    <Card>
      <Table>
        <thead>
          <tr>
            <Th>Date</Th>
            <Th>Action</Th>
            <Th>Actor</Th>
            <Th>Target</Th>
            <Th>Detail</Th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <Td>{formatDate(log.createdAt)}</Td>
              <Td>{log.action}</Td>
              <Td>{log.actorName}</Td>
              <Td>{log.target}</Td>
              <Td>{log.reason ?? `${log.oldValue ?? ""} → ${log.newValue ?? ""}`}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
