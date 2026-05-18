"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type ReportRow = {
  employeeName: string;
  department: string;
  goalTitle: string;
  thrustArea: string;
  uom: string;
  target: string;
  actual: string;
  score: string;
  status: string;
};

function ScoreBadge({ score }: { score: string }) {
  const num = parseFloat(score);
  const tone = num >= 90 ? "green" : num >= 70 ? "amber" : "red";
  return <Badge tone={tone}>{score}</Badge>;
}

function SortIcon({ isSorted }: { isSorted: false | "asc" | "desc" }) {
  if (isSorted === "asc") return <ArrowUp className="ml-1 inline h-3 w-3" />;
  if (isSorted === "desc") return <ArrowDown className="ml-1 inline h-3 w-3" />;
  return <ArrowUpDown className="ml-1 inline h-3 w-3 text-slate-300" />;
}

const columns: ColumnDef<ReportRow>[] = [
  {
    accessorKey: "employeeName",
    header: "Employee",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-slate-900">{row.original.employeeName}</p>
        <p className="text-xs text-slate-400">{row.original.department}</p>
      </div>
    ),
  },
  {
    accessorKey: "goalTitle",
    header: "Goal",
    cell: ({ row }) => (
      <div>
        <p className="text-slate-800">{row.original.goalTitle}</p>
        <p className="text-xs text-slate-400">{row.original.thrustArea}</p>
      </div>
    ),
  },
  { accessorKey: "uom", header: "UoM" },
  { accessorKey: "target", header: "Target" },
  { accessorKey: "actual", header: "Actual" },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ getValue }) => <ScoreBadge score={String(getValue())} />,
    sortingFn: (a, b) =>
      parseFloat(a.original.score) - parseFloat(b.original.score),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => (
      <span className="text-sm capitalize text-slate-600">{String(getValue()).replaceAll("_", " ")}</span>
    ),
  },
];

export function ReportTable({ rows }: { rows: ReportRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-800"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <SortIcon isSorted={header.column.getIsSorted()} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-sm text-slate-400">
                  No data for the selected filters.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-slate-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
