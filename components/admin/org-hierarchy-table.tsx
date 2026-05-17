import { Card } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";

export function OrgHierarchyTable({
  rows
}: {
  rows: Array<{ id: string; name: string; department: string; role: string; managerName: string; designation: string }>;
}) {
  return (
    <Card>
      <Table>
        <thead>
          <tr>
            <Th>Employee</Th>
            <Th>Department</Th>
            <Th>Role</Th>
            <Th>Reports To</Th>
            <Th>Designation</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <Td>{row.name}</Td>
              <Td>{row.department}</Td>
              <Td>{row.role}</Td>
              <Td>{row.managerName}</Td>
              <Td>{row.designation}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
