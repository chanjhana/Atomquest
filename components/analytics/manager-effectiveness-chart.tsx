"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ManagerEffectivenessChart({ data }: { data: Array<{ manager: string; rate: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <XAxis dataKey="manager" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="rate" fill="#0f766e" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
