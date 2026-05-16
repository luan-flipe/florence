"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function SourceBars({ data }: { data: { source: string; count: number }[] }) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <h3 className="font-semibold mb-4">Leads por fonte</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" fontSize={11} allowDecimals={false} />
          <YAxis type="category" dataKey="source" fontSize={11} width={80} />
          <Tooltip />
          <Bar dataKey="count" fill="#0096d2" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
