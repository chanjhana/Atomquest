"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function CompletionRateChart({ data }: { data: Array<{ quarter: string; completed: number; total: number }> }) {
  const rows = data.map((item) => ({ ...item, rate: Math.round((item.completed / item.total) * 100) }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={rows}>
        <XAxis dataKey="quarter" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="rate" fill="#f97316" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
