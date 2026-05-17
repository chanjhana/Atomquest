import { Card } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";

export function ReportTable({
  rows
}: {
  rows: Array<{ employeeName: string; department: string; goalTitle: string; thrustArea: string; uom: string; target: string; actual: string; score: string; status: string }>;
}) {
  return (
    <Card>
      <Table>
        <thead>
          <tr>
            <Th>Employee</Th>
            <Th>Goal</Th>
            <Th>Target</Th>
            <Th>Actual</Th>
            <Th>Score</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.employeeName}-${row.goalTitle}`}>
              <Td>{row.employeeName}<br /><span className="text-xs text-slate-500">{row.department}</span></Td>
              <Td>{row.goalTitle}<br /><span className="text-xs text-slate-500">{row.thrustArea}</span></Td>
              <Td>{row.target}</Td>
              <Td>{row.actual}</Td>
              <Td>{row.score}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
