import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import type { GoalSheet, User } from "@/lib/domain/types";

export function TeamCheckInTable({
  rows
}: {
  rows: Array<{ employee: User; sheet: GoalSheet; submitted: boolean; reviewed: boolean }>;
}) {
  return (
    <Card>
      <Table>
        <thead>
          <tr>
            <Th>Employee</Th>
            <Th>Sheet Status</Th>
            <Th>Check-in</Th>
            <Th>Manager Review</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.employee.id}>
              <Td>{row.employee.name}</Td>
              <Td>{row.sheet.status.replaceAll("_", " ")}</Td>
              <Td><Badge tone={row.submitted ? "green" : "amber"}>{row.submitted ? "Submitted" : "Pending"}</Badge></Td>
              <Td><Badge tone={row.reviewed ? "purple" : "slate"}>{row.reviewed ? "Reviewed" : "Awaiting review"}</Badge></Td>
              <Td>
                <Link href={`/dashboard/manager/check-ins/${row.employee.id}`}>
                  <Button variant="secondary">Open</Button>
                </Link>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
