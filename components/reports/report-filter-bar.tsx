"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

export function ReportFilterBar({
  department,
  quarter
}: {
  department?: string;
  quarter?: string;
}) {
  const router = useRouter();
  const [dept, setDept] = useState(department ?? "all");
  const [q, setQ] = useState(quarter ?? "q1");

  function handleApply() {
    const params = new URLSearchParams();
    if (dept !== "all") params.set("department", dept);
    params.set("quarter", q);
    router.push(`/dashboard/admin/reports?${params.toString()}`);
  }

  const csvParams = new URLSearchParams();
  if (department && department !== "all") csvParams.set("department", department);
  if (quarter) csvParams.set("quarter", quarter);
  const csvHref = `/api/reports/achievement?${csvParams.toString()}`;

  return (
    <Card className="flex flex-wrap items-end gap-3">
      <label className="space-y-1">
        <span className="text-xs font-semibold text-slate-500">Department</span>
        <Select value={dept} onChange={(e) => setDept(e.target.value)}>
          <option value="all">All</option>
          <option value="engineering">Engineering</option>
          <option value="product">Product</option>
          <option value="design">Design</option>
        </Select>
      </label>
      <label className="space-y-1">
        <span className="text-xs font-semibold text-slate-500">Quarter</span>
        <Select value={q} onChange={(e) => setQ(e.target.value)}>
          <option value="q1">Q1</option>
          <option value="q2">Q2</option>
          <option value="q3">Q3</option>
          <option value="q4">Q4</option>
        </Select>
      </label>
      <Button type="button" variant="secondary" onClick={handleApply}>Apply Filter</Button>
      <a href={csvHref}>
        <Button>Export CSV</Button>
      </a>
    </Card>
  );
}
