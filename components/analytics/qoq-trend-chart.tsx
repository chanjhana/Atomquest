"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function QoqTrendChart({ data }: { data: Array<{ quarter: string; score: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <XAxis dataKey="quarter" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="score" stroke="#0f766e" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}
